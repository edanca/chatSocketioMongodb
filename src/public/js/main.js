$(function () {
    
    const socket = io()

    // Obteniendo los elementos del DOM para el CHAT
    const $mesageForm = $('#message-form')
    const $mesageBox = $('#message')
    const $chat = $('#chat')

    // Obtaining DOM elements for LOGIN 
    const $nickForm = $('#nickForm')
    const $nickError = $('#nickError')
    const $nickname = $('#nickname')

    const $users = $('#usernames')


    // LOGIN Form
    $nickForm.submit( (e) => {
        e.preventDefault()
        // console.log($nickname.val())
        socket.emit('new user', $nickname.val(), data => {
            // console.log(data)
            if (data) {
                $('#nickWrap').hide()
                $('#contentWrap').show()
            } else {
                $nickError
                    .html(`
                        <div class="alert alert-danger">
                            That username already exists.
                        </div>
                    `)
                    .css('display', 'block')
            }
            $nickname.val('')
        })
    })

    // Events
    // CHAT FORM
    $mesageForm.submit( (e) => {
        e.preventDefault()
        // console.log($mesageBox.val())

        // nombre del envento sera "send message"
        socket.emit('send message', $mesageBox.val(), (data) => {
            $chat.append(`<p class="error">${data}</p>`)
        })

        // Limpiamos el campo de mensaje
        $mesageBox.val('')
    })


    socket.on('new message', (data) => {
        $chat.append('<b>' + data.nick + ': </b>' + data.msg + '<br/>')
    })

    
    socket.on('usernames', (data) => {
        let html = ''
        // console.log(data)
        for (let user of data) {
            html += `<p><i class="fas fa-user"></i> ${user}</p>`
        }
        $users.html(html)
    })


    socket.on('whisper', (data) => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
    })

})