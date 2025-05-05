import { useParams, useNavigate } from "react-router-dom";
import * as S from "../assets/styles/project-detail.styles";  // 스타일 파일 그대로 사용
import { mockProjects } from "../constants/mock-projects";    // mock 데이터 불러오기

export default function ProjectDetail() {
  const { id } = useParams();         // URL 파라미터에서 id 가져오기
  const navigate = useNavigate();

  // mockProjects 에서 id 일치하는 프로젝트 찾기
  const project = mockProjects.find(p => p.id === Number(id));

  // project 못 찾으면 에러 메시지 출력
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
        <p><strong>제목:</strong> {project.title}</p>
        <p><strong>설명:</strong> {project.content}</p>
        <p><strong>작성일:</strong> {project.date}</p>
        <p><strong>작성자:</strong> {project.author}</p>
        <p><strong>조회수:</strong> {project.views}</p>
        <p><strong>참여인원:</strong> {project.participants}</p>
        <p><strong>상태:</strong> {project.status}</p>
      </S.ContentCard>
      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </S.Container>
  );
}