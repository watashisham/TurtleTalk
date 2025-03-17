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
const colors = ["darkcyan", "darkblue", "darkred", "darkviolet", "strongmagenta"];
const user = {id: "", name: "", color: "", avatar: ""};
let websocket;

// Função para gerar cores aleatórias para nicknames
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Função para rolar a tela ao receber mensagem
const scrollScreen = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

// Processa e exibe as mensagens recebidas
const processMessage = ({ data }) => {
    console.log("Mensagem recebida do servidor:", data);
    let parsedData;
    try {
        parsedData = JSON.parse(data);  // Tenta analisar a mensagem como JSON
    } catch (error) {
        console.error("Erro ao analisar a mensagem:", error);
        return;  // Sai se houver erro na análise
    }

    if (!parsedData || !parsedData.type) {
        console.error("Mensagem recebida sem tipo:", parsedData);
        return;
    }

    // Verifica o tipo da mensagem
    if (parsedData.type === "onlineCountUpdate") {
        console.log(`Usuários online: ${parsedData.count}`);
        return;
    }

    // Verifica se todos os dados necessários estão presentes
    const { userId, userName, userColor, content, userAvatar } = parsedData;

    if (!userId || !userName || !content || !userAvatar) {
        console.error("Dados incompletos recebidos:", parsedData);
        return;
    }

    // Criação da mensagem
    const message = userId === user.id 
        ? createMessageElement(content, user.name, user.color, user.avatar, true)
        : createMessageElement(content, userName, userColor, userAvatar, false);
    
    // Adiciona a mensagem ao chat e rola a tela para exibi-la
    chatMessages.appendChild(message);
    scrollScreen();
};


// Função de login
const handleLogin = (event) => {
    event.preventDefault();
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    user.avatar = selectedAvatar.src;
    login.style.display = "none";
    chat.style.display = "flex";
    websocket = new WebSocket("wss://turtletalk.onrender.com");
    websocket.onmessage = processMessage;
    websocket.onopen = () => {
        websocket.send(JSON.stringify({ type: 'login', nickname: user.name }));
        websocket.send(JSON.stringify({ type: 'getOnlineCount' }));
    };
    websocket.onerror = (error) => console.error("Erro no WebSocket:", error);
    websocket.onclose = () => console.log("Conexão WebSocket fechada.");
};

// Envia mensagem no chat
const sendMessage = (event) => {
    event.preventDefault();
    if (websocket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'message',
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value.trim(),
            userAvatar: user.avatar
        };
        console.log("Enviando mensagem:", message);
        websocket.send(JSON.stringify(message));
        chatInput.value = "";
    } else {
        console.error("WebSocket não está aberto. Estado atual:", websocket.readyState);
    }
};

// Event Listeners
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
