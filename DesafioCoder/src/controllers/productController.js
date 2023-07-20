const Product = require('../models/product');

// Controlador para obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll(); // Obtenemos todos los productos usando el método getAll de la clase Product
    res.json(products); // Enviamos la lista de productos como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para obtener un producto por su ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID del producto desde los parámetros de la ruta
    const product = await Product.getById(id); // Obtenemos el producto por su ID usando el método getById de la clase Product
    if (!product) { // Si no se encontró el producto
      return res.status(404).json({ error: 'Producto no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }
    res.json(product); // Si se encontró el producto, lo enviamos como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body; // Obtenemos el título, descripción y precio del producto desde el cuerpo de la petición
    if (!title || !description || !price) { // Validamos que se hayan provisto todos los campos obligatorios
      return res.status(400).json({ error: 'Faltan campos obligatorios' }); // Enviamos una respuesta de error 400 (solicitud incorrecta)
    }
    const product = new Product(title, description, price); // Creamos una nueva instancia de la clase Product con los datos del nuevo producto
    const newProduct = await product.save(); // Guardamos el nuevo producto
    res.status(201).json(newProduct); // Enviamos el nuevo producto como respuesta y estado 201 (creado)
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para actualizar un producto por su ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID del producto desde los parámetros de la ruta
    const { title, description, price } = req.body; // Obtenemos los datos del producto a actualizar desde el cuerpo de la petición

    if (!title && !description && !price) { // Validamos que se haya provisto al menos un campo para actualizar
      return res.status(400).json({ error: 'Debe ingresar al menos un campo para actualizar' }); // Enviamos una respuesta de error 400 (solicitud incorrecta)
    }

    const product = await Product.getById(id); // Obtenemos el producto por su ID usando el método getById de la clase Product
    if (!product) { // Si no se encontró el producto
      return res.status(404).json({ error: 'Producto no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }

    // Si se proporcionó un nuevo valor para el título, lo actualizamos en el producto
    if (title) {
      product.title = title;
    }

    // Si se proporcionó una nueva descripción, la actualizamos en el producto
    if (description) {
      product.description = description;
    }

    // Si se proporcionó un nuevo precio, lo actualizamos en el producto
    if (price) {
      product.price = price;
    }

    const updatedProduct = await product.save(); // Guardamos el producto actualizado
    res.status(200).json(updatedProduct); // Enviamos el producto actualizado como respuesta y estado 200 (éxito)
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};

// Controlador para eliminar un producto por su ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID del producto desde los parámetros de la ruta
    const product = await Product.getById(id); // Obtenemos el producto por su ID usando el método getById de la clase Product
    if (!product) { // Si no se encontró el producto
      return res.status(404).json({ error: 'Producto no encontrado' }); // Enviamos una respuesta de error 404 (no encontrado)
    }
    const result = await Product.deleteById(id); // Eliminamos el producto por su ID usando el método deleteById de la clase Product
    if (result) { // Si se eliminó el producto correctamente
      res.status(204).send(); // Enviamos una respuesta vacía con estado 204 (ningún contenido)
    } else { // Si no se pudo eliminar el producto
      res.status(500).send(); // Enviamos una respuesta de error 500 (error interno del servidor)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(); // Enviamos una respuesta de error en caso de haber excepción
  }
};