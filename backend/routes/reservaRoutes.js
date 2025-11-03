const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Ruta para crear una nueva reserva
router.post('/', reservaController.crearReserva);

// Ruta para obtener todas las reservas (admin)
router.get('/', reservaController.obtenerReservas);

// Ruta para obtener programas educativos disponibles
router.get('/programas', reservaController.obtenerProgramas);

// Actualizar estado de una reserva
router.patch('/:id/estado', reservaController.actualizarEstadoReserva);

// Eliminar una reserva
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;
