const express = require('express');
const cartsController = require('../controllers/cartsController');
const router = express.Router();

router.post('/', (req, res) => {
  cartsController.createCart((error, newCart) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(201).json(newCart);
    }
  });
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  cartsController.getCartById(cartId, (error, products) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.json(products);
    }
  });
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  cartsController.addProductToCart(cartId, productId, (error, updatedProducts) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.status(201).json(updatedProducts);
    }
  });
});

module.exports = router;
