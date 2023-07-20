const { promises: fs } = require('fs');
const path = require('path');
const Product = require('./product');

const filePath = path.join(__dirname, '../../data/carts.json');

class Cart {
  constructor() {
    this.products = [];
  }

  static async getById(id) {
    try {
      const data = await fs.readFile(filePath);
      const carts = JSON.parse(data);
      const cart = carts.find((cart) => cart.id === Number(id));
      if (cart) {
        const cartInstance = new Cart();
        cartInstance.products = await Promise.all(
          cart.products.map(async (item) => {
            const product = await Product.getById(item.productId);
            return {
              product,
              quantity: item.quantity,
            };
          })
        );
        return cartInstance;
      }
      return null;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo obtener el carrito');
    }
  }

  async addProduct(product, quantity) {
    const existingProduct = this.products.find((item) => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.products.push({ product, quantity });
    }
  }

  removeProduct(productId) {
    const index = this.products.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  async save() {
    try {
      const data = await fs.readFile(filePath);
      const carts = JSON.parse(data);
      const cartIndex = carts.findIndex((cart) => cart.id === this.id);
      if (cartIndex === -1) {
        carts.push({
          id: this.id || Date.now(),
          products: this.products.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        });
      } else {
        carts[cartIndex].products = this.products.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
      }
      await fs.writeFile(filePath, JSON.stringify(carts));
      return this;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo guardar el carrito');
    }
  }
}

module.exports = Cart;