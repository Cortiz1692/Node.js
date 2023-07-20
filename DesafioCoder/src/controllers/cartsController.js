const Cart = require('../models/cart');

// Controlador para crear un nuevo carrito
exports.createCart = async (req, res) => {
  try {
    const cart = new Cart(); // Creamos una instancia de la clase Cart
    const newCart = await cart.save(); // Guardamos el nuevo carrito
    res.status(201).json(newCart); // Enviamos la respuesta con el nuevo carrito y estado 201 (creado)
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para obtener un carrito por su ID
exports.getCartById = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID del carrito desde los parámetros de la ruta
    const cart = await Cart.getById(id); // Obtenemos el carrito por su ID usando el método getById de la clase Cart
    if (!cart) { // Si no se encontró el carrito
      return res.status(404).json({ error: 'Carrito no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }
    res.json(cart.products); // Si se encontró el carrito, enviamos su lista de productos como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para agregar un producto a un carrito por su ID
exports.addProductToCart = async (req, res) => {
  try {
    const { id: cartId } = req.params; // Obtenemos el ID del carrito desde los parámetros de la ruta, y lo asignamos a la variable cartId
    const { productId, quantity = 1 } = req.body; // Obtenemos el ID y cantidad de productos desde el cuerpo de la petición

    if (!productId) { // Validamos que se haya provisto un ID de producto
      return res.status(400).json({ error: 'ID de producto es obligatorio' }); // Enviamos una respuesta de error 400 (solicitud incorrecta)
    }

    const cart = await Cart.getById(cartId); // Obtenemos el carrito por su ID usando el método getById de la clase Cart
    if (!cart) { // Si no se encontró el carrito
      return res.status(404).json({ error: 'Carrito no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }

    const product = await Product.getById(productId); // Obtenemos el producto por su ID usando el método getById de la clase Product
    if (!product) { // Si no se encontró el producto
      return res.status(404).json({ error: 'Producto no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }

    cart.addProduct(product, quantity); // Agregamos el producto al carrito
    await cart.save(); // Guardamos el carrito actualizado en el archivo de carritos
    res.status(204).send(); // Enviamos una respuesta vacía con estado 204 (ningún contenido)
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para eliminar un producto de un carrito por su ID
exports.removeProductFromCart = async (req, res) => {
  try {
    const { id: cartId, productId } = req.params; // Obtenemos el ID del carrito y el ID del producto desde los parámetros de la ruta

    const cart = await Cart.getById(cartId); // Obtenemos el carrito por su ID usando el método getById de la clase Cart
    if (!cart) { // Si no se encontró el carrito
      return res.status(404).json({ error: 'Carrito no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }

    if (!cart.removeProduct(productId)) { // Si el producto no se encontró en el carrito
      return res.status(404).json({ error: 'Producto no encontrado en este carrito' }); // Enviamos una respuesta de error 404 (no encontrado)
    }

    // Si se encontró y eliminó el producto del carrito, guardamos el carrito actualizado en el archivo de carritos
    await cart.save();
    res.status(204).send(); // Enviamos una respuesta vacía con estado 204 (ningún contenido)
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};