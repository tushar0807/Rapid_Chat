const socket = io()
let username;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    username = prompt('Please enter your name: ')
} while(!username)


const append =(message,type)=>{
    let mainDiv = document.createElement('div')
    let className = type
    const msg=message
    mainDiv.classList.add(className, 'msg')

    let markup = `
        <p>${msg}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


socket.on('user-joined',username =>{
    
    append(`${username} joined the chat`,'incoming');
    scrollToBottom();
})
socket.emit('user-joined',username);


socket.on('left',name =>{
    
    append(`${name} left the chat`,'incoming');
    scrollToBottom();
})


textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: username,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)

}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})



function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}