module.exports = (io) => {

    let users = {}

    io.on('connection', socket => {
        console.log('new user connected')

        // Recibimos nickname y el callback
        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false)
            } else {
                cb(true)
                socket.nickname = data
                users[socket.nickname] = socket
                updateNicknames()
            }
        })


        // Recibimos los datos del lado del servidor y transmitimos uno a todos
        socket.on('send message', (data, cb) => {

            // Evaluamos el texto para saber si tiene el comnaod de privado
            var msg = data.trim()

            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3)
                const index = msg.indexOf(' ')
                
                if (index !== -1) {
                    var name = msg.substring(0, index)
                    var msg = msg.substring(index + 1)

                    if (name in users) {
                        users[name].emit('whisper', { // whiper es nuestra palabra clave para el evento de msg Privado    
                            msg,
                            nick: socket.nickname
                        })
                    } else {
                        cb('Error! Please enter valid user')
                    }
                } else {
                    cb('Error! Please enter your message')
                }

            } else {
                // Comments to ALL
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                })    
            }


        })


        // Listen when a socket is disconnected
        socket.on('disconnect', (data) => {
            if (!socket.nickname) return
            delete users[socket.nickname] // Elimina solo el usuario que se desconecta
            updateNicknames()
        })


        function updateNicknames() {
            // Evento que envía todos los usuarios almacenados en el arreglo
            io.sockets.emit('usernames', Object.keys(users)) //
        }
    })
}