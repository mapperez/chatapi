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

    // Data Soporte
    console.log("Mensaje enviado desde soporte a cliente");
    console.log(data);

    // Fecha Hoy
    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')

    // Guardar mensaje al chat Id
    let chatID = `${data.phone}@c.us`
    let romActual = await rom.findOne({ chatId: chatID, open: true, fecha: { $gte: fechaHoy } })
    let mjs = [];

    console.log(romActual);

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

    // Mensajes del cliente
    if (msg.fromMe == false) {

        // Buscar Rom activo 
        console.log(`Rom Actual Cliente (romAddMessage): ${msg.chatId} `);
        let romActual = await rom.findOne({ chatId: msg.chatId, open: true, fecha: { $gte: fechaHoy } })
        let mjs = [];

        // Crear o agregar mensajes
        if (!romActual) {

            console.log('No existe Rom para el cliente y crea nuevo');
            let cliok = {
                rut: '',
                nombre: 'Cliente Nuevo',
                apellido: '',
                correos: '',
                telefonos: '',
                direcciones: '',
                cod_region: '',
                provincia: '',
                ciudad: '',
                clasificacionFinanciera: '',
                tipoCartera: '',
                clasificacion: '',
                condicionPago: '',
                credito: '',
                creditoUtilizado: '',
                formaPago: '',
                giros: '',
                segmento: '',
                subSegmento: ''
            }

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


            if (!cli) {

                console.log('No existe cliente asociado y asocia cliente nuevo');
                cliok = {
                    rut: '',
                    nombre: 'Cliente Nuevo',
                    apellido: '',
                    correos: '',
                    telefonos: '',
                    direcciones: '',
                    cod_region: '',
                    provincia: '',
                    ciudad: '',
                    clasificacionFinanciera: '',
                    tipoCartera: '',
                    clasificacion: '',
                    condicionPago: '',
                    credito: '',
                    creditoUtilizado: '',
                    formaPago: '',
                    giros: '',
                    segmento: '',
                    subSegmento: ''
                }

            } else {

                console.log('Busca cliente por su Id');
                cliok = await cliente.findById(cli._id)
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
                    cliente: cliok,
                    estado: 'Espera'
                }
                // Guarda rom

            rom.create(NewRom).then(async(resp, err) => {
                if (err) {
                    console.log('Error al crear rom');
                }
                console.log(`Se crea nuevo rom con mensaje del cliente: ${resp._id}`);

                // Notificar conectados
                console.log('Emite rom vigentes a los clientes del chat');
                let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
                io.emit('sendClientNew', roms)

            }).catch(err => {
                console.log('Error al crear rom');
            })





        } else {

            console.log('Existe Rom creado para cliente');
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

                console.log(`Se crea nuevo mensaje al Rom Id : ${item._id}`);

                console.log('Emite rom vigentes a los clientes del chat');
                let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
                io.emit('sendClientMensaje', roms)

            }).catch(err => {
                console.log('Error el actualizar');
            })


        }

    } else {
        // Notificar conectados
        console.log('Emite rom vigentes a los clientes del chat');
        let roms = await rom.find({ open: true, fecha: { $gte: fechaHoy } })
        io.emit('sendClientNew', roms)
    }


}



module.exports = {
    romAddMessage,
    SendMensajesClientesWsp
}