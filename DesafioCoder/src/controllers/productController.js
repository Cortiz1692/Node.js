const fs = require('fs');

const productsFilePath = 'productos.json';


function getProducts() {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}


function getProductById(id) {
  const products = this.getProducts();
    const product = products.find(product => String(product.id) === String(id));
  
    if (!product) {
      throw new Error('Producto no encontrado');
    }
  
    return product;
  }

function addProduct(newProduct, callback) {
  const { title, description, code, price, status, stock, category } = newProduct;

  // Verificar que los campos obligatorios estén presentes
  if (!title || !description || !code || !price || !status || !stock || !category) {
    callback('Todos los campos obligatorios deben estar presentes', null);
    return;
  }

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor', null);
    } else {
      const products = JSON.parse(data);
      const productId = generateProductId();
      newProduct.id = productId;
      products.push(newProduct);
      fs.writeFile(productsFilePath, JSON.stringify(products), 'utf8', err => {
        if (err) {
          console.error(err);
          callback('Error interno del servidor', null);
        } else {
          callback(null, newProduct);
        }
      });
    }
  });
}


function updateProduct(productId, updatedProduct, callback) {
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor', null);
    } else {
      const products = JSON.parse(data);
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const productToUpdate = products[productIndex];
        const updatedProductWithId = { ...updatedProduct, id: productId };
        products[productIndex] = { ...productToUpdate, ...updatedProductWithId };
        fs.writeFile(productsFilePath, JSON.stringify(products), 'utf8', err => {
          if (err) {
            console.error(err);
            callback('Error interno del servidor', null);
          } else {
            callback(null, updatedProductWithId);
          }
        });
      } else {
        callback('Producto no encontrado', null);
      }
    }
  });
}


function deleteProduct(productId, callback) {
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback('Error interno del servidor');
    } else {
      let products = JSON.parse(data);
      const prevLength = products.length;
      products = products.filter(p => p.id !== productId);
      if (products.length !== prevLength) {
        fs.writeFile(productsFilePath, JSON.stringify(products), 'utf8', err => {
          if (err) {
            console.error(err);
            callback('Error interno del servidor');
          } else {
            callback(null);
          }
        });
      } else {
        callback('Producto no encontrado');
      }
    }
  });
}

function generateProductId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
