// 비밀번호 설정 성공 모달
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md text-center shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-gray-800">비밀번호가 변경되었습니다</h3>
        <p className="mb-6 text-sm text-gray-600">다시 로그인해 주세요.</p>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-950"
        >
          확인
        </button>
      </div>
    </div>
  );
}
