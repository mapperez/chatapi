require('./src/config/config');
const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const socketIO = require('socket.io')
const http = require('http')
const bodyParser = require("body-parser");


// Express
const app = express();
const server = http.createServer(app);

// Contenido estatico
const publicPath = path.resolve(__dirname, './src/public');
app.use(express.static(publicPath));


//Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Middleware
app.use(bodyParser.json());


// Inicializar socketIO
module.exports.io = socketIO(server);
require('./src/sockets/socketchat')


// Rutas
app.use(require('./src/routes'));




server.listen({ port: process.env.PORT }, () => {
    console.log("============== NODE SERVER ==================");
    console.log(`🚀 Servidor Mongo      en:  ${process.env.urlMongo}`)
    console.log(`🚀 Servidor REST       en:  http://localhost:${process.env.PORT}/api/`)
    console.log("============== NODE SERVER ==================");
});