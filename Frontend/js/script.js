const { json } = require("stream/consumers")

//Login Elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//Chat Elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")

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

const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const processMessage = ({ data }) => {
   // const { userId, userName, userColor, content } = JSON.parse(data)
   console.log(JSON.parse(data))
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