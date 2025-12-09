const db = require('../config/database');
const emailService = require('../services/emailService');

// ================================================================
// CREAR NUEVO CONTACTO
// ================================================================
// Recibe los datos del formulario de contacto del footer
// y los guarda en la base de datos
exports.crearContacto = async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  try {
    // Validar campos requeridos
    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son obligatorios'
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Insertar contacto en la base de datos
    const [result] = await db.query(
      `INSERT INTO contactos (nombre, email, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, telefono || null, mensaje || null]
    );

    // Preparar datos del contacto
    const contactoData = {
      nombre,
      email,
      telefono,
      mensaje
    };

    // Enviar emails (no bloqueante - se ejecuta en background)
    Promise.all([
      emailService.enviarEmailNuevoContactoAdmin(contactoData),
      emailService.enviarEmailConfirmacionUsuario(contactoData)
    ]).catch(err => console.error('⚠️  Error al enviar emails:', err));

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: '¡Gracias por contactarnos! Te responderemos pronto.',
      data: {
        id_contacto: result.insertId
      }
    });

  } catch (error) {
    console.error('❌ Error al crear contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar tu solicitud. Intenta nuevamente.',
      error: error.message
    });
  }
};

// ================================================================
// OBTENER TODOS LOS CONTACTOS (Para panel admin)
// ================================================================
exports.obtenerContactos = async (req, res) => {
  try {
    const [contactos] = await db.query(`
      SELECT
        id_contacto,
        nombre,
        email,
        telefono,
        mensaje,
        fecha_contacto,
        leido
      FROM contactos
      ORDER BY fecha_contacto DESC
    `);

    res.json({
      success: true,
      data: contactos
    });

  } catch (error) {
    console.error('❌ Error al obtener contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
      error: error.message
    });
  }
};

// ================================================================
// MARCAR CONTACTO COMO LEÍDO
// ================================================================
exports.marcarComoLeido = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE contactos SET leido = TRUE WHERE id_contacto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Contacto marcado como leído'
    });

  } catch (error) {
    console.error('❌ Error al marcar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
      error: error.message
    });
  }
};

// ================================================================
// OBTENER CONTACTOS NO LEÍDOS (Para notificaciones)
// ================================================================
exports.obtenerContactosNoLeidos = async (req, res) => {
  try {
    const [contactos] = await db.query(`
      SELECT
        id_contacto,
        nombre,
        email,
        fecha_contacto
      FROM contactos
      WHERE leido = FALSE
      ORDER BY fecha_contacto DESC
    `);

    res.json({
      success: true,
      data: contactos,
      count: contactos.length
    });

  } catch (error) {
    console.error('❌ Error al obtener contactos no leídos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contactos no leídos',
      error: error.message
    });
  }
};

// ================================================================
// ELIMINAR CONTACTO
// ================================================================
exports.eliminarContacto = async (req, res) => {
  const rawId =
    (req.params && req.params.id) ??
    (req.body && (req.body.id ?? req.body.id_contacto));
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID de contacto invalido',
    });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM contactos WHERE id_contacto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Contacto eliminado correctamente'
    });

  } catch (error) {
    console.error('ƒ?O Error al eliminar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
      error: error.message
    });
  }
};
