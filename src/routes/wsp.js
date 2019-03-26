const express = require('express')
var cors = require('cors')
const _ = require('underscore')
const {
    romAddMessage
} = require('../rom')
const rom = require('../model/rom.model')
const cliente =  require("../model/cliente.model")



//Declaracion de express
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())



// End - Point WEBHOOK API WSP
app.post("/api/wsp", async(req, res) => {

   
        console.log('===CAPTURA DE MENSAJES WEBHOOK=====');
        const mensaje = req.body.messages[0];
        console.log(`CHAT ROM ID: ${ mensaje.chatId} `);
        console.log(mensaje)
        await romAddMessage(mensaje);
        res.send('ok');
  
});



// TRAE EL HISTORIAL DE LOS CHAT
app.get('/api/historial', function (req, res) {

    const chatId = req.param('chatId');
    rom.find({
        open: true,
        chatId: chatId,
        estado:"Finalizada"
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
                estado: "Activa"
            }],
            
        },
        function (err2, docs2) {
            // docs is an array
            console.log(docs2)
            res.send(docs2)
        }).sort({updatedAt: -1});
});



// TRAE LAS CONVERSACIONES ACTIVA
app.get('/api/conversaciones_finalizadas', function (req, res) {

    const aggregatorOpts = [
    { $match: { "estado": "Finalizada" } },
    { $sort: { "updatedAt": -1 } },
    {        
        $group: {
            _id: "$chatId",
            chatId: { "$first": "$chatId" },

            cliente: { "$first": "$cliente" },
            mensajes: { "$first": "$mensajes" },
            count: { $sum: 1 },            
        }       
    },
    ];
      rom.aggregate(aggregatorOpts
        ,
        function (err2, docs2) {
            // docs is an array
            console.log(docs2)
            res.send(docs2)
        }).sort({updatedAt: -1});
});

// CAMBIA ESTADO A CONVERSACION
app.post("/api/conversaciones", function (req, res) {
   
    const updateRom = {
        estado: "Activa"
    }
    rom.findOneAndUpdate({ _id: req.body._id }, updateRom, { runValidators: true }, async(err, item) => {
        console.log(item);
        if (err) {
            var obj = {
                error: true,
                msg: "ocurrio un error al iniciar la conversación",
                detalleError: error
            }
            res.json(obj);
        }else{

          rom.find({
                    open: true,
                    $or: [{
                        estado: "Espera"
                    }, {
                        estado: "Activa"
                    }],

                },
                function (err2, docs2) {

                    var obj = {
                        error: false,
                        msg: "ocurrio un error al iniciar la conversación",
                        data: docs2
                    }
                    res.json(obj);
                  
                }).sort({
                updatedAt: -1
            });

        }

    }).catch(err => {
        console.log('Error el actualizar');
    })

});


// FINALIZA CONVERSACION
app.post("/api/finaliza_conversacion", function (req, res) {
 
   
    const updateRom = {
        estado: "Finalizada",
        observacionConversacion: req.body.observacionConversacion,
        tipoConversacion: req.body.tipoConversacion

    }
    rom.findOneAndUpdate({ _id: req.body.id }, updateRom, { runValidators: true }, async(err, item) => {
        console.log(item);
        if (err) {
            var obj = {
                error: true,
                msg: "ocurrio un error al iniciar la conversación",
                detalleError: error
            }
            res.json(obj);
        }else{

          rom.find({
                    open: true,
                    $or: [{
                        estado: "Espera"
                    }, {
                        estado: "Activa"
                    }],

                },
                function (err2, docs2) {

                    var obj = {
                        error: false,
                        msg: "Actualizacion correcta",
                        data: docs2
                    }
                    res.json(obj);
                  
                }).sort({
                updatedAt: -1
            });

        }

    }).catch(err => {
        console.log('Error el actualizar');
    })

});

app.get('/api/getCliente', async (req, res, next) => {
    try {
        const chatId = req.param('chatId');
        const telefono = chatId.replace('@c.us', '')



      const dataCliente = await  cliente.findOne({ 'telefonos.telefono': `+${telefono}` }, {
                    //  telefonos: {
                    //      $elemMatch: {
                    //          telefono: `+${telefono}`
                    //      }
                    //  }
                 })

              
                //  console.log(dataCliente)
      res.json(dataCliente);

    } catch (e) {     
      next(e) 
    }
  })


module.exports = app;