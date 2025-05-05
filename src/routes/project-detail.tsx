import { useParams, useNavigate } from "react-router-dom";
import * as S from "../assets/styles/project-detail.styles";
import { mockProjects } from "../constants/mock-projects";
import CommentSection from "../components/project/commentsection";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = mockProjects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <S.Container>
        <S.Title>프로젝트 상세보기</S.Title>
        <p>프로젝트 정보를 불러올 수 없습니다.</p>
        <S.BackButton onClick={() => navigate(-1)}>뒤로 가기</S.BackButton>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {/* 제목 */}
      <S.Title>{project.title}</S.Title>

      {/* 작성자 & 작성일 */}
      <S.SubInfo>
        작성자: {project.author} | 작성일: {project.date}
      </S.SubInfo>

      {/* 상세정보 박스 */}
      <S.ContentCard>
        <p><strong>설명:</strong> {project.content}</p>
        <p><strong>조회수:</strong> {project.views}</p>
        <p><strong>참여인원:</strong> {project.participants}</p>
        <p><strong>상태:</strong> {project.status}</p>
      </S.ContentCard>

      {/* 댓글 */}
      <CommentSection />

      {/* 뒤로 가기 버튼 */}
      <S.BackButton onClick={() => navigate(-1)}>뒤로 가기</S.BackButton>
    </S.Container>
  );
}