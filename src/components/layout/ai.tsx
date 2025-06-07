import { useState } from "react";
const ai = "/assets/images/ai.png";
const ai_hover = "/assets/images/ai_hover.png";
import ChatBotUI from "../chatbot/ChatBotUI";


export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* AI 도우미 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 w-[50px] h-[50px] bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
        aria-label="AI 도우미 열기"
      >
        <img
          src={isHovered ? ai_hover : ai}
          alt="AI 도우미"
          className="w-7 h-7"
        />
      </button>

      {/* 모달 (아이콘 바로 위에) */}
      {isOpen && (
        <div className="fixed right-6 bottom-[calc(6rem+50px+8px)] w-[350px] h-[500px] bg-white rounded-xl p-4 shadow-xl z-50 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold">AI 도우미</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
              aria-label="닫기"
            >
              ✖️
            </button>
          </div>
          <ChatBotUI />
        </div>
      )}
    </>
  );
}
