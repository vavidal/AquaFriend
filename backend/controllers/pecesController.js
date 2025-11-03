const db = require('../config/database');

// Obtener todos los peces
exports.getPeces = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM peces ORDER BY fecha_registro DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener peces:', error);
    res.status(500).json({ message: 'Error al obtener peces' });
  }
};

// Crear un nuevo pez
exports.createPez = async (req, res) => {
  try {
    const { especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial } = req.body;

    if (!especie || !habitat) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const sql = `
      INSERT INTO peces (especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [especie, habitat, alimentacion, tamano_promedio, descripcion, imagen_referencial]);

    res.status(201).json({ message: 'Pez creado exitosamente' });
  } catch (error) {
    console.error('Error al crear pez:', error);
    res.status(500).json({ message: 'Error al crear pez' });
  }
};
