const fs = require('fs');

const cartsFilePath = 'carrito.json';

function createCart(callback) {
  const newCart = { id: generateCartId(), products: [] };
  fs.writeFile(cartsFilePath, JSON.stringify(newCart), 'utf8', err => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor', null);
    } else {
      callback(null, newCart);
    }
  });
}

function getCartById(cartId, callback) {
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor', null);
    } else {
      const cart = JSON.parse(data);
      if (cart.id === cartId) {
        callback(null, cart.products);
      } else {
        callback('Carrito no encontrado', null);
      }
    }
  });
}

function addProductToCart(cartId, productId, callback) {
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor', null);
    } else {
      const cart = JSON.parse(data);
      if (cart.id === cartId) {
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex !== -1) {
          cart.products[productIndex].quantity++;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }
        fs.writeFile(cartsFilePath, JSON.stringify(cart), 'utf8', err => {
          if (err) {
            console.error(err);
            callback('Error interno del servidor', null);
          } else {
            callback(null, cart.products);
          }
        });
      } else {
        callback('Carrito no encontrado', null);
      }
    }
  });
}

function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart
};
