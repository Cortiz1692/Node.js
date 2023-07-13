const express = require('express');
const productsController = require('../controllers/productController');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    let products;

    if (limit) {
      products = await productsController.getProducts();
      products = products.slice(0, limit);
    } else {
      products = await productsController.getProducts();
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const product = await productsController.getProductById(productId);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
productsController.addProduct(newProduct, (error, createdProduct) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(201).json(createdProduct);
    }
  });
});

router.put('/:pid', async (req, res) => {
  
  const productId = req.params.pid;
  const updatedProduct = req.body;
  productsController.updateProduct(productId, updatedProduct, (error, updatedProduct) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.json(updatedProduct);
    }
  });
});

router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  productsController.deleteProduct(productId, (error) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
