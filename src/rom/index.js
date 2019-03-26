const moment = require('moment-timezone');
const { io } = require('../../index')
const request = require("request");

//Modelos
const rom = require('../model/rom.model')
const chat = require('../model/chat.model')
const cliente = require('../model/cliente.model')
const { mensajeABots } = require('../dialogflow')


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
    console.log(msg);

    //Fecha Hoy
    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')

    // Mensajes del cliente
    if (msg.fromMe == false) {
        console.log('1. MENSAJE DE CLIENTE');
        await gestionaMensajeCliente(msg);
    } else {
        console.log('1. MENSAJE DE EJECUTIVO');
        await gestionaMensajeCrmChat(msg);
    }


}

async function procesaMensajeBots(data){

    if(msg.type == "chat"){
        let mensaje = data.mensaje
        let sessionId = data._id
        let respuesta = await mensajeABots(mensaje, sessionId)
        return respuesta;
    }else{
        return  false;
    }

}

function getRoms() {
    //Fecha Hoy
    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')
    return rom.find({ open: true, fecha: { $gte: fechaHoy } })
}

async function gestionaMensajeCliente(msg){
    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')
    let clienteSinNombre = msg.author.replace('@c.us', '')

        // Buscar Rom Activa 
        let romActual = await rom.findOne({ chatId: msg.chatId, open: true, 
            $or: [{
                estado: "Espera"
            }, {
                estado: "Activa"
            }] 
         }).sort({updatedAt: -1});


        let mjs = [];

        console.log("ROM ACTUAL")
        console.log(romActual);


        // SE VERIFICA SI EXISTE LA CONVERSACION O LA CREA
        if (!romActual) {

            const cliok =  await getDatosCliente(msg)
            console.log('GET DATOS CLIENTES');
            console.log(cliok);

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
                let roms = await rom.find({ 
                    open: true,
                    $or: [{
                        estado: "Espera"
                    }, {
                        estado: "Activa"
                    }] 
                 }).sort({updatedAt: -1});

                io.emit('sendClientNew', roms)


                //VERIFICAMOS CONVERSACION CON EL BOTS
                let dataBots = {
                    _id:resp._id,
                    mensaje: msg.body

                }
                let respuestaBots = await procesaMensajeBots(dataBots);
                console.log(respuestaBots)

            }).catch(err => {
                console.log('Error al crear rom');
            })


        } else {

            console.log('Existe Rom creado para cliente');
            console.log("ChatId WebHook: " + msg.chatId);
            console.log("ChatId : " + romActual.chatId);
            console.log("RomID : " + romActual._id);

            // Rom existe y esta abierto
            mjs = []
            mjs = romActual.mensajes
            mjs.push(msg)
            romActual.mensajes = []
            romActual.mensajes = mjs

            let upRom = {
            
                mensajes: mjs
            }


            console.log(`findOneAndUpdate ID: ${romActual._id}`);

            rom.findOneAndUpdate({ _id: romActual._id }, upRom, { new: true, runValidators: true }, async(err, item) => {
                if (err) {
                    console.log(err);
                }


                    //VERIFICAMOS CONVERSACION CON EL BOTS
                    console.log(msg);
                    console.log(upRom);

                

                    let dataBots = {
                        _id: item._id,
                        mensaje: msg.body
    
                    }
                    let respuestaBots = await procesaMensajeBots(dataBots);
                    console.log(respuestaBots);



                console.log(`Se crea nuevo mensaje al Rom Id : ${item._id}`);
                console.log('Emite rom vigentes a los clientes del chat');
                let roms = await rom.find({ 
                    open: true,
                    $or: [{
                        estado: "Espera"
                    }, {
                        estado: "Activa"
                    }]
                 }).sort({updatedAt: -1});
                io.emit('sendClientMensaje', roms)

            }).catch(err => {
                console.log('Error el actualizar');
            })



        }

}


async function getDatosCliente(msg){
    let clienteSinNombre = msg.author.replace('@c.us', '')


    let cliok = {};

    // Formato numero
    let telefono = msg.author.replace('@c.us', '')

    //Buscar cliente
    let cli = await cliente.findOne({ 'telefonos.telefono': `+${telefono}` }, {
        telefonos: {
            $elemMatch: {
                telefono: `+${telefono}`
            }
        }
    });

     if (!cli) {

         console.log('No existe cliente asociado y asocia cliente nuevo');
         cliok = {
             rut: '',
             nombre: clienteSinNombre,
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
     return  cliok;
}
//-----------------------------------------------------------------------------------------

async function gestionaMensajeCrmChat(msg){

            // Notificar conectados
            console.log('2. MENSAJE DE EJECUTIVO');

            let romUpdate = await rom.findOne({ chatId: msg.chatId, open: true,  
                $or: [{
                estado: "Espera"
                }, {
                    estado: "Activa"
                }]
             });
            console.log("ChatId WebHook: " + msg.chatId);
            console.log("ChatId : " + romUpdate.chatId);
            console.log("RomID : " + romUpdate._id);
    
    
            if (romUpdate) {
                // Rom existe y esta abierto
                mjs = []
                mjs = romUpdate.mensajes
                mjs.push(msg)
                romUpdate.mensajes = []
                romUpdate.mensajes = mjs
    
                let upRom = {
                    mensajes: mjs
                }
    
                rom.findOneAndUpdate({ _id: romUpdate._id }, upRom, { new: true, runValidators: true }, async(err, item) => {
                    if (err) {
                        console.log(err);
                    }
    
                    console.log(`Se crea nuevo mensaje al Rom Id : ${item._id}`);
                    console.log('Emite rom vigentes a los clientes del chat');
                    let roms = await rom.find({ 
                        open: true,
                        $or: [{
                            estado: "Espera"
                        }, {
                            estado: "Activa"
                        }]
                     }).sort({updatedAt: -1});
                    io.emit('sendClientMensaje', roms)
    
                }).catch(err => {
                    console.log('Error el actualizar');
                }) 
    
            }    

}
// ---------------------------------------------------------------------------------------


module.exports = {
    romAddMessage,
    SendMensajesClientesWsp
}