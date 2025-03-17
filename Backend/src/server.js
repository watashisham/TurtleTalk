// const { WebSocketServer } = require("ws");
// const dotenv = require("dotenv");

// dotenv.config({ path: './src/.env' });

// const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

// let onlineCount = 0; // Contagem de usuários online

// wss.on("connection", (ws) => {
//     onlineCount++; // Incrementa a contagem de usuários online
//     atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes

//     ws.on("message", (data) => {
//         let parsedData;
        
//         // Tente analisar a mensagem recebida
//         try {
//             parsedData = JSON.parse(data);
//         } catch (error) {
//             console.error("Mensagem recebida inválida:", data);
//             return; // Sai se houver um erro na análise
//         }
        
//         // Verifique o tipo de mensagem
//         const { type, nickname, content } = parsedData;

//         if (type === 'login') {
//             // Log de login bem-sucedido
//             console.log(`${nickname} entrou no chat`);
//             // Atualiza a contagem para todos os clientes conectados
//             atualizarContagem(onlineCount);
//         } else if (type === 'getOnlineCount') {
//             // Envia a contagem online apenas ao cliente solicitante
//             ws.send(JSON.stringify({ type: 'onlineCountUpdate', count: onlineCount }));
//         } else if (type === 'message') {
//             // Envia a mensagem recebida a todos os clientes conectados
//             wss.clients.forEach((client) => {
//                 if (client.readyState === ws.OPEN) {
//                     client.send(data);
//                 }
//             });
//         } else {
//             console.error("Tipo de mensagem desconhecido:", type);
//         }
//     });

//     ws.on("close", () => {
//         onlineCount--; // Decrementa a contagem de usuários online
//         atualizarContagem(onlineCount); // Atualiza a contagem para todos os clientes
//         console.log("Client disconnected");
//     });

//     ws.on("error", (error) => {
//         console.error("Erro no WebSocket:", error); // Log de erros
//     });

//     console.log("Client connected");
// });

// // Função para atualizar a contagem de usuários online
// function atualizarContagem(count) {
//     wss.clients.forEach((client) => {
//         if (client.readyState === ws.OPEN) {
//             client.send(JSON.stringify({ type: 'onlineCountUpdate', count })); // Envia a contagem atualizada
//         }
//     });
// }

const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

//const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

//INSERIDO 17/03/2025
const server = require("http").createServer();
const wss = new WebSocketServer({ server });

// Render exige que o servidor escute na porta fornecida por process.env.PORT
server.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 8080}`);
});
//------------------

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

    ws.send("Mensagem enviada pelo servidor."); // Envia uma mensagem ao novo cliente

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
