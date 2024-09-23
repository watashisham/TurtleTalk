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

const handleSubmit = (event) =>{
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.send('Usuário: ${user.name} entrou no chat!')

    console.log(user)
    
}

loginForm.addEventListener("submit", handleSubmit)