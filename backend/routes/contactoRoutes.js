const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

// ================================================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ================================================================

// POST /api/contactos - Crear nuevo contacto desde el formulario
router.post('/', contactoController.crearContacto);

// ================================================================
// RUTAS PARA ADMIN (TODO: Agregar middleware de autenticación)
// ================================================================

// GET /api/contactos - Obtener todos los contactos
router.get('/', contactoController.obtenerContactos);

// GET /api/contactos/no-leidos - Obtener contactos pendientes
router.get('/no-leidos', contactoController.obtenerContactosNoLeidos);

// PATCH /api/contactos/:id/leido - Marcar como leído
router.patch('/:id/leido', contactoController.marcarComoLeido);

module.exports = router;
