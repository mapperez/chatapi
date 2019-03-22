const express = require('express')

//Declaracion de express
const app = express();
const bodyParser = require('body-parser')
const { runSample } = require('../dialogflow')

app.use(bodyParser.json())


//Modelos
const cliente = require('../model/cliente.model')
const proyectoAgenteId = "agenteejemplo-67c1a";


// End - Point WEBHOOK API WSP
app.post("/api/iaget", async function(req, res) {

    // Variables
    let resp = []
    let IntenName = req.body.queryResult.intent.displayName
    let parametros = [];

    console.log("Captura mensajes webhook")
    console.log(IntenName);
    console.log(req.body);



    switch (IntenName) {
        case "Saludos":
            let respSaludos = req.body.queryResult.fulfillmentText;
            return res.json({
                "fulfillmentText": "Respuesta del Server",
                "fulfillmentMessages": [{
                    "text": {
                        "text": respSaludos
                    }
                }],
                "source": "<Saludos>"
            });
            break;

        case "int_getProducto":

            parametros = req.body.queryResult.parameters
            let codproducto = parametros.codproducto;
            console.log(parametros)


            return res.json({
                "fulfillmentText": "Respuesta del Server",
                "fulfillmentMessages": [{
                    "text": {
                        "text": "http://104.196.152.57/ha/img/10999.png"
                    }
                }],
                "source": "<Saludos>"
            });


            break;
        case "int_getRut":

            //Parametros
            parametros = req.body.queryResult.parameters
            let rut = parametros.rut;
            rut = rut.replace('.', '');
            rut = rut.replace('-', '');
            rut = rut.replace('K', '');
            rut = rut.replace('k', '');

            try {

                console.log("Entra a Try ")
                let rutok = Number.parseInt(rut)
                console.log(rutok)

                if (!rutok) {

                    console.log("Rut no encontrado")
                    resp.push("Bienvenido, para poder brindar mejor atención, ingrese su rut")



                } else {

                    console.log("Rut : " + rut)
                    const rutRegex = new RegExp(rut, 'i')
                    let cliOk = await cliente.findOne({ rut: rutRegex })
                    let r1 = `Bienvenido ${cliOk.nombre}`
                    resp.push(r1)



                }



            } catch (error) {
                resp.push(`El rut : ${rut}, no es valido`)
            }

            return res.json({
                "fulfillmentText": "Respuesta del Server",
                "fulfillmentMessages": [{
                    "text": {
                        "text": resp
                    }
                }],
                "source": "<NodeEco>"
            });

            break;
    }


});

app.post("/api/bots", async(req, res) => {

    let mensaje = req.body.mensaje
    let sessionId = req.body.sessionId
    let respuesta = await runSample(proyectoAgenteId, mensaje, sessionId)

    console.log("Enviar mensaje")
    console.log(req.body)

    return res.json(respuesta);


})

// ==================================================


module.exports = app;