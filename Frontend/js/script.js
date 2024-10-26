//const { json } = require("stream/consumers")

//Login Elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const selectedAvatar = document.getElementById('selected_avatar');
const avatarOptions = document.querySelectorAll('.avatar_option');

//Removendo o icone do mouse piscando em volta do avatar
const avatarSelection = document.querySelector('.avatar_selection');
avatarSelection.addEventListener('mousedown', (event) => {
    event.preventDefault(); // Impede o foco no contêiner ao clicar
});

// Atualiza o avatar selecionado ao clicar em uma miniatura
avatarOptions.forEach(option => {
    option.addEventListener('click', function () {
      selectedAvatar.src = this.src;
    });
  });

//Chat Elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

//Cores dos nic
const colors = [
    "darkcyan",
    "darkblue",
    "darkred",
    "darkviolet",
    "strongmagenta"
]

const user = {id: "", name: "", color: "", avatar: ""}

let websocket;

//Função para criar mensagens própria
function createMessageSelfElement(content, sender, senderColor, avatar) {
    const div = document.createElement("div");
    const header = document.createElement("div"); // Container flex para avatar e nome
    const span = document.createElement("span");
    const img = document.createElement("img"); // Avatar

    // Adicionar a classe e estilo da mensagem própria (self)
    div.classList.add("message--self");
    header.classList.add("message--header"); // Classe para posicionamento flex
    span.classList.add("message--sender");
    span.innerHTML = sender;
    span.style.color = senderColor;
    
    // Adicionar avatar
    img.src = avatar;
    img.alt = `${sender}'s avatar`;
    img.classList.add("avatar"); // Classe de estilo para o avatar

    // Adicionar avatar e remetente na mensagem
    header.appendChild(img);
    header.appendChild(span);
    div.appendChild(header);

     // Adicionar o conteúdo da mensagem
    const messageContent = document.createElement("div");
    messageContent.classList.add("message--content");
    messageContent.innerHTML = content;
    div.appendChild(messageContent);

    return div
}

//Função para criar mensagem de outros usuários
const createMessageOtherElement = (content, sender, senderColor, avatar) => {
    const div = document.createElement("div");
    const header = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img"); // Avatar

    div.classList.add("message--other");
    header.classList.add("message--header");
    span.classList.add("message--sender");
    span.style.color = senderColor;
    span.innerHTML = sender;

    // Adicionar avatar
    img.src = avatar;
    img.alt = `${sender}'s avatar`;
    img.classList.add("avatar"); // Classe de estilo para o avatar

    header.appendChild(img);
    header.appendChild(span);
    div.appendChild(header);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message--content");
    messageContent.innerHTML = content;

    div.appendChild(messageContent);

    return div
}

//Função para gerar cores aleatórias para nic
const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

//Função para rolar a tela ao receber mensagem
const scrollScreen = () => {
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
    })
}

// Processa e exibe as mensagens recebidas
const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, userAvatar } = JSON.parse(data);
    
    // Verifica se a mensagem é do próprio usuário ou de outro
    const message = userId == user.id 
    ? createMessageSelfElement(content, user.name, user.color, user.avatar)
    : createMessageOtherElement(content, userName, userColor, userAvatar);

    chatMessages.appendChild(message);
    scrollScreen();
}

//Função de login
const handleLogin = (event) =>{
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    user.avatar = selectedAvatar.src; // Atualizado: Armazena o avatar selecionado

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("wss://turtletalk.onrender.com");
    websocket.onmessage = processMessage;
  
}

// Envia mensagem no chat
const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        userAvatar: user.avatar // Atualizado: Adiciona o avatar à mensagem

    }

    websocket.send(JSON.stringify(message));
    chatInput.value = "";

}

// Event Listeners
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);