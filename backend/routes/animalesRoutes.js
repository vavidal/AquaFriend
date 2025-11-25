const express = require('express');
const router = express.Router();
const especiesController = require('../controllers/pecesController');

// middleware para setear el tipo de especie antes de llegar al controlador
router.use((req, _res, next) => {
  req.especieTipo = 'mamifero';
  next();
});

router.get('/', especiesController.getPeces);
router.get('/:id', especiesController.getPezById);
router.post('/', especiesController.createPez);
router.put('/:id', especiesController.updatePez);
router.delete('/:id', especiesController.deletePez);

module.exports = router;
