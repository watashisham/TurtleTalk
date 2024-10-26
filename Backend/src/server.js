const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

let onlineCount = 0; // Contagem de usuários online

wss.on("connection", (ws) => {
    onlineCount++; // Incrementa a contagem de usuários online
    atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes

    ws.on("message", (data) => {
        // Envia a mensagem recebida a todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    ws.on("close", () => {
        onlineCount--; // Decrementa a contagem de usuários online
        atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes
    });

    ws.on("error", console.error); // Log de erros

    ws.send("Mensagem enviada pelo servidor."); // Envia uma mensagem ao novo cliente

    console.log("Client connected");
});

// Função para atualizar a contagem de usuários online
function atualizarContagem(count) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'onlineCountUpdate', count })); // Envia a contagem atualizada
        }
    });
}