// socketController.js
const Product = require('../models/product');

const socketController = async (socket) => {
  try {
    const productos = await Product.getAll();

    // Enviar la lista de productos al cliente conectado
    socket.emit('actualizar-lista', productos);

    // Manejar eventos para crear un nuevo producto
    socket.on('nuevo-producto', async (nuevoProducto) => {
      await Product.create(nuevoProducto);
      const productosActualizados = await Product.getAll();
      socket.emit('actualizar-lista', productosActualizados); // Utilizar socket.emit aquí
    });

    // Manejar eventos para eliminar un producto
    socket.on('eliminar-producto', async (index) => {
      await Product.remove(index);
      const productosActualizados = await Product.getAll();
      socket.emit('actualizar-lista', productosActualizados); // Utilizar socket.emit aquí
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { socketController };
