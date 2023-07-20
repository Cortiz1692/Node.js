const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const { socketController } = require('../controllers/socketController');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.productosPath = '/api/products';
        this.cartPath = '/api/carts';
        this.socketsPath = '/api/realtimeproducts';

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    middlewares() {


        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static(path.join(__dirname, '../public')));



        //Configracion de Handlebars
        this.app.engine('handlebars', hbs.engine);
        this.app.set('view engine', 'handlebars');
        this.app.set('views', './views');
    }

    routes() {
        this.app.use(this.productosPath, require('../routes/products.routes'));
        this.app.use(this.cartPath, require('../routes/carts.routes'));
        this.app.use(this.socketsPath, require('../routes/sockets.routes'))
    }

    // Sockets
    sockets() {
        this.io.on('connection', socketController);
    };

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}




module.exports = Server;
