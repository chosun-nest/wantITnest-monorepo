// 게시판 글쓰기 버튼
import { useNavigate } from "react-router-dom";

export default function BoardWriteButton() {
  const navigate = useNavigate();

  const handleNavigate = () => { navigate("/board-write", { state: { from: "interest-board" }})};

  return (
    <button
      className="fixed bottom-8 left-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d]"
      onClick={handleNavigate}
    >
      ✏️ 글쓰기
    </button>
  );
}
