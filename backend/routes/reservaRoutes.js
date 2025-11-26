const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const reservasAnalytics = require('../controllers/reservasAnalyticsController');

// Ruta para crear una nueva reserva
router.post('/', reservaController.crearReserva);

// Dashboard de reservas
router.get('/dashboard', reservasAnalytics.getDashboard);

// Ruta para obtener todas las reservas (admin)
router.get('/', reservaController.obtenerReservas);

// Ruta para obtener programas educativos disponibles
router.get('/programas', reservaController.obtenerProgramas);

// Fechas ocupadas para el calendario público
router.get('/fechas', reservaController.obtenerFechasOcupadas);

// Actualizar estado de una reserva
router.patch('/:id/estado', reservaController.actualizarEstadoReserva);

// Eliminar una reserva
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;
