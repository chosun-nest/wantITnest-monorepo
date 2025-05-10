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

      {/* 작성자, 작성일, 조회수 */}
      <S.SubInfo>
        <S.Author>{project.author}</S.Author> | 작성일: {project.date} | 조회수: {project.views}
      </S.SubInfo>

      {/* 설명 */}
      <S.Description>{project.content}</S.Description>

      {/* 구분선 */}
      <S.Divider />

      {/* 메타 정보 */}
      <S.MetaBox>
        <p><strong>참여인원:</strong> {project.participants}</p>
        <p><strong>상태:</strong> {project.status}</p>
      </S.MetaBox>

      {/* 댓글 */}
      <CommentSection />

      {/* 뒤로 가기 버튼 */}
      <S.BackButton onClick={() => navigate(-1)}>뒤로 가기</S.BackButton>
    </S.Container>
  );
}