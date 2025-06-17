import { ChatRoomProfile } from "../../types/chat/chat";

interface ChatListProps {
  onSelectUser: (room: ChatRoomProfile) => void;
  isMobile: boolean;
}

const openChatRoom: ChatRoomProfile = {
  roomId: "open-room",
  roomName: "🔥 오픈채팅방",
  roomImageUrl: "/openchat.png",
};

const dummyChatRooms: ChatRoomProfile[] = [
  openChatRoom,
  {
    roomId: "room-123",
    roomName: "유니티 프로젝트팀",
    roomImageUrl: "/room1.png",
  },
  {
    roomId: "room-456",
    roomName: "면접 스터디",
    roomImageUrl: "/room2.png",
  },
];

export default function ChatList({ onSelectUser }: ChatListProps) {
  return (
    <div className="w-[66%] max-w-[800px] min-w-[400px] p-5 border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">대화 중인 채팅방</h2>
      <ul className="mt-4">
        {dummyChatRooms.map((room) => (
          <li
            key={room.roomId}
            onClick={() => onSelectUser(room)}
            className="flex items-center p-3 border rounded-lg mb-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            <img
              src={room.roomImageUrl}
              alt={`${room.roomName} 이미지`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span className="font-semibold">{room.roomName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
