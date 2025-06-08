import { useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import * as S from "../assets/styles/chat.styles";
import ChatRoom from "../components/chat/chatroom"; // ChatRoom 컴포넌트 임포트
import { Link } from "react-router-dom"; // Link 컴포넌트 임포트

// --- 가상의 채팅방 목록 (실제로는 API에서 가져와야 함) ---
const DUMMY_CHAT_ROOMS = [
  { id: "general", name: "일반 채팅방" },
  { id: "study", name: "스터디 그룹" },
  { id: "coding", name: "코딩 질문방" },
];
// --------------------------------------------------------

export default function Chat() {
  const { navbarHeight } = useNavbarHeight();
  const [selectedRoomId, setSelectedRoomId] = useState<string>("general");

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      <S.ChatContainer isMobile={false}>
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              fontSize: "1.5em",
              fontWeight: "bold",
            }}
          >
            내 채팅방 목록
          </h2>
          {DUMMY_CHAT_ROOMS.map((room) => (
            <div
              key={room.id}
              style={{
                padding: "12px 15px",
                marginBottom: "8px",
                backgroundColor:
                  selectedRoomId === room.id ? "#e0f7fa" : "#f9f9f9", // 선택된 방 강조
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: selectedRoomId === room.id ? "bold" : "normal",
                transition: "background-color 0.2s",
              }}
              onClick={() => setSelectedRoomId(room.id)} // 클릭 시 방 선택
            >
              {room.name}
            </div>
          ))}
          <p style={{ marginTop: "20px", fontSize: "1em", color: "#666" }}>
            선택된 채팅방:{" "}
            <strong>
              {DUMMY_CHAT_ROOMS.find((r) => r.id === selectedRoomId)?.name ||
                "선택 없음"}
            </strong>
          </p>
        </div>
      </S.ChatContainer>
      <ChatRoom roomId={selectedRoomId} />

      <S.Underbar>
        <S.UnderbarItem as={Link} to="/profile">
          <svg>
            <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
          </svg>
          {"내 프로필"}
        </S.UnderbarItem>
        <S.UnderbarItem>
          {/* SVG 아이콘 */}
          <svg /* ... SVG 코드 ... */>
            <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"></path>
          </svg>
          {"친구"}
        </S.UnderbarItem>
        <S.UnderbarItem>
          <svg>
            <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"></path>
          </svg>
          {"채팅방"}
        </S.UnderbarItem>
        <S.UnderbarItem>
          <svg>
            <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
          </svg>
          {"더보기"}
        </S.UnderbarItem>
      </S.Underbar>
    </S.Container>
  );
}
