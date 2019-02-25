const { io } = require('../../index')
const { romAddMessage, SendMensajesClientesWsp } = require('../rom')

// Modo escuchar
io.on('connection', (client) => {

    /**
     * Metodo       :   sendClientNew
     * Descripcion  :   Enviar todos los clientes nuevos conectados al soporte sin atencion
     */

    client.on('sendClientNew', (data, callback) => {
        client.broadcast.emit('sendClientNew', data);
    })

    client.on('sendClientMensaje', (data, callback) => {
        client.broadcast.emit('sendClientMensaje', data);
    })

    client.on('sendClienteWsp', (data, callback) => {
        console.log(data);
        SendMensajesClientesWsp(data)
    })


})