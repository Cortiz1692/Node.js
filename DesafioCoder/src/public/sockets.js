
const socket = io();

// Escuchar el evento para actualizar la lista de productos
socket.on('actualizar-lista', (productos) => {
  const productList = document.querySelector('ul');
  productList.innerHTML = '';
  productos.forEach((producto) => {
    const listItem = document.createElement('li');
    listItem.innerText = producto;
    productList.appendChild(listItem);
  });
});

// Enviar el formulario al agregar un nuevo producto
const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = event.target.product.value;
  socket.emit('nuevo-producto', productName);
  event.target.product.value = '';
});
