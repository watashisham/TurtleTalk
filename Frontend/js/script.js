//const { json } = require("stream/consumers")

//Login Elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//Chat Elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

//Cores dos nic
const colors = [
    "darkcyan",
    "darkblue",
    "darkred",
    "darkviolet",
    "strongmagenta"
]

const user = {id: "", name: "", color: ""}

let websocket

function createMessageSelfElement(content, sender, senderColor) {
    const div = document.createElement("div")
    const span = document.createElement("span")

    // Adicionar a classe e estilo da mensagem própria (self)
    div.classList.add("message--self")
    span.classList.add("message--sender")
    

    // Nome do usuário self
    span.innerHTML = sender
    span.style.color = senderColor

    // Adicionar o remetente e a mensagem ao div
    div.appendChild(span)

     // Adicionar o conteúdo da mensagem
    const messageContent = document.createElement("div")
    messageContent.classList.add("message--content")
    messageContent.innerHTML = content

    div.appendChild(messageContent)

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)
    
    // Verifica se a mensagem é do próprio usuário ou de outro
    const message = userId == user.id 
    ? createMessageSelfElement(content, user.name, user.color) 
    : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)
    scrollScreen()
}

const handleLogin = (event) =>{
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
  
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value

    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""

}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)