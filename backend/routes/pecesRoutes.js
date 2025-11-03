const express = require('express');
const router = express.Router();
const pecesController = require('../controllers/pecesController');

// Rutas CRUD
router.get('/', pecesController.getPeces);
router.post('/', pecesController.createPez);

module.exports = router;
