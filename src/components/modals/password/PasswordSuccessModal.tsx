import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

export default function PasswordSuccessModal({ onClose }: Props) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem("accesstoken"); // 로그아웃 : accesstoken 반납
    onClose();
    navigate("/login");   // 닫기 누르면 로그인 페이지로 이동
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md text-center shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">비밀번호가 변경되었습니다</h3>
        <p className="text-sm text-gray-600 mb-6">다시 로그인해 주세요.</p>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950"
        >
          확인
        </button>
      </div>
    </div>
  );
}
