const { io } = require('../../index')
const { romAddMessage, SendMensajesClientesWsp, getRoms } = require('../rom')

const rom = require('../model/rom.model')

// Modo escuchar
io.on('connection', async(client) => {


    let myroms = await rom.find({ open: true, fecha: { $gte: fechaHoy } });
    client.emit('sendRoms', myroms)


    client.on('sendClientNew', (data, callback) => {
        client.broadcast.emit('sendClientNew', data);
    })

    client.on('sendClientMensaje', (data, callback) => {
        client.broadcast.emit('sendClientMensaje', data);
    })
    client.on('sendClienteWsp', (data, callback) => {
        SendMensajesClientesWsp(data)
    })

})