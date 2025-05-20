// 계정 탈퇴 성공 모달
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WithdrawCompleteModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem("accesstoken"); // 토큰 제거
    onClose();            // 모달 닫기
    navigate("/");        // 홈페이지(루트)로 이동
  };
  useEffect(() => {
    // 혹시 잊고 안 넣었을 경우를 대비해서 제거
    localStorage.removeItem("accesstoken");
  }, []);

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="p-6 text-center bg-white shadow-lg rounded-xl w-80">
        <h3 className="mb-4 text-lg font-bold text-gray-800">탈퇴되었습니다</h3>
        <p className="mb-6 text-sm text-gray-600">이용해주셔서 감사합니다.</p>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-white bg-blue-900 rounded"
        >
          확인
        </button>
      </div>
    </div>
  );
}
