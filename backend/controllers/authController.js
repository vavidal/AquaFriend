const db = require('../config/database');
const bcrypt = require('bcrypt');

// Login con verificación usando bcrypt
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const [usuarios] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.pass_hash, u.activo, r.nombre as role
       FROM usuarios u
       INNER JOIN roles r ON u.role_id = r.id_role
       WHERE u.email = ?`,
      [email]
    );

    // Verificar si existe el usuario
    if (usuarios.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const usuario = usuarios[0];

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar la contraseña usando bcrypt
    const passwordValida = await bcrypt.compare(password, usuario.pass_hash);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Login exitoso
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el login',
      error: error.message
    });
  }
};
