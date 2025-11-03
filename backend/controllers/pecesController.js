
const db = require('../config/database');

exports.getPeces = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_especie, nombre_comun, nombre_cientifico, id_categoria, id_habitat, alimentacion, tamano_promedio, estado_conservacion, descripcion, imagen_principal, fecha_registro FROM especies WHERE id_categoria = 1 ORDER BY fecha_registro DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener peces' });
  }
};

exports.createPez = async (req, res) => {
  try {
    const {
      nombre_comun,
      nombre_cientifico,
      id_habitat,
      alimentacion,
      tamano_promedio,
      estado_conservacion,
      descripcion,
      imagen_principal
    } = req.body;

    const sql = `
      INSERT INTO especies
      (nombre_comun, nombre_cientifico, id_categoria, id_habitat, alimentacion, tamano_promedio, estado_conservacion, descripcion, imagen_principal)
      VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      nombre_comun || '',
      nombre_cientifico || '',
      id_habitat || null,
      alimentacion || '',
      tamano_promedio || '',
      estado_conservacion || '',
      descripcion || '',
      imagen_principal || ''
    ]);

    res.status(201).json({ message: 'Pez creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pez' });
  }
};
