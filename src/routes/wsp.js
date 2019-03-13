const express = require('express')
const _ = require('underscore')
const {
    romAddMessage
} = require('../rom')
const rom = require('../model/rom.model')



//Declaracion de express
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())



// End - Point WEBHOOK API WSP
app.post("/api/wsp", function (req, res) {

    try {

        console.log('===CAPTURA DE MENSAJES WEBHOOK=====');
        const mensaje = req.body.messages[0];
        console.log(`CHAT ROM ID: ${ mensaje.chatId} `);
        console.log(mensaje)
        romAddMessage(mensaje);
        res.send('ok');
    } catch (error) {
        res.send('ok');
    }

});



// TRAE EL HISTORIAL DE LOS CHAT
app.get('/api/historial', function (req, res) {

    const chatId = req.param('chatId');
    rom.find({
        open: true,
        chatId: chatId
    }, function (err, docs) {
        // docs is an array
        console.log(docs)
        res.send(docs)

    }).sort({updatedAt: -1});;
})


// TRAE LAS CONVERSACIONES ACTIVA
app.get('/api/conversaciones_activas', function (req, res) {

   

    rom.find({
            open: true,
            $or: [{
                estado: "Espera"
            }, {
                estado: "Activo"
            }],
            
        },
        function (err2, docs2) {
            // docs is an array
            console.log(docs2)
            res.send(docs2)
        }).sort({updatedAt: -1});
});

// CAMBIA ESTADO A CONVERSACION
app.post("/api/conversacion/", function (req, res) {

    try {
        console.log(req.body)

    } catch (error) {
        res.send('ok');
    }

});


module.exports = app;