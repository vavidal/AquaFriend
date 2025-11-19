const express = require('express');
const router = express.Router();
const pecesController = require('../controllers/pecesController');

router.use((req, _res, next) => {
  req.especieTipo = 'pez';
  next();
});

router.get('/', pecesController.getPeces);
router.get('/:id', pecesController.getPezById);
router.post('/', pecesController.createPez);
router.put('/:id', pecesController.updatePez);
router.delete('/:id', pecesController.deletePez);

module.exports = router;
