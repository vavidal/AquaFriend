
const db = require('../config/database');

exports.getPeces = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial, fecha_registro FROM peces ORDER BY fecha_registro DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener peces' });
  }
};

exports.getPezById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial, fecha_registro FROM peces WHERE id = ?',
      [id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Pez no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pez' });
  }
};

exports.createPez = async (req, res) => {
  try {
    const {
      especie,
      habitat,
      alimentacion,
      tamano_promedio,
      descripcion,
      imagen_referencial,
    } = req.body;

    const sql = `
      INSERT INTO peces
      (especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      especie || '',
      habitat || '',
      alimentacion || '',
      tamano_promedio || '',
      descripcion || '',
      imagen_referencial || ''
    ]);

    res.status(201).json({ message: 'Pez creado exitosamente', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pez' });
  }
};

exports.updatePez = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      especie,
      habitat,
      alimentacion,
      tamano_promedio,
      descripcion,
      imagen_referencial,
    } = req.body;

    const sql = `
      UPDATE peces
      SET especie = ?, habitat = ?, alimentacion = ?, tamano_promedio = ?, descripcion = ?, imagen_referencial = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      especie || '',
      habitat || '',
      alimentacion || '',
      tamano_promedio || '',
      descripcion || '',
      imagen_referencial || '',
      id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pez no encontrado' });
    res.json({ message: 'Pez actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pez' });
  }
};

exports.deletePez = async (req, res) => {
  try {
    const { id } = req.params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Verificar existencia antes de borrar (mejor feedback)
    const [exists] = await db.query('SELECT id FROM peces WHERE id = ?', [numId]);
    if (!exists || exists.length === 0) {
      return res.status(404).json({ message: 'Pez no encontrado' });
    }

    const [result] = await db.query('DELETE FROM peces WHERE id = ? LIMIT 1', [numId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pez no encontrado' });
    res.json({ message: 'Pez eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pez:', error);
    res.status(500).json({ message: 'Error al eliminar pez' });
  }
};
