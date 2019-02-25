const { io } = require('../../index')
const { romAddMessage, SendMensajesClientesWsp, getRoms } = require('../rom')

// Modo escuchar
io.on('connection', (client) => {



    client.emit('sendRoms', { mensaje: 'hola' })


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