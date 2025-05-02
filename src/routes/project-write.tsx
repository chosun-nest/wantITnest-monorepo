import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockProjects } from "../constants/mock-projects";
import * as S from "../assets/styles/project-write.styles";

export default function ProjectWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [participants, setParticipants] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleSubmit = () => {
    if (!title || !content || !participants) {
      alert("제목, 본문, 참여인원/정원은 필수입니다!");
      return;
    }

    const newProject = {
      id: mockProjects.length + 1,
      title: title,
      content: content,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      author: "유겸",  // 로그인 기능 붙으면 교체 예정
      views: 0,
      participants: participants,
      hasAttachment: hasAttachment,
      status: "모집중"
    };

    mockProjects.push(newProject);
    alert("게시글이 추가되었습니다!");
    navigate("/project-board");
  };

  return (
    <S.Container>
      <h2>프로젝트 모집 글쓰기</h2>

      <div>
        <S.TitleInput
          type="text"
          value={title}
          placeholder="제목에 핵심 내용을 요약해보세요."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <S.ParticipantsInput
          type="text"
          value={participants}
          placeholder="참여인원/정원 (예: 3/6)"
          onChange={(e) => setParticipants(e.target.value)}
        />
      </div>

      <div>
        <S.ContentTextArea
          value={content}
          placeholder="본문 내용을 작성하세요."
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={hasAttachment}
            onChange={(e) => setHasAttachment(e.target.checked)}
          /> 첨부파일 있음
        </label>
      </div>

      <S.ButtonGroup>
        <S.CancelButton onClick={() => navigate("/project-board")}>
          취소
        </S.CancelButton>
        <S.SubmitButton onClick={handleSubmit}>
          등록
          </S.SubmitButton>
        </S.ButtonGroup>
    </S.Container>
  );
}