const express = require('express');
const router = express.Router();
const especiesController = require('../controllers/pecesController');

router.use((req, _res, next) => {
  req.especieTipo = 'reptil';
  next();
});

router.get('/', especiesController.getPeces);
router.get('/:id', especiesController.getPezById);
router.post('/', especiesController.createPez);
router.put('/:id', especiesController.updatePez);
router.delete('/:id', especiesController.deletePez);

module.exports = router;
