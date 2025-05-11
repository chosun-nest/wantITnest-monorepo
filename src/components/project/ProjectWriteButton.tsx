// components/project/ProjectWriteButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectWriteButton() {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-8 left-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d] z-50"
      onClick={() => navigate("/project-write")}
    >
      ✏️ 글쓰기
    </button>
  );
}