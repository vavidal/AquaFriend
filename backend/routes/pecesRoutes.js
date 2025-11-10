const express = require('express');
const router = express.Router();
const pecesController = require('../controllers/pecesController');

// Rutas CRUD
router.get('/', pecesController.getPeces);
router.get('/:id', pecesController.getPezById);
router.post('/', pecesController.createPez);
router.put('/:id', pecesController.updatePez);
router.delete('/:id', pecesController.deletePez);

module.exports = router;
