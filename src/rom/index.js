const moment = require('moment-timezone');
const { io } = require('../../index')
const request = require("request");

//Modelos
const rom = require('../model/rom.model')
const chat = require('../model/chat.model')
const cliente = require('../model/cliente.model')

// Url chat wsp
var urlGet = "https://eu23.chat-api.com/instance15824/message?token=f3slesivjyr2syj5";


async function SendMensajesClientesWsp(data) {



    request({
            url: urlGet,
            method: "POST",
            json: data
        },
        function(error, response, body) {
            if (error) return console.error("HTTP Error", error);
            console.log(data);
        }
    );
}

async function romAddMessage(msg) {

    //Fecha Hoy
    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')

    // Captura solo los mensajes entrantes
    if (msg.fromMe == false) {

        //Buscar si existe rom 
        let romActual = await rom.findOne({ chatId: msg.chatId, open: true, fecha: { $gte: fechaHoy } })
        let mjs = [];

        // Crear o agregar mensajes
        if (!romActual) {

            console.log('Rom nuevo');
            let cliok = {}

            // Formato numero
            let telefono = msg.author.replace('@c.us', '')

            //Buscar cliente
            let cli = await cliente.findOne({ 'telefonos.telefono': `+${telefono}` }, {
                telefonos: {
                    $elemMatch: {
                        telefono: `+${telefono}`
                    }
                }
            })

            if (cli._id) {
                console.log('Cliente existe');
                cliok = await cliente.findById(cli._id)
            } else {
                console.log('Cliente no existe');
                cliok = {}
            }

            // ==================================================================================

            //Crear Rom
            mjs = []
            mjs.push(msg)

            let NewRom = {
                    chatId: msg.chatId,
                    fecha: fechaHoy,
                    open: true,
                    mensajes: mjs,
                    cliente: cliok
                }
                // Guarda rom

            rom.create(NewRom).then(async(resp, err) => {
                if (err) {
                    console.log('Error al crear rom');
                }
                console.log(`Se ha creado nuevo Rom Id: ${resp._id}`);

                // Notificar conectados       
                let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
                io.emit('sendClientNew', roms)

            }).catch(err => {
                console.log('Error al crear rom');
            })





        } else {

            console.log('Rom en estado open');
            console.log(`Rom Id: ${romActual._id}`);

            // Rom existe y esta abierto
            mjs = []
            mjs = romActual.mensajes
            mjs.push(msg)
            romActual.mensajes = []
            romActual.mensajes = mjs

            let upRom = {
                mensajes: mjs
            }

            rom.findOneAndUpdate(romActual._id, upRom, { new: true, runValidators: true }, async(err, item) => {
                if (err) {
                    console.log(err);
                }

                console.log(`Nuevo Mensaje Rom Id : ${item._id}`);
                let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
                io.emit('sendClientMensaje', roms)

            }).catch(err => {
                console.log('Error el actualizar');
            })


        }

    } else {


        console.log('Rom en estado open mensaje soporte');
        console.log(`Rom Id: ${romActual._id}`);

        // Rom existe y esta abierto
        mjs = []
        mjs = romActual.mensajes
        mjs.push(msg)
        romActual.mensajes = []
        romActual.mensajes = mjs

        let upRom = {
            mensajes: mjs
        }

        rom.findOneAndUpdate(romActual._id, upRom, { new: true, runValidators: true }, async(err, item) => {
            if (err) {
                console.log(err);
            }

            console.log(`Mensaje desde Soporte Rom Id : ${item._id}`);
            let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
            io.emit('sendClientMensaje', roms)

        }).catch(err => {
            console.log('Error el actualizar');
        })




    }


}



module.exports = {
    romAddMessage,
    SendMensajesClientesWsp
}