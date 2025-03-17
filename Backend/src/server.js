const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const server = require("http").createServer();
const wss = new WebSocketServer({ server });

// Render exige que o servidor escute na porta fornecida por process.env.PORT
server.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 8080}`);
});

let onlineCount = 0; // Contagem de usuários online

wss.on("connection", (ws) => {
    onlineCount++; // Incrementa a contagem de usuários online
    atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes

    ws.on("message", (data) => {
        // Adiciona verificação para mensagens recebidas
        if (data && typeof data === 'string') {
            // Envia a mensagem recebida a todos os clientes conectados
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) { // Alterado de ws.OPEN para client.OPEN
                    client.send(data);
                }
            });
        } else {
            console.error("Mensagem recebida inválida:", data);
        }
    });

    ws.on("close", () => {
        onlineCount--; // Decrementa a contagem de usuários online
        atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes
    });

    ws.on("error", (error) => {
        console.error("Erro no WebSocket:", error); // Log de erros
    });

    // Envia uma mensagem completa ao cliente com todos os dados necessários
    ws.send(JSON.stringify({
        type: "message",
        userId: "servidor",  // Exemplo de ID do servidor
        userName: "Servidor", // Nome do usuário
        userColor: "darkcyan", // Cor do nome do usuário
        content: "Mensagem enviada pelo servidor.", // Conteúdo da mensagem
        userAvatar: "" // Avatar do servidor, caso aplicável
    }));

    console.log("Client connected");
});

// Função para atualizar a contagem de usuários online
function atualizarContagem(count) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) { // Alterado de ws.OPEN para client.OPEN
            client.send(JSON.stringify({ type: 'onlineCountUpdate', count })); // Envia a contagem atualizada
        }
    });
}