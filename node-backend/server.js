const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // 프론트엔드 URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// 메모리에 저장할 데이터 구조
const chatRooms = new Map(); // roomId -> { messages: [], members: Set() }
const userSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

// 채팅방 생성/가져오기
function getOrCreateRoom(roomId) {
  if (!chatRooms.has(roomId)) {
    chatRooms.set(roomId, {
      messages: [],
      members: new Set(),
      roomInfo: {
        roomId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      },
    });
  }
  return chatRooms.get(roomId);
}

// 룸 이름 생성 로직
function createRoomName(type, data) {
  switch (type) {
    case "dm":
      // DM 채팅방: 두 사용자 ID를 정렬해서 일관된 룸 이름 생성
      const [user1, user2] = [data.user1, data.user2].sort(
        (a, b) => Number(a) - Number(b)
      );
      return `dm_${user1}_${user2}`;
    case "project":
      // 프로젝트 채팅방
      return `project_${data.projectId}`;
    case "open":
      // 오픈 채팅방
      return "open_chat";
    default:
      return `room_${Date.now()}`;
  }
}

io.on("connection", (socket) => {
  console.log("사용자 접속:", socket.id);

  // 사용자 등록
  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    socketUsers.set(socket.id, userId);
    console.log(`사용자 ${userId} 등록됨 (소켓: ${socket.id})`);
  });

  // 채팅방 입장
  socket.on("joinRoom", ({ roomId, userId, roomType = "dm" }) => {
    try {
      socket.join(roomId);

      const room = getOrCreateRoom(roomId);
      room.members.add(userId);
      room.roomInfo.lastActivity = new Date().toISOString();

      console.log(`사용자 ${userId}가 채팅방 ${roomId}에 입장`);

      // 기존 메시지 전송 (최근 50개)
      const recentMessages = room.messages.slice(-50);
      socket.emit("messageHistory", {
        roomId,
        messages: recentMessages,
      });

      // 다른 사용자들에게 입장 알림
      socket.to(roomId).emit("userJoined", {
        userId,
        message: `${userId}님이 입장했습니다.`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("방 입장 오류:", error);
      socket.emit("error", { message: "채팅방 입장에 실패했습니다." });
    }
  });

  // 채팅방 나가기
  socket.on("leaveRoom", ({ roomId, userId }) => {
    try {
      socket.leave(roomId);

      const room = chatRooms.get(roomId);
      if (room) {
        room.members.delete(userId);

        // 다른 사용자들에게 퇴장 알림
        socket.to(roomId).emit("userLeft", {
          userId,
          message: `${userId}님이 나갔습니다.`,
          timestamp: new Date().toISOString(),
        });
      }

      console.log(`사용자 ${userId}가 채팅방 ${roomId}에서 나감`);
    } catch (error) {
      console.error("방 나가기 오류:", error);
    }
  });

  // 메시지 전송
  socket.on(
    "sendMessage",
    ({ roomId, message, userId, userName, userImage }) => {
      try {
        const room = getOrCreateRoom(roomId);

        const messageData = {
          id: Date.now().toString(),
          text: message,
          user: userId,
          userName: userName,
          userImage: userImage || "",
          timestamp: new Date().toISOString(),
          roomId: roomId,
        };

        // 메시지 저장
        room.messages.push(messageData);
        room.roomInfo.lastActivity = new Date().toISOString();

        // 메시지 히스토리 제한 (1000개)
        if (room.messages.length > 1000) {
          room.messages = room.messages.slice(-1000);
        }

        // 해당 채팅방의 모든 사용자에게 메시지 전송
        io.to(roomId).emit("newMessage", messageData);

        console.log(`채팅방 ${roomId}에서 메시지: ${message}`);
      } catch (error) {
        console.error("메시지 전송 오류:", error);
        socket.emit("error", { message: "메시지 전송에 실패했습니다." });
      }
    }
  );

  // 채팅방 목록 요청
  socket.on("getChatRooms", (userId) => {
    try {
      const userRooms = [];

      for (const [roomId, room] of chatRooms.entries()) {
        if (room.members.has(userId)) {
          // DM 채팅방인지 확인
          const isDM = roomId.startsWith("dm_");
          const isProject = roomId.startsWith("project_");
          const isOpen = roomId === "open_chat";

          let roomName = roomId;
          let roomType = "general";

          if (isDM) {
            // DM 채팅방의 경우 상대방 이름으로 표시
            const userIds = roomId.replace("dm_", "").split("_");
            const otherUserId = userIds.find((id) => id !== userId);
            roomName = `DM with ${otherUserId}`; // 실제로는 사용자 이름을 가져와야 함
            roomType = "dm";
          } else if (isProject) {
            roomName = `프로젝트 채팅방 ${roomId.replace("project_", "")}`;
            roomType = "project";
          } else if (isOpen) {
            roomName = "🔥 오픈채팅방";
            roomType = "open";
          }

          const lastMessage =
            room.messages.length > 0
              ? room.messages[room.messages.length - 1]
              : null;

          userRooms.push({
            roomId,
            roomName,
            roomType,
            memberCount: room.members.size,
            lastMessage: lastMessage
              ? {
                  text: lastMessage.text,
                  timestamp: lastMessage.timestamp,
                  userName: lastMessage.userName,
                }
              : null,
            lastActivity: room.roomInfo.lastActivity,
          });
        }
      }

      // 최근 활동 순으로 정렬
      userRooms.sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
      );

      socket.emit("chatRoomsList", userRooms);
    } catch (error) {
      console.error("채팅방 목록 조회 오류:", error);
      socket.emit("error", { message: "채팅방 목록을 불러올 수 없습니다." });
    }
  });

  // DM 채팅방 생성
  socket.on("createDMRoom", ({ currentUserId, targetUserId }) => {
    try {
      const roomId = createRoomName("dm", {
        user1: currentUserId,
        user2: targetUserId,
      });

      const room = getOrCreateRoom(roomId);
      room.members.add(currentUserId);
      room.members.add(targetUserId);

      socket.emit("dmRoomCreated", { roomId });

      // 상대방이 온라인이면 알림
      const targetSocketId = userSockets.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("newDMRoom", {
          roomId,
          fromUserId: currentUserId,
        });
      }

      console.log(`DM 채팅방 생성: ${roomId}`);
    } catch (error) {
      console.error("DM 채팅방 생성 오류:", error);
      socket.emit("error", { message: "DM 채팅방 생성에 실패했습니다." });
    }
  });

  // 프로젝트 채팅방 생성
  socket.on("createProjectRoom", ({ projectId, projectName, members }) => {
    try {
      const roomId = createRoomName("project", { projectId });

      const room = getOrCreateRoom(roomId);
      members.forEach((memberId) => {
        room.members.add(memberId);
      });

      room.roomInfo.projectName = projectName;
      room.roomInfo.projectId = projectId;

      // 모든 멤버에게 알림
      members.forEach((memberId) => {
        const memberSocketId = userSockets.get(memberId);
        if (memberSocketId) {
          io.to(memberSocketId).emit("newProjectRoom", {
            roomId,
            projectName,
            projectId,
          });
        }
      });

      socket.emit("projectRoomCreated", { roomId, projectName });
      console.log(`프로젝트 채팅방 생성: ${roomId} (${projectName})`);
    } catch (error) {
      console.error("프로젝트 채팅방 생성 오류:", error);
      socket.emit("error", { message: "프로젝트 채팅방 생성에 실패했습니다." });
    }
  });

  // 연결 해제
  socket.on("disconnect", () => {
    const userId = socketUsers.get(socket.id);
    if (userId) {
      userSockets.delete(userId);
      socketUsers.delete(socket.id);
      console.log(`사용자 ${userId} 연결 해제됨`);
    }
  });
});

// REST API 엔드포인트들
app.get("/api/chat/rooms/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const userRooms = [];

    for (const [roomId, room] of chatRooms.entries()) {
      if (room.members.has(userId)) {
        userRooms.push({
          roomId,
          memberCount: room.members.size,
          messageCount: room.messages.length,
          lastActivity: room.roomInfo.lastActivity,
        });
      }
    }

    res.json({ rooms: userRooms });
  } catch (error) {
    res.status(500).json({ error: "채팅방 조회 실패" });
  }
});

app.get("/api/chat/room/:roomId/messages", (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const room = chatRooms.get(roomId);
    if (!room) {
      return res.status(404).json({ error: "채팅방을 찾을 수 없습니다." });
    }

    const startIndex = Math.max(0, room.messages.length - page * limit);
    const endIndex = room.messages.length - (page - 1) * limit;
    const messages = room.messages.slice(startIndex, endIndex);

    res.json({
      messages,
      hasMore: startIndex > 0,
      totalCount: room.messages.length,
    });
  } catch (error) {
    res.status(500).json({ error: "메시지 조회 실패" });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`채팅 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
