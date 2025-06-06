// server.js

const express = require("express");
const http = require("http"); // HTTP 서버 생성을 위한 모듈
const WebSocket = require("ws"); // WebSocket 서버 라이브러리
const cors = require("cors"); // CORS 미들웨어

const app = express();
// Express 앱(HTTP 서버) 생성: WebSocket 서버는 이 HTTP 서버 위에서 동작합니다.
const server = http.createServer(app);

// CORS 설정: 프론트엔드 개발 서버(예: React의 3000번 포트)에서 오는 요청을 허용합니다.
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 개발 서버 주소
    methods: ["GET", "POST"], // 허용할 HTTP 메서드
    credentials: true, // 인증 정보(쿠키, 인증 헤더) 전달 허용
  })
);

// WebSocket 서버 생성 및 HTTP 서버에 연결
// wss는 WebSocket Server의 약자입니다.
const wss = new WebSocket.Server({ server });

// 서버 포트 설정. 환경 변수(process.env.PORT)가 있으면 사용하고, 없으면 4000번 포트를 사용합니다.
const PORT = process.env.PORT || 4000;

// -----------------------------------------------------
// 채팅방 관리 로직 (나중에 확장될 부분)
// 각 WebSocket 클라이언트가 현재 어떤 방에 있는지 추적하기 위한 Map
const clientsInRooms = new Map(); // Map<WebSocket, string (roomName)>
// 각 방에 어떤 클라이언트들이 있는지 추적하기 위한 Map
const rooms = new Map(); // Map<string (roomName), Set<WebSocket>>
// -----------------------------------------------------

// 웹 서버의 루트 경로에 대한 간단한 HTTP 응답 (선택 사항, 서버가 잘 동작하는지 확인용)
app.get("/", (req, res) => {
  res.send("Node.js WebSocket chat server is running!");
});

// WebSocket 연결 이벤트 처리
// 새로운 클라이언트가 WebSocket 서버에 연결될 때마다 이 함수가 실행됩니다.
wss.on("connection", (ws) => {
  console.log(
    `새로운 WebSocket 클라이언트 연결됨: ${ws._socket.remoteAddress}`
  ); // 연결된 클라이언트의 IP 주소 로깅

  // 클라이언트로부터 메시지 수신 이벤트 처리
  ws.on("message", (message) => {
    // WebSocket 메시지는 Buffer 형태로 오므로 toString()으로 문자열로 변환
    const messageString = message.toString();
    let parsedMessage;

    try {
      // 클라이언트로부터 JSON 형식의 메시지를 기대합니다.
      // 메시지 형식: { type: 'joinRoom', payload: { roomName: 'general' } }
      // 메시지 형식: { type: 'chatMessage', payload: { text: '안녕하세요', userId: 'user123' } }
      parsedMessage = JSON.parse(messageString);
    } catch (e) {
      console.error("유효하지 않은 JSON 메시지 수신:", messageString);
      return; // JSON 파싱 실패 시 처리 중단
    }

    const { type, payload } = parsedMessage;

    switch (type) {
      case "joinRoom":
        const { roomName } = payload;

        // 이 클라이언트가 기존에 참여했던 방에서 나가도록 처리
        const oldRoom = clientsInRooms.get(ws);
        if (oldRoom && rooms.has(oldRoom)) {
          rooms.get(oldRoom).delete(ws);
          if (rooms.get(oldRoom).size === 0) {
            rooms.delete(oldRoom); // 방에 아무도 없으면 방 제거
            console.log(`방 "${oldRoom}"이 비어 삭제되었습니다.`);
          }
        }

        // 새로운 방에 클라이언트 추가
        if (!rooms.has(roomName)) {
          rooms.set(roomName, new Set());
          console.log(`새로운 방 "${roomName}"이 생성되었습니다.`);
        }
        rooms.get(roomName).add(ws);
        clientsInRooms.set(ws, roomName); // 클라이언트가 현재 참여 중인 방 정보 업데이트

        console.log(`클라이언트가 방 "${roomName}"에 입장했습니다.`);
        // 해당 방의 모든 클라이언트에게 입장 메시지 브로드캐스트
        rooms.get(roomName).forEach((client) => {
          // WebSocket 연결이 열려있는 상태인지 확인 후 메시지 전송
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                payload: {
                  user: "System",
                  text: `"${roomName}" 방에 새로운 참가자가 입장했습니다.`,
                },
              })
            );
          }
        });
        break;

      case "chatMessage":
        const { text, userId: msgUserId } = payload;
        // 클라이언트가 현재 참여 중인 방을 가져옴 (없으면 기본값 'general' 사용)
        const currentClientRoom = clientsInRooms.get(ws) || "general";

        console.log(`[${currentClientRoom}] ${msgUserId}: ${text}`);

        // TODO: 여기에서 메시지를 데이터베이스에 저장하는 로직을 추가할 수 있습니다.
        // 예: saveMessageToDatabase({ room: currentClientRoom, senderId: msgUserId, content: text, timestamp: new Date() });

        // 현재 방의 모든 클라이언트에게 메시지 브로드캐스트
        if (rooms.has(currentClientRoom)) {
          rooms.get(currentClientRoom).forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message",
                  payload: { user: msgUserId, text: text },
                })
              );
            }
          });
        }
        break;

      default:
        console.log("알 수 없는 메시지 타입:", type);
    }
  });

  // 클라이언트 연결 끊김 처리
  ws.on("close", () => {
    console.log(`WebSocket 클라이언트 연결 끊김: ${ws._socket.remoteAddress}`);

    // 이 클라이언트가 참여했던 방에서 제거
    const roomOfDisconnectedClient = clientsInRooms.get(ws);
    if (roomOfDisconnectedClient && rooms.has(roomOfDisconnectedClient)) {
      rooms.get(roomOfDisconnectedClient).delete(ws);
      if (rooms.get(roomOfDisconnectedClient).size === 0) {
        rooms.delete(roomOfDisconnectedClient); // 방에 아무도 없으면 방 제거
        console.log(`방 "${roomOfDisconnectedClient}"이 비어 삭제되었습니다.`);
      } else {
        // 해당 방의 모든 클라이언트에게 퇴장 메시지 브로드캐스트
        rooms.get(roomOfDisconnectedClient).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                payload: {
                  user: "System",
                  text: `"${roomOfDisconnectedClient}" 방에서 한 참가자가 퇴장했습니다.`,
                },
              })
            );
          }
        });
      }
    }
    clientsInRooms.delete(ws); // 클라이언트 맵에서도 제거
  });

  // 에러 처리
  ws.on("error", (error) => {
    console.error("WebSocket 에러 발생:", error);
  });
});

// HTTP 서버 시작
server.listen(PORT, () => {
  console.log(`Node.js WebSocket 서버가 ${PORT}번 포트에서 실행 중입니다.`);
  console.log(
    `프론트엔드는 http://localhost:5173/ 에서 연결될 것으로 예상됩니다.`
  );
});
