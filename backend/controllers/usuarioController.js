const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.obtenerTodos = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.activo,
              r.nombre AS role, r.id_role AS role_id,
              u.created_at, u.updated_at
       FROM usuarios u
       INNER JOIN roles r ON u.role_id = r.id_role
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [usuarios] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.activo,
              r.nombre AS role, r.id_role AS role_id,
              u.created_at, u.updated_at
       FROM usuarios u
       INNER JOIN roles r ON u.role_id = r.id_role
       WHERE u.id_usuario = ?`,
      [id]
    );
    if (usuarios.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: usuarios[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
};

exports.crear = async (req, res) => {
  const { nombre, apellido, email, password, role_id } = req.body;
  try {
    if (!nombre || !apellido || !email || !password || !role_id) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
    }
    const [usuariosExistentes] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [resultado] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, email, pass_hash, role_id, activo)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [nombre, apellido, email, hashedPassword, role_id]
    );
    const [nuevoUsuario] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.activo,
              r.nombre AS role, r.id_role AS role_id,
              u.created_at, u.updated_at
       FROM usuarios u
       INNER JOIN roles r ON u.role_id = r.id_role
       WHERE u.id_usuario = ?`,
      [resultado.insertId]
    );
    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: nuevoUsuario[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, role_id, activo } = req.body;
  try {
    const [usuarioExistente] = await db.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id]);
    if (usuarioExistente.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (email) {
      const [emailDuplicado] = await db.query(
        'SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?',
        [email, id]
      );
      if (emailDuplicado.length > 0) {
        return res.status(400).json({ success: false, message: 'El email ya está registrado por otro usuario' });
      }
    }
    let campos = [];
    let valores = [];
    if (nombre !== undefined) { campos.push('nombre = ?'); valores.push(nombre); }
    if (apellido !== undefined) { campos.push('apellido = ?'); valores.push(apellido); }
    if (email !== undefined) { campos.push('email = ?'); valores.push(email); }
    if (password !== undefined && password !== '') {
      const hashedPassword = await bcrypt.hash(password, 12);
      campos.push('pass_hash = ?');
      valores.push(hashedPassword);
    }
    if (role_id !== undefined) { campos.push('role_id = ?'); valores.push(role_id); }
    if (activo !== undefined) { campos.push('activo = ?'); valores.push(activo); }
    if (campos.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }
    valores.push(id);
    await db.query(
      `UPDATE usuarios SET ${campos.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ?`,
      valores
    );
    const [usuarioActualizado] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.activo,
              r.nombre AS role, r.id_role AS role_id,
              u.created_at, u.updated_at
       FROM usuarios u
       INNER JOIN roles r ON u.role_id = r.id_role
       WHERE u.id_usuario = ?`,
      [id]
    );
    res.json({ success: true, message: 'Usuario actualizado exitosamente', data: usuarioActualizado[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const [usuarioExistente] = await db.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id]);
    if (usuarioExistente.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    res.status(204).send();
  } catch (error) {
    if (error && (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451)) {
      return res.status(409).json({ success: false, message: 'No se puede eliminar: tiene registros asociados' });
    }
    res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
  }
};

exports.obtenerRoles = async (req, res) => {
  try {
    const [roles] = await db.query('SELECT id_role, nombre FROM roles ORDER BY nombre');
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener roles', error: error.message });
  }
};
