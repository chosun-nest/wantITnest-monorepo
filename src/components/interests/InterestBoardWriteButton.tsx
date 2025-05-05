// 관심사 정보 글쓰기 버튼
import React from "react";
import { useNavigate  } from "react-router-dom";

export default function InterestBoardWriteButton() {
  const navigate = useNavigate();

  return (
    <button
        className="fixed bottom-8 left-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d]"
        onClick={() => navigate("/interests-write.tsx")}
      >
        ✏️ 글쓰기
    </button>
  );
}