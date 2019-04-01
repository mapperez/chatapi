const { io } = require('../../index')
const moment = require('moment-timezone');
const { romAddMessage, SendMensajesClientesWsp, getRoms } = require('../rom')

const rom = require('../model/rom.model')

// Modo escuchar
io.on('connection', async(client) => {


    const today = moment(new Date).tz("America/Santiago")
    const fechaHoy = today.format('YYYY-MM-DD')
    let myroms = await rom.find({ open: true, fecha: { $gte: fechaHoy } });
    client.emit('sendRoms', myroms)


    client.on('sendClientNew', (data, callback) => {
        client.broadcast.emit('sendClientNew', data);
    })

    client.on('sendClientMensaje', (data, callback) => {
        client.broadcast.emit('sendClientMensaje', data);
    })
    
    client.on('sendClienteWsp', (data, callback) => {
        console.log("--------------- websocket -------------------");
        SendMensajesClientesWsp(data)
        console.log("--------------- end websocket -------------------");

    })

})