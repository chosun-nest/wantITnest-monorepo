import { useParams, useNavigate } from "react-router-dom";
import { mockProjects } from "../constants/mock-projects"; // mockProjects 타입 참고용
import * as S from "../assets/styles/project.styles";

// ✅ props 타입 정의
interface ProjectDetailProps {
  projects: typeof mockProjects;
  comments: {
    [key: number]: { name: string; text: string; date: string }[];
  };
  onCommentAdd: (projectId: number, name: string, text: string) => void;
}

export default function ProjectDetail({ projects, comments, onCommentAdd }: ProjectDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find((item) => item.id === Number(id));
  const projectComments = comments[Number(id)] || [];

  if (!project) {
    return (
      <S.Container>
        <S.Title>존재하지 않는 프로젝트입니다.</S.Title>
        <S.BackButton onClick={() => navigate(-1)}>
          목록으로 돌아가기
        </S.BackButton>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Title>{project.title}</S.Title>

      <S.MetaInfo>
        작성일: {project.date} | 작성자: {project.author} | 조회수: {project.views}
      </S.MetaInfo>

      <S.ContentCard>
        <div>
          <strong>참여인원/정원:</strong> {project.participants}
        </div>
        <div>
          <strong>첨부파일:</strong> {project.hasAttachment ? "있음 📎" : "없음"}
        </div>
        <br />
        <div>{project.content || "프로젝트에 대한 설명이 작성되지 않았습니다."}</div>
      </S.ContentCard>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: "40px" }}>
        <h3>댓글 {projectComments.length}</h3>
        {projectComments.map((c, index) => (
          <div key={index}>
            <strong>{c.name}:</strong> {c.text}{" "}
            <span style={{ fontSize: "0.8rem", color: "#888" }}>
              ({c.date})
            </span>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).comment as HTMLInputElement;
            if (input.value.trim()) {
              onCommentAdd(Number(id), "유겸", input.value);
              input.value = "";
            }
          }}
          style={{ marginTop: "10px" }}
        >
          <input
            type="text"
            name="comment"
            placeholder="댓글을 작성해보세요."
            style={{
              padding: "6px",
              width: "300px",
              marginRight: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button type="submit" style={{ padding: "6px 10px" }}>
            등록
          </button>
        </form>
      </div>

      <S.BackButton onClick={() => navigate(-1)}>
        ← 목록으로 돌아가기
      </S.BackButton>
    </S.Container>
  );
}