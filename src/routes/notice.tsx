import { useNavigate, useParams } from "react-router-dom";
import { mockNotices } from "../constants/mock-notices";

export default function Notice() {
  const navigate = useNavigate();
  const { id } = useParams(); // 주소창에서 /notice/123 → id = 123
  const notice = mockNotices.find((n) => n.id.toString() === id); // 문자열 비교

  if (!notice) {
    return (
      <div style={{ padding: "100px 20px" }}>존재하지 않는 공지입니다.</div>
    );
  }

  return (
    <div style={{ padding: "100px 20px" }}>
      <h2 style={{ color: "#00256C" }}>{notice.title}</h2>

      <div style={{ fontSize: "14px", marginBottom: "16px", color: "#555" }}>
        <p>작성일: {notice.date}</p>
        <p>작성자: {notice.author}</p>
        <p>조회수: {notice.views}</p>
      </div>

      {notice.hasAttachment && (
        <p style={{ color: "#0066FF", fontWeight: "bold" }}>📎 첨부파일 있음</p>
      )}

      <hr style={{ margin: "20px 0" }} />

      <div>{notice.content || "내용이 없습니다."}</div>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#00256C",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← 뒤로가기
      </button>
    </div>
  );
}
