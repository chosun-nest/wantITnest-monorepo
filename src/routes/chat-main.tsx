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
import { createRoom, enterRoom } from "../api/following/chat";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../store/slices/userSlice";

const WS_SERVER_URL =
  import.meta.env.VITE_API_CHAT_URL || "http://localhost:4000";
const socket = io(WS_SERVER_URL, { transports: ["websocket"] });

export default function ChatMain() {
  const currentUserId = useSelector(selectCurrentUserId);
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

  const handleSelectUser = async (user: SimpleMemberProfile) => {
    try {
      setSelectedUser(user);
      setSelectedRoom(null);

      // 1. 채팅방 생성 (상대방의 memberId로)
      const roomData = await createRoom(user.memberName);

      // 2. 방 정보 가져오기
      const roomId = roomData.chattingRoomId;
      const roomName = roomData.chattingRoomName;

      // 3. 입장 처리
      await enterRoom({ roomId, memberId: user.memberId });
      if (currentUserId) {
        await enterRoom({ roomId, memberId: currentUserId });
      }

      // 4. 모드 전환 + ChatRoom 진입
      setSelectedRoom({
        roomId,
        roomName,
        roomImageUrl: user.memberImageUrl,
        roomType: "dm",
        lastActivity: new Date().toISOString(),
      });
      setMode("chat");
    } catch (err) {
      console.error("채팅방 생성 또는 입장 실패:", err);
      alert("채팅방 생성 실패");
    }
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
