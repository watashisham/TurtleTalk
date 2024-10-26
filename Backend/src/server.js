const {WebSocketServer} = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

wss.on("connection", (ws) =>{
    ws.on("error", console.error)

    ws.send("Mensagem enviada pelo servidor.")

    ws.on("message", (data) => {
        wss.clients.forEach((client) => client.send(data.toString()))
        
    })

    console.log("Client connected")
})

// Contagem de pessoas online
let onlineCount = 0;

wss.on('connection', (ws) => {
    onlineCount++;
    atualizarContagem(onlineCount); // Atualiza a contagem quando um novo cliente se conecta

    ws.on('close', () => {
        onlineCount--; // Decrementa a contagem quando um cliente se desconecta
        atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes
    });

    function atualizarContagem(count) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'onlineCountUpdate', count })); // Envia a contagem atualizada
            }
        });
    }
});
