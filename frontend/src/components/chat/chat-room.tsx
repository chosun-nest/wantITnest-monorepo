import { useState, useEffect, useRef, useCallback } from "react";
import { getMemberProfile } from "../../api/profile/ProfileAPI";
import { SimpleMemberProfile, ChatRoomProfile } from "../../types/chat/chat";
import ChatBubble from "./chat-bubble";
import io, { Socket } from "socket.io-client";

interface ChatMessage {
  id: string;
  text: string;
  user: string;
  userName: string;
  userImage?: string;
  timestamp: string;
  roomId: number;
  read?: boolean;
}

interface ChatRoomProps {
  isMobile: boolean;
  chatRoom: ChatRoomProfile;
  onBack: () => void;
}

const WS_SERVER_URL = import.meta.env.VITE_API_CHAT_URL;

export default function ChatRoom({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMobile,
  chatRoom,
}: ChatRoomProps) {
  const [currentUser, setCurrentUser] = useState<SimpleMemberProfile | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await getMemberProfile();
      setCurrentUser(profile);
    } catch (error) {
      console.error("내 프로필 가져오기 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!currentUser || !chatRoom.roomId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(WS_SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("register", currentUser.memberId);
      socket.emit("joinRoom", {
        roomId: chatRoom.roomId,
        userId: currentUser.memberId,
        roomType: chatRoom.roomType || "general",
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("messageHistory", ({ roomId, messages: historyMessages }) => {
      if (roomId === chatRoom.roomId) {
        setMessages(historyMessages);
      }
    });

    socket.on("newMessage", (messageData: ChatMessage) => {
      if (messageData.roomId === chatRoom.roomId) {
        setMessages((prev) => [...prev, messageData]);
      }
    });
    /*
    socket.on("userJoined", ({ message, timestamp }) => {
      const systemMessage: ChatMessage = {
        id: `system_${Date.now()}`,
        text: message,
        user: "system",
        userName: "System",
        timestamp,
        roomId: chatRoom.roomId,
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    socket.on("userLeft", ({ message, timestamp }) => {
      const systemMessage: ChatMessage = {
        id: `system_${Date.now()}`,
        text: message,
        user: "system",
        userName: "System",
        timestamp,
        roomId: chatRoom.roomId,
      };
      setMessages((prev) => [...prev, systemMessage]);
    });
*/
    socket.on("error", ({ message }) => {
      console.error("채팅 오류:", message);
      alert(`채팅 오류: ${message}`);
    });

    return () => {
      socket.emit("leaveRoom", {
        roomId: chatRoom.roomId,
        userId: currentUser.memberId,
      });

      socket.disconnect();
      setMessages([]);
      setIsConnected(false);
    };
  }, [currentUser, chatRoom.roomId, chatRoom.roomType]);

  const handleSend = () => {
    if (
      !inputMessage.trim() ||
      !currentUser ||
      !socketRef.current ||
      !isConnected
    )
      return;

    socketRef.current.emit("sendMessage", {
      roomId: chatRoom.roomId,
      message: inputMessage.trim(),
      userId: currentUser.memberId,
      userName: currentUser.memberName,
      userImage: currentUser.memberImageUrl || "",
    });

    setInputMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  if (!currentUser)
    return (
      <div className="p-5 text-sm text-gray-500">프로필 불러오는 중...</div>
    );

  return (
    <>
      {" "}
      <div className=" overflow-auto ">
        {/* 메시지 영역 */}
        <div className="flex-1 px-4 py-3 bg-white overflow-y-auto">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isMe={msg.userName === String(currentUser.memberName)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>{" "}
      {/* 입력창 */}
      <div className="flex w-[100%] items-center gap-2 ">
        <input
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim()}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#002f6c] rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </>
  );
}
