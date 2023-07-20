const express = require('express');
const { socketController } = require('../controllers/socketController');
const router = express.Router();



  router.get('/', socketController);
  
  // Ruta para la vista "realTimeProducts.handlebars"
  module.exports = router;
  