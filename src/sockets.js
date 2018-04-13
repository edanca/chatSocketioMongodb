module.exports = (io) => {

    let nicknames = [
        'edu',
        'ryan'
    ]

    io.on('connection', socket => {
        console.log('new user connected')

        // Recibimos nickname y el callback
        socket.on('new user', (data, cb) => {
            // console.log(data)
            if (nicknames.indexOf(data) != -1) {
                cb(false)
            } else {
                cb(true)
                socket.nickname = data
                nicknames.push(socket.nickname)
                updateNicknames()
            }
        })


        // Recibimos los datos del lado del servidor y transmitimos uno a todos
        socket.on('send message', (data) => {
            // console.log(data)
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            })

        })


        // Listen when a socket is disconnected
        socket.on('disconnect', (data) => {
            if (!socket.nickname) return
            nicknames.splice(nicknames.indexOf(socket.nickname), 1) // Remueve solo un elemento, segundo parametro
            updateNicknames()
        })


        function updateNicknames() {
            // Evento que envía todos los usuarios almacenados en el arreglo
            io.sockets.emit('usernames', nicknames)
        }
    })
}