import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import routerProducto from './src/routes/routes.js';
import ContenedorMensajes from './src/controllers/contenedorMensajes.js';

const app = express();
const httpServer = HttpServer(app)
const ioServer = new IOServer(httpServer)

const mensajes = new ContenedorMensajes('./src/DB/mensajes.json');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routerProducto);

ioServer.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");

    socket.emit("messages", await mensajes.getAll() );

    socket.on("new-message", async (msj) => {
        await mensajes.save(msj);
        ioServer.sockets.emit("messages", await mensajes.getAll());
    });
});



const PORT = 8080;
httpServer.listen(PORT, (err) => {
    if(err) new Error (console.log(err));
    else console.log(`Servidor corriendo en el puerto ${PORT}`);
});