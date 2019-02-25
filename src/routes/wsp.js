const express = require('express')
const _ = require('underscore')
const { romAddMessage } = require('../rom')



//Declaracion de express
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())



// End - Point WEBHOOK API WSP
app.post("/api/wsp", function(req, res) {

    try {

        console.log('===CAPTURA DE MENSAJES WEBHOOK=====');
        const mensaje = req.body.messages[0];
        console.log(`CHAT ROM ID: ${ mensaje.chatId} `);

        romAddMessage(mensaje);
        res.send('ok');
    } catch (error) {
        res.send('ok');
    }

});

// ==================================================


module.exports = app;