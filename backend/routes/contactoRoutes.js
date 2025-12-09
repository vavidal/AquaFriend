const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

// ================================================================
// RUTAS PUBLICAS (No requieren autenticacion)
// ================================================================

// POST /api/contactos - Crear nuevo contacto desde el formulario
router.post('/', contactoController.crearContacto);

// ================================================================
// RUTAS PARA ADMIN (TODO: Agregar middleware de autenticacion)
// ================================================================

// GET /api/contactos - Obtener todos los contactos
router.get('/', contactoController.obtenerContactos);

// GET /api/contactos/no-leidos - Obtener contactos pendientes
router.get('/no-leidos', contactoController.obtenerContactosNoLeidos);

// PATCH /api/contactos/:id/leido - Marcar como leido
router.patch('/:id/leido', contactoController.marcarComoLeido);

// DELETE /api/contactos/:id - Eliminar contacto
router.delete('/:id', contactoController.eliminarContacto);

// POST /api/contactos/:id/eliminar - Fallback para eliminar contacto
router.post('/:id/eliminar', contactoController.eliminarContacto);

// POST /api/contactos/eliminar - Eliminar enviando el ID en el cuerpo
router.post('/eliminar', contactoController.eliminarContacto);

module.exports = router;
