import { useState, useEffect, useRef, useCallback } from "react";
import useResponsive from "../../hooks/responsive";
import * as S from "../../assets/styles/chat.styles";
import { getMemberProfile, MemberProfile } from "../../api/profile/ProfileAPI";

// --- 타입 정의 ---
interface ChatMessage {
  user: string; // 메시지를 보낸 사용자 ID (또는 닉네임)
  text: string;
  timestamp?: string;
  profileImageUrl?: string;
}

interface ChatRoomProps {
  roomId: string;
}

// --- 상수 ---
const WS_SERVER_URL = "ws://localhost:4000";

// --- 유틸리티 함수 (선택 사항: 별도 파일로 분리 가능) ---
// 메시지를 안전하게 JSON.stringify하는 함수
const safeJsonStringify = (data: unknown): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error("JSON.stringify 오류:", e, data);
    return ""; // 오류 발생 시 빈 문자열 반환 또는 적절한 처리
  }
};

// --- ChatRoom 컴포넌트 ---
export default function ChatRoom({ roomId }: ChatRoomProps) {
  const isMobile = useResponsive();
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<MemberProfile | null>(null); // 초기값 null 명시
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. 사용자 프로필 정보 가져오기 ---
  const fetchUserProfile = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const profile = await getMemberProfile();
      setUserProfile(profile);
      setCurrentMemberId(profile.memberId);
      console.log("현재 로그인한 사용자의 memberId:", profile.memberId);
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
      setCurrentMemberId(null);
      setUserProfile(null);
      // alert('프로필을 불러오는데 실패했습니다. 로그인 상태를 확인해주세요.'); // 사용자에게 알림
    } finally {
      setIsProfileLoading(false);
    }
  }, []); // 의존성 배열 비움: 컴포넌트 마운트 시 한 번만 실행

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // --- 2. WebSocket 연결 및 메시지 처리 ---
  useEffect(() => {
    // 기존 WebSocket 연결이 있다면 닫음
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      console.log("기존 WebSocket 연결 종료");
    }

    // 새 WebSocket 연결 생성
    const ws = new WebSocket(WS_SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket 연결됨. 방: ${roomId}`);
      // 연결 후 현재 방에 입장 메시지 전송
      ws.send(
        safeJsonStringify({ type: "joinRoom", payload: { roomName: roomId } })
      );
      // TODO: roomId에 해당하는 이전 메시지들을 스프링 API로 불러와 messages 상태에 설정
      // 예: const oldMessages = await fetchChatHistory(roomId);
      //     setMessages(oldMessages);
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "message") {
          setMessages((prevMessages) => [...prevMessages, parsedData.payload]);
        }
      } catch (e) {
        console.error("수신된 메시지 파싱 오류:", e, event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket 에러 발생:", error);
      // 사용자에게 에러 상태를 시각적으로 알림
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 끊김");
      // TODO: 재연결 로직 구현 (예: 특정 조건에서 setTimeout을 이용한 재시도)
      // 주의: 무한 재연결 루프 방지
    };

    // 클린업 함수: 컴포넌트 언마운트 또는 roomId 변경 시 실행
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        console.log("WebSocket 연결 클린업 실행.");
      }
      setMessages([]); // 방 변경 시 메시지 목록 초기화
    };
  }, [roomId]); // roomId 변경 시 WebSocket 재연결

  // --- 3. 메시지 자동 스크롤 ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 4. 메시지 전송 핸들러 ---
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();

    // 전송 조건 검사: 메시지 내용, WebSocket 연결 상태, 사용자 ID 및 프로필 로드 여부
    const isReadyToSend =
      trimmedMessage &&
      wsRef.current?.readyState === WebSocket.OPEN &&
      currentMemberId !== null && // null이 아닌 유효한 memberId
      userProfile; // userProfile 객체가 유효한 경우

    if (isReadyToSend) {
      const messageData = {
        type: "chatMessage",
        payload: {
          text: trimmedMessage,
          user: String(currentMemberId), // memberId를 문자열로 변환하여 사용
          // profileImageUrl: userProfile.memberImageUrl, // 필요시 프로필 이미지 URL도 함께 전송
        },
      };
      if (wsRef.current) {
        wsRef.current.send(safeJsonStringify(messageData));
      }
      setInputMessage("");
    } else if (currentMemberId === null) {
      alert("로그인 후 채팅을 이용할 수 있습니다.");
    } else if (!trimmedMessage) {
      // 메시지 내용이 비어있을 경우 (disabled 조건에 이미 포함되지만 명시적으로)
      console.warn("메시지 내용을 입력해주세요.");
    } else {
      // 기타 전송 불가능한 경우 (WebSocket 연결 끊김 등)
      console.warn("메시지를 보낼 수 없습니다. 연결 상태를 확인해주세요.");
    }
  };

  // --- 5. UI 렌더링 (로딩/에러 상태 우선) ---
  if (isProfileLoading) {
    return (
      <S.ChatContainer isMobile={isMobile} style={{ marginTop: "20px" }}>
        <p style={{ padding: "20px", textAlign: "center" }}>
          프로필 정보를 불러오는 중...
        </p>
      </S.ChatContainer>
    );
  }

  if (currentMemberId === null) {
    return (
      <S.ChatContainer isMobile={isMobile} style={{ marginTop: "20px" }}>
        <p style={{ padding: "20px", textAlign: "center", color: "red" }}>
          채팅에 참여할 수 없습니다. 로그인 상태를 확인해주세요.
        </p>
      </S.ChatContainer>
    );
  }

  // --- 6. 실제 채팅 UI 렌더링 ---
  return (
    <S.ChatContainer isMobile={isMobile} style={{ marginTop: "20px" }}>
      <h3
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#eef",
          fontWeight: "bold",
        }}
      >
        현재 채팅방: {roomId}
      </h3>

      {/* 메시지 표시 영역 */}
      <S.MessagesContainer isMobile={isMobile}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "8px",
              textAlign:
                msg.user === String(currentMemberId) ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "15px",
                backgroundColor:
                  msg.user === String(currentMemberId) ? "#007bff" : "#f0f0f0",
                color: msg.user === String(currentMemberId) ? "white" : "black",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {/* 메시지 발신자 표시 */}
              <strong>
                {/* 현재 유저의 메시지인 경우 닉네임, 아니면 서버에서 받은 user ID/닉네임 */}
                {msg.user === String(currentMemberId)
                  ? userProfile?.memberName || `ID:${currentMemberId}` // 내 메시지, 닉네임 없으면 ID
                  : msg.user}{" "}
                {/* 다른 사람 메시지, 서버에서 받은 user 값 그대로 */}:
              </strong>{" "}
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </S.MessagesContainer>

      {/* 메시지 입력 영역 */}
      <S.InputContainer isMobile={isMobile}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder={
            currentMemberId !== null
              ? "메시지를 입력하세요..."
              : "로그인 후 채팅에 참여할 수 없습니다."
          }
          disabled={currentMemberId === null || isProfileLoading} // 로딩 중에도 비활성화
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={
            currentMemberId === null ||
            inputMessage.trim().length === 0 ||
            isProfileLoading
          } // 로딩 중에도 비활성화
          style={{
            marginLeft: "10px",
            padding: "8px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </S.InputContainer>
    </S.ChatContainer>
  );
}
