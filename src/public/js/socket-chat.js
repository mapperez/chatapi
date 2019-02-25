var socket = io();

// Escuchar
socket.on('connect', function() {
    console.log('Conectado al servidor');
})
socket.on('disconnect', function() {
    console.log('Coneccion perdida');
})

socket.on('sendClientNew', (data) => {
    console.log(data);
})