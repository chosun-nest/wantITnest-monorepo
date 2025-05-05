import { useLocation, useNavigate } from "react-router-dom";
import * as S from "../assets/styles/project-detail.styles";  // 파일명 정확!
import { Project } from "../api/project/api";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // 게시판에서 넘겨준 프로젝트 데이터 받기
  const project = location.state?.project as Project | null;

  // 만약 project가 없으면 에러 메시지
  if (!project) {
    return (
      <S.Container>
        <S.Title>프로젝트 상세보기</S.Title>
        <p>프로젝트 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Title>프로젝트 상세보기</S.Title>
      <S.ContentCard>
        <p><strong>제목:</strong> {project.projectTitle}</p>
        <p><strong>설명:</strong> {project.projectDescription}</p>
        <p><strong>시작일:</strong> {project.projectStartDate}</p>
        <p><strong>종료일:</strong> {project.projectEndDate}</p>
        <p><strong>최대 인원:</strong> {project.maxMember}</p>
        <p><strong>상태:</strong> {project.closed ? "마감" : "모집중"}</p>
      </S.ContentCard>
      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </S.Container>
  );
}