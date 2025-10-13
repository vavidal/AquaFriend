const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener todos los roles disponibles (debe ir ANTES de /:id)
router.get('/roles/listar', usuarioController.obtenerRoles);

// Obtener todos los usuarios
router.get('/', usuarioController.obtenerTodos);

// Obtener un usuario por ID
router.get('/:id', usuarioController.obtenerPorId);

// Crear nuevo usuario
router.post('/', usuarioController.crear);

// Actualizar usuario
router.put('/:id', usuarioController.actualizar);

// Eliminar usuario (desactivar)
router.delete('/:id', usuarioController.eliminar);

module.exports = router;
