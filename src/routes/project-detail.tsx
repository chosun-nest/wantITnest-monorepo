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
      {/* 상태 뱃지 + 제목 */}
      <S.TitleRow>
        <S.StatusBadge status={project.status}>
          {project.status}
        </S.StatusBadge>
        <S.Title>{project.title}</S.Title>
      </S.TitleRow>

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
      </S.MetaBox>

      {/* 댓글 */}
      <S.ContentCard>
        <CommentSection />
      </S.ContentCard>

      <S.ButtonRow>
        <S.ApplyButton onClick={() => navigate("/project-apply")}>
          ✍️ 지원하기
        </S.ApplyButton>
      </S.ButtonRow>

      {/* 뒤로 가기 버튼 */}
      <S.BackButton onClick={() => navigate(-1)}>뒤로 가기</S.BackButton>
    </S.Container>
  );
}