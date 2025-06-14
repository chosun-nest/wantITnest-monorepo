const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// --- 채팅 방 관리 상태 ---
const clientsInRooms = new Map(); // Map<WebSocket, string>
const rooms = new Map(); // Map<string, Set<WebSocket>>

app.get("/", (req, res) => {
  res.send("Node.js WebSocket chat server is running!");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log(
    `새로운 WebSocket 클라이언트 연결됨: ${ws._socket.remoteAddress}`
  );

  ws.on("message", (message) => {
    const messageString = message.toString();
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(messageString);
    } catch (e) {
      console.error("유효하지 않은 JSON 메시지 수신:", messageString);
      return;
    }

    const { type, payload } = parsedMessage;

    switch (type) {
      case "joinRoom": {
        const { roomName, userId } = payload;
        ws.username = userId || "익명";

        const oldRoom = clientsInRooms.get(ws);
        if (oldRoom && rooms.has(oldRoom)) {
          rooms.get(oldRoom).delete(ws);
          if (rooms.get(oldRoom).size === 0) {
            rooms.delete(oldRoom);
            console.log(`방 "${oldRoom}"이 비어 삭제되었습니다.`);
          }
        }

        if (!rooms.has(roomName)) {
          rooms.set(roomName, new Set());
          console.log(`새로운 방 "${roomName}"이 생성되었습니다.`);
        }

        rooms.get(roomName).add(ws);
        clientsInRooms.set(ws, roomName);

        console.log(
          `클라이언트(${ws.username})가 방 "${roomName}"에 입장했습니다.`
        );

        rooms.get(roomName).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                payload: {
                  user: "System",
                  text: `${ws.username}님이 "${roomName}" 방에 입장했습니다.`,
                },
              })
            );
          }
        });

        break;
      }

      case "chatMessage": {
        const { text } = payload;
        const sender = ws.username || "익명";
        const currentRoom = clientsInRooms.get(ws);

        console.log(`[${currentRoom}] ${sender}: ${text}`);

        if (rooms.has(currentRoom)) {
          rooms.get(currentRoom).forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message",
                  payload: { user: sender, text },
                })
              );
            }
          });
        }

        break;
      }

      default:
        console.log("알 수 없는 메시지 타입:", type);
    }
  });

  ws.on("close", () => {
    console.log(`WebSocket 클라이언트 연결 끊김: ${ws._socket.remoteAddress}`);
    const roomOfDisconnectedClient = clientsInRooms.get(ws);

    if (roomOfDisconnectedClient && rooms.has(roomOfDisconnectedClient)) {
      rooms.get(roomOfDisconnectedClient).delete(ws);
      if (rooms.get(roomOfDisconnectedClient).size === 0) {
        rooms.delete(roomOfDisconnectedClient);
        console.log(`방 "${roomOfDisconnectedClient}"이 비어 삭제되었습니다.`);
      } else {
        rooms.get(roomOfDisconnectedClient).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                payload: {
                  user: "System",
                  text: `${ws.username || "익명"}님이 퇴장했습니다.`,
                },
              })
            );
          }
        });
      }
    }

    clientsInRooms.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket 에러 발생:", error);
  });
});

server.listen(PORT, () => {
  console.log(`✅ WebSocket 서버 실행 중: http://localhost:${PORT}`);
});
