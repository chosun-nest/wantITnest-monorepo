import { useState } from "react";
import * as S from "../assets/styles/project-board.styles";
import { useNavigate } from "react-router-dom";

interface ProjectWriteProps {
  onAdd: (newProject: {
    id: number;
    title: string;
    date: string;
    author: string;
    views: number;
    participants: string;
    hasAttachment: boolean;
    content?: string;
  }) => void;
}

export default function ProjectWrite({ onAdd }: ProjectWriteProps) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("유겸"); // ⭐ 기본값 "유겸"
  const [participants, setParticipants] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !participants) {
      alert("제목, 작성자, 참여인원은 필수입니다.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

    onAdd({
      id: Math.floor(Math.random() * 100000), // 실제로는 DB에서 자동 생성
      title,
      date: today,
      author,
      views: 0,
      participants,
      hasAttachment,
      content,
    });

    navigate("/project-board");
  };

  return (
    <S.Container>
      <S.PageTitle>프로젝트 모집 글쓰기</S.PageTitle>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" }}
      >
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="작성자"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="참여인원/정원 (예: 3/6)"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={hasAttachment}
            onChange={(e) => setHasAttachment(e.target.checked)}
          />
          첨부파일 있음
        </label>
        <textarea
          placeholder="본문 내용을 작성하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          style={{ padding: "10px" }}
        />
        <button type="submit">작성 완료</button>
      </form>
    </S.Container>
  );
}