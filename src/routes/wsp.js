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
        console.log(req.body);
        const mensaje = req.body.messages[0];
        romAddMessage(mensaje);
        res.send('ok');
    } catch (error) {

        console.log('Solo ack');

    }

});

// ==================================================


module.exports = app;