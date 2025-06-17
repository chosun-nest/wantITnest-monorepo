import { useEffect, useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import ChatRoom from "../components/chat/chat-room";
import ChatList from "../components/chat/chat-list";
import FollowingList from "../components/chat/following-list";
import ChatUnderbar from "../components/chat/chat-underbar";
import * as S from "../assets/styles/chat.styles";
import { ChatMode, SimpleMemberProfile } from "../types/chat/chat";
import { checkMyFollowings } from "../api/following/follow";

export default function ChatMain() {
  const { navbarHeight } = useNavbarHeight();
  const [mode, setMode] = useState<ChatMode>("following");
  const [selectedUser, setSelectedUser] = useState<SimpleMemberProfile | null>(
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
    setMode("chat");
  };

  const handleBack = () => {
    setSelectedUser(null);
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
      {mode === "chat" && selectedUser && (
        <ChatRoom isMobile user={selectedUser} onBack={handleBack} />
      )}
      {mode === "room" && <ChatList isMobile onSelectUser={handleSelectUser} />}
      <ChatUnderbar onChangeMode={setMode} />
    </S.Container>
  );
}
