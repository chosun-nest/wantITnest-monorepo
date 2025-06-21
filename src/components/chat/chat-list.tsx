/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ChatRoomProfile } from "../../types/chat/chat";

interface ChatListProps {
  onSelectUser: (room: ChatRoomProfile) => void;
  isMobile: boolean;
  socket: any; // 실제 프로젝트에서는 Socket 타입 명시 추천
  currentUserId: string;
}

interface ChatRoomData {
  roomId: string;
  roomName: string;
  roomType: "dm" | "project" | "open" | "general";
  memberCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    userName: string;
  };
  lastActivity: string;
}

export default function ChatList({
  onSelectUser,
  socket,
  currentUserId,
}: ChatListProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [loading, setLoading] = useState(true);

  // 임시 오픈채팅방 데이터
  const createTempOpenChatRoom = (): ChatRoomData => ({
    roomId: "temp-open-room-001",
    roomName: "🔥 개발자들의 자유로운 대화",
    roomType: "open",
    memberCount: 12,
    lastMessage: {
      text: "새로운 프로젝트 아이디어 있으신 분 계시나요?",
      timestamp: new Date().toISOString(),
      userName: "코딩마스터",
    },
    lastActivity: new Date().toISOString(),
  });

  useEffect(() => {
    if (!socket || !currentUserId) {
      // 소켓이 없어도 임시 오픈채팅방은 표시
      const tempRoom = createTempOpenChatRoom();
      setChatRooms([tempRoom]);
      setLoading(false);
      return;
    }

    const loadChatRooms = () => {
      socket.emit("getChatRooms", currentUserId);
    };

    const handleChatRoomsList = (rooms: ChatRoomData[]) => {
      // 서버에서 받은 채팅방 목록에 임시 오픈채팅방 추가
      const tempRoom = createTempOpenChatRoom();
      const allRooms = [tempRoom, ...rooms].sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      );
      setChatRooms(allRooms);
      setLoading(false);
    };

    const handleNewDMRoom = () => loadChatRooms();
    const handleNewProjectRoom = () => loadChatRooms();

    const handleNewMessage = (messageData: any) => {
      setChatRooms((prev) =>
        prev
          .map((room) =>
            room.roomId === messageData.roomId
              ? {
                  ...room,
                  lastMessage: {
                    text: messageData.text,
                    timestamp: messageData.timestamp,
                    userName: messageData.userName,
                  },
                  lastActivity: messageData.timestamp,
                }
              : room
          )
          .sort(
            (a, b) =>
              new Date(b.lastActivity).getTime() -
              new Date(a.lastActivity).getTime()
          )
      );
    };

    socket.on("chatRoomsList", handleChatRoomsList);
    socket.on("newDMRoom", handleNewDMRoom);
    socket.on("newProjectRoom", handleNewProjectRoom);
    socket.on("newMessage", handleNewMessage);

    loadChatRooms();

    return () => {
      socket.off("chatRoomsList", handleChatRoomsList);
      socket.off("newDMRoom", handleNewDMRoom);
      socket.off("newProjectRoom", handleNewProjectRoom);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentUserId]);

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}시간 전`;
    return date.toLocaleDateString();
  };

  const getRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "dm":
        return "💬";
      case "project":
        return "🚀";
      case "open":
        return "🔥";
      default:
        return "💭";
    }
  };

  const getRoomImage = (room: ChatRoomData) => {
    switch (room.roomType) {
      case "open":
        return "/openchat.png";
      case "project":
        return "/project-room.png";
      case "dm":
        return "/dm-chat.png";
      default:
        return "/default-room.png";
    }
  };

  const handleRoomSelect = (room: ChatRoomData) => {
    const chatRoomProfile: ChatRoomProfile = {
      roomId: room.roomId,
      roomName: room.roomName,
      roomImageUrl: getRoomImage(room),
      roomType: room.roomType,
      lastActivity: room.lastActivity,
    };
    onSelectUser(chatRoomProfile);
  };

  if (loading) {
    return (
      <div className="w-[66%] max-w-[800px] min-w-[400px] p-5 border border-[#002f6c] rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">채팅방 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[66%] max-w-[800px] min-w-[400px] p-5 border border-[#002f6c] rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">채팅방 목록</h2>
        <span className="text-sm text-gray-500">
          {chatRooms.length}개의 채팅방
        </span>
      </div>

      {chatRooms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p>참여 중인 채팅방이 없습니다.</p>
          <p className="text-sm mt-1">팔로잉 목록에서 대화를 시작해보세요!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {chatRooms.map((room) => (
            <li
              key={room.roomId}
              onClick={() => handleRoomSelect(room)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                room.roomId === "temp-open-room-001"
                  ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <img
                  src={getRoomImage(room)}
                  alt={`${room.roomName} 이미지`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -top-1 -right-1 text-xs">
                  {getRoomIcon(room.roomType)}
                </div>
                {room.roomId === "temp-open-room-001" && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate flex items-center">
                    {room.roomName}
                    {room.roomId === "temp-open-room-001" && (
                      <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                        LIVE
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatLastActivity(room.lastActivity)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {room.lastMessage
                      ? `${room.lastMessage.userName}: ${room.lastMessage.text}`
                      : "아직 메시지가 없습니다."}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 ml-2">
                    <span className="mr-1">👥</span>
                    <span>{room.memberCount}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
