import { useContext, useState } from "react";
import { NavbarHeightContext } from "../context/NavbarHeightContext";
import { mockProjects } from "../constants/mock-projects";
import * as S from "../assets/styles/project.styles";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const { navbarHeight } = useContext(NavbarHeightContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = mockProjects.filter((project) =>
    project.title.includes(searchTerm) || project.author.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <S.Container style={{ paddingTop: `${navbarHeight}px` }}>
      <S.TitleSection>
        <div>
          <S.PageTitle>프로젝트 모집 게시판</S.PageTitle>
          <S.SubText>
            총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
          </S.SubText>
        </div>
        <S.SearchInput
          type="text"
          placeholder="제목 또는 작성자 검색"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </S.TitleSection>

      <S.TableHeader>
        <span>No</span>
        <span>제목</span>
        <span>작성일</span>
        <span>작성자</span>
        <span>조회수</span>
        <span>참여인원/정원</span>
        <span>첨부</span>
      </S.TableHeader>

      <S.TableBody>
        {currentProjects.map((project) => (
          <S.TableRow key={project.id}>
            <span>{project.id}</span>
            <S.ProjectTitle>{project.title}</S.ProjectTitle>
            <span>{project.date}</span>
            <span>{project.author}</span>
            <span>{project.views}</span>
            <span>{project.participants}</span>
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