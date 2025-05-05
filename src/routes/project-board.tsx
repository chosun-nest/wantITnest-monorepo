import { useState } from "react";
import * as S from "../assets/styles/project-board.styles";
import { mockProjects } from "../constants/mock-projects"; // mock 데이터 가져오기
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // mock 데이터
  const projects = mockProjects;

  // 최신순 (날짜 기준 내림차순)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 검색 필터
  const filteredProjects = sortedProjects.filter(
    (p) =>
      p.title.includes(searchTerm) ||
      p.content.includes(searchTerm)
  );

  // 페이징
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

  return (
    <S.Container>
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

      <S.TableHeader>
        <span>No</span>
        <span>제목</span>
        <span>작성일</span>
        <span>작성자</span>
        <span>조회수</span>
        <span>참여인원</span>
        <span>상태</span>
        <span>첨부</span>
      </S.TableHeader>

      <S.TableBody>
        {currentProjects.map((project, index) => (
          <S.TableRow key={project.id}>
            <span>{filteredProjects.length - (startIdx + index)}</span>
            <S.ProjectTitle
              onClick={() =>
                navigate(`/project/${project.id}`, { state: { project } })
              }
              style={{ cursor: "pointer" }}
            >
              {project.title}
            </S.ProjectTitle>
            <span>{project.date}</span>
            <span>{project.author}</span>
            <span>{project.views}</span>
            <span>{project.participants}</span>
            <S.StatusText status={project.status}>
              {project.status}
            </S.StatusText>
            <span>{project.hasAttachment ? "📎" : ""}</span>
          </S.TableRow>
        ))}
      </S.TableBody>

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