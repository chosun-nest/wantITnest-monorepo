import { useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import ChatRoom from "../components/chat/chat-room";
import ChatList from "../components/chat/chat-list";
import FollowingList from "../components/chat/following-list";
import ChatUnderbar from "../components/chat/chat-underbar";
import * as S from "../assets/styles/chat.styles";
import { MemberProfile } from "../types/api/profile";

export default function ChatMain() {
  const { navbarHeight } = useNavbarHeight();
  const [mode, setMode] = useState<"friend" | "chat" | "room">("friend");
  const [selectedUser, setSelectedUser] = useState<MemberProfile | null>(null);

  const handleSelectUser = (user: MemberProfile) => {
    setSelectedUser(user);
    setMode("chat");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setMode("friend");
  };

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      {mode === "friend" && (
        <FollowingList isMobile onSelectUser={handleSelectUser} />
      )}
      {mode === "chat" && selectedUser && (
        <ChatRoom isMobile user={selectedUser} onBack={handleBack} />
      )}
      {mode === "room" && <ChatList isMobile onSelectUser={handleSelectUser} />}

      <ChatUnderbar onChangeMode={setMode} />
    </S.Container>
  );
}
