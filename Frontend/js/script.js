// Login Elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const selectedAvatar = document.getElementById('selected_avatar');
const avatarOptions = document.querySelectorAll('.avatar_option');
const avatarSelection = document.querySelector('.avatar_selection');

// Removendo o icone do mouse piscando em volta do avatar
avatarSelection.addEventListener('mousedown', (event) => {
    event.preventDefault(); // Impede o foco no contêiner ao clicar
});

// Atualiza o avatar selecionado ao clicar em uma miniatura
avatarOptions.forEach(option => {
    option.addEventListener('click', function () {
        selectedAvatar.src = this.src;
    });
});

// Chat Elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

// Cores dos nicknames
const colors = [
    "darkcyan",
    "darkblue",
    "darkred",
    "darkviolet",
    "strongmagenta"
];

const user = {id: "", name: "", color: "", avatar: ""};
let websocket;

// Função para gerar cores aleatórias para nicknames
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

// Função para rolar a tela ao receber mensagem
const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

// Função para criar mensagens
function createMessageElement(content, sender, senderColor, avatar, isSelf) {
    const div = document.createElement("div");
    const header = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img");

    div.classList.add(isSelf ? "message--self" : "message--other");
    header.classList.add("message--header");
    span.classList.add("message--sender");
    span.innerHTML = sender;
    span.style.color = senderColor;

    img.src = avatar;
    img.alt = `${sender}'s avatar`;
    img.classList.add("avatar");

    header.appendChild(img);
    header.appendChild(span);
    div.appendChild(header);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message--content");
    messageContent.innerHTML = content;

    div.appendChild(messageContent);
    return div;
}

// Processa e exibe as mensagens recebidas
const processMessage = ({ data }) => {
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        console.error("Erro ao analisar a mensagem:", error);
        return; // Sai da função se a análise falhar
    }

    const { userId, userName, userColor, content, userAvatar } = parsedData;

    // Verifique se todas as propriedades necessárias estão presentes
    if (!userId || !userName || !content || !userAvatar) {
        console.error("Dados incompletos recebidos:", parsedData);
        return; // Sai da função se os dados estiverem incompletos
    }

    const message = userId == user.id 
        ? createMessageElement(content, user.name, user.color, user.avatar, true)
        : createMessageElement(content, userName, userColor, userAvatar, false);

    chatMessages.appendChild(message);
    scrollScreen();
};

// Função de login
const handleLogin = (event) => {
    event.preventDefault();
    
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    user.avatar = selectedAvatar.src; // Armazena o avatar selecionado

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://turtletalk.onrender.com");
    //websocket = new WebSocket("ws://localhost:8080");

    websocket.onmessage = processMessage;

    // Envia uma mensagem de login ao servidor
    websocket.onopen = () => {
        websocket.send(JSON.stringify({ type: 'login', nickname: user.name }));
        websocket.send(JSON.stringify({ type: 'getOnlineCount' })); // Solicita contagem online
    };

    // Configuração para lidar com erros
    websocket.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
    };

    // Configuração para lidar com fechamento da conexão
    websocket.onclose = () => {
        console.log("Conexão WebSocket fechada.");
    };
};

// Envia mensagem no chat
const sendMessage = (event) => {
    event.preventDefault();

    // Verifica se a conexão WebSocket está aberta antes de enviar
    if (websocket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'message', // Define o tipo como 'message'
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value,
            userAvatar: user.avatar // Adiciona o avatar à mensagem
        };

        websocket.send(JSON.stringify(message));
        chatInput.value = ""; // Limpa a entrada após o envio
    } else {
        console.error("WebSocket não está aberto. Estado atual:", websocket.readyState);
    }
};

// Event Listeners
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
