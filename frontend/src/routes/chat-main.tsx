import { useEffect, useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import ChatRoom from "../components/chat/chat-room";
import ChatList from "../components/chat/chat-list";
import FollowingList from "../components/chat/following-list";
import ChatUnderbar from "../components/chat/chat-underbar";
import * as S from "../assets/styles/chat.styles";
import {
  ChatMode,
  SimpleMemberProfile,
  ChatRoomProfile,
} from "../types/chat/chat";
import { checkMyFollowings } from "../api/following/follow";
import io from "socket.io-client";

const WS_SERVER_URL =
  import.meta.env.VITE_API_CHAT_URL || "http://localhost:4000";
const socket = io(WS_SERVER_URL, { transports: ["websocket"] });

export default function ChatMain() {
  const { navbarHeight } = useNavbarHeight();
  const [mode, setMode] = useState<ChatMode>("following");
  const [selectedUser, setSelectedUser] = useState<SimpleMemberProfile | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomProfile | null>(
    null
  );
  const [followings, setFollowings] = useState<SimpleMemberProfile[]>([]);

  useEffect(() => {
    checkMyFollowings().then((data) => {
      const mapped: SimpleMemberProfile[] = data.users.map((user) => ({
        memberId: user.memberId,
        memberName: user.memberName,
        memberImageUrl: user.memberImageUrl,
        memberIntroduce: user.memberIntroduce,
        memberIsStudent: user.memberIsStudent,
      }));
      setFollowings(mapped);
    });
  }, []);

  const handleSelectUser = (user: SimpleMemberProfile) => {
    setSelectedUser(user);
    setSelectedRoom(null);
    setMode("chat");
  };

  const handleSelectRoom = (room: ChatRoomProfile) => {
    setSelectedRoom(room);
    setSelectedUser(null);
    setMode("chat");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
    setMode("following");
  };

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      {mode === "following" && (
        <FollowingList
          isMobile
          onSelectUser={handleSelectUser}
          users={followings}
        />
      )}

      {mode === "room" && (
        <ChatList
          isMobile
          socket={socket}
          currentUserId={String(selectedUser?.memberId ?? "")}
          onSelectUser={handleSelectRoom}
        />
      )}

      {mode === "chat" && selectedUser && (
        <ChatRoom
          isMobile
          onBack={handleBack}
          chatRoom={{
            roomId: `dm-${selectedUser.memberId}`, // 서버에서 고유한 roomId 포맷 지정해야 일치
            roomName: selectedUser.memberName,
            roomImageUrl: selectedUser.memberImageUrl,
            roomType: "dm",
            lastActivity: new Date().toISOString(),
          }}
        />
      )}

      {mode === "chat" && selectedRoom && (
        <ChatRoom isMobile chatRoom={selectedRoom} onBack={handleBack} />
      )}

      <ChatUnderbar onChangeMode={setMode} />
    </S.Container>
  );
}
