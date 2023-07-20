const { promises: fs } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/productos.json');

class Product {
  constructor(title, description, price) {
    this.title = title;
    this.description = description;
    this.price = price;
  }

  static async getAll() {
    try {
      const data = await fs.readFile(filePath);
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      throw new Error('No se pudieron obtener los productos');
    }
  }

  static async getById(id) {
    try {
      const data = await fs.readFile(filePath);
      const products = JSON.parse(data);
      return products.find((product) => product.id === id);
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo obtener el producto');
    }
  }

  static async getNextId() {
    try {
      const data = await fs.readFile(filePath);
      const products = JSON.parse(data);
      const lastProduct = products[products.length - 1];
      return lastProduct ? lastProduct.id + 1 : 1;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo obtener el siguiente ID');
    }
  }

  async save() {
    try {
      const data = await fs.readFile(filePath);
      const products = JSON.parse(data);
      const nextId = await Product.getNextId();
      this.id = nextId;
      products.push(this);
      await fs.writeFile(filePath, JSON.stringify(products));
      return this;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo guardar el producto');
    }
  }

  async update(updatedFields) {
    try {
      const data = await fs.readFile(filePath);
      const products = JSON.parse(data);
      const index = products.findIndex((product) => product.id === this.id);
      Object.keys(updatedFields).forEach((key) => {
        this[key] = updatedFields[key];
      });
      products[index] = this;
      await fs.writeFile(filePath, JSON.stringify(products));
      return this;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  static async deleteById(id) {
    try {
      const data = await fs.readFile(filePath);
      let products = JSON.parse(data);
      products = products.filter((product) => product.id !== id);
      await fs.writeFile(filePath, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo eliminar el producto');
    }
  }
}

module.exports = Product;