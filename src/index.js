// Internal dependencies
const http = require('http')
const path = require('path')

// External dependencies
const express = require('express')
const socketio = require('socket.io')

const app = express()

// creo un servidor a partir de mi aplicación
const server = http.createServer(app) 

// WEB SOCKET
const io = socketio.listen(server)

// Importo la funcion de IO
require('./sockets')(io)

// Settings
// De esta manera le indico que use el puerto asignado por el sistema operativo o use el que le indico
app.set('port', process.env.Port || 3000)


// console.log(path.join(__dirname, 'public'))

// Enviar a quien se conecte la carpeta public
app.use(express.static(path.join(__dirname, 'public')))

// starting server
server.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'))
})
