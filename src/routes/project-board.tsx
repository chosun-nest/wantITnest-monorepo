import { useState } from "react";
import * as S from "../assets/styles/project-board.styles";
import { mockProjects } from "../constants/mock-projects";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const projects = mockProjects;

  // 최신순 정렬
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 검색 필터링
  const filteredProjects = sortedProjects.filter(
    (p) =>
      p.title.includes(searchTerm) ||
      p.content.includes(searchTerm)
  );

  // 페이징 처리
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: any) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  return (
    <S.Container>
      {/* 제목 + 검색창 + 글쓰기 */}
      <S.TitleSection>
        <div>
          <S.PageTitle>프로젝트 모집 게시판</S.PageTitle>
          <S.SubText>
            총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
          </S.SubText>
        </div>
        <S.SearchInput
          type="text"
          placeholder="제목 또는 내용 검색"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <S.WriteButton to="/project-write">글쓰기</S.WriteButton>
      </S.TitleSection>

      {/* 헤더 라벨 */}
      <S.TableHeader>
        <div>제목</div>
        <div>작성일</div>
        <div>참여인원</div>
      </S.TableHeader>

      {/* 리스트 출력 */}
      {currentProjects.map((project) => (
        <S.ProjectRow key={project.id} onClick={() => handleRowClick(project)}>
          <div>
            <S.TitleWithBadge>
              <S.StatusBadge status={project.status}>{project.status}</S.StatusBadge>
              <S.ProjectTitle>{project.title}</S.ProjectTitle>
            </S.TitleWithBadge>
            <S.ProjectMeta>
              {project.author} ・ 조회수 {project.views}
            </S.ProjectMeta>
          </div>
          
          <div style={{ textAlign: "center" }}>{project.date}</div>
          <div style={{ textAlign: "center" }}>참여 {project.participants}</div>
        </S.ProjectRow>
      ))}

      {/* 페이지네이션 */}
      <S.Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </S.Pagination>
    </S.Container>
  );
}