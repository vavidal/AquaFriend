
const db = require('../config/database');

const SELECT_FIELDS = `
  id_especie AS id,
  tipo,
  nombre_comun AS especie,
  habitat,
  alimentacion,
  tamano_promedio,
  descripcion,
  imagen_principal AS imagen_referencial,
  fecha_registro
`;

const sanitizeTipo = value => {
  if (!value) return null;
  const clean = String(value).trim().toLowerCase();
  return clean || null;
};

const resolveTipoFiltro = req => {
  return sanitizeTipo(req.especieTipo || req.query?.tipo);
};

const resolveTipoPayload = (req, bodyTipo) => {
  return sanitizeTipo(req.especieTipo || bodyTipo) || 'pez';
};

exports.getPeces = async (req, res) => {
  try {
    const tipoFiltro = resolveTipoFiltro(req);
    let sql = `SELECT ${SELECT_FIELDS} FROM especies`;
    const params = [];
    if (tipoFiltro) {
      sql += ' WHERE tipo = ?';
      params.push(tipoFiltro);
    }
    sql += ' ORDER BY fecha_registro DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener peces' });
  }
};

exports.getPezById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoFiltro = resolveTipoFiltro(req);
    let sql = `SELECT ${SELECT_FIELDS} FROM especies WHERE id_especie = ?`;
    const params = [id];
    if (tipoFiltro) {
      sql += ' AND tipo = ?';
      params.push(tipoFiltro);
    }
    const [rows] = await db.query(sql, params);
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
      tipo,
    } = req.body;

    const tipoFinal = resolveTipoPayload(req, tipo);

    const sql = `
      INSERT INTO especies
      (tipo, nombre_comun, nombre_cientifico, habitat, alimentacion, tamano_promedio, estado_conservacion, descripcion, imagen_principal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      tipoFinal,
      especie || '',
      '',
      habitat || '',
      alimentacion || '',
      tamano_promedio || '',
      '',
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
      tipo,
    } = req.body;

    const tipoFiltro = resolveTipoPayload(req, tipo);

    const sql = `
      UPDATE especies
      SET tipo = ?,
          nombre_comun = ?,
          habitat = ?,
          alimentacion = ?,
          tamano_promedio = ?,
          estado_conservacion = ?,
          descripcion = ?,
          imagen_principal = ?
      WHERE id_especie = ?
    `;

    const [result] = await db.query(sql, [
      tipoFiltro,
      especie || '',
      habitat || '',
      alimentacion || '',
      tamano_promedio || '',
      '',
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
    const tipoFiltro = resolveTipoFiltro(req);
    const params = [numId];
    let where = 'id_especie = ?';
    if (tipoFiltro) {
      where += ' AND tipo = ?';
      params.push(tipoFiltro);
    }

    const [exists] = await db.query(`SELECT id_especie FROM especies WHERE ${where}`, params);
    if (!exists || exists.length === 0) {
      return res.status(404).json({ message: 'Pez no encontrado' });
    }

    const [result] = await db.query(`DELETE FROM especies WHERE ${where} LIMIT 1`, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pez no encontrado' });
    res.json({ message: 'Pez eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pez:', error);
    res.status(500).json({ message: 'Error al eliminar pez' });
  }
};
