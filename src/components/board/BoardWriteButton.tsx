// 게시판 글쓰기 버튼
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardWriteButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    if (location.pathname.includes("project")) {
      navigate("/project-write");
    } else if (location.pathname.includes("interest")) {
      navigate("/interests-write");
    } else {
      // fallback 처리
      navigate("/interests-write");
    }
  };

  return (
    <button
      className="fixed bottom-8 left-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d]"
      onClick={handleNavigate}
    >
      ✏️ 글쓰기
    </button>
  );
}
