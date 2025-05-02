// src/routes/notice-board.tsx
import { useState } from "react";
import * as S from "../assets/styles/notice.styles";
import NoticeRow from "../components/notice/NoticeRow";
import { mockNotices } from "../constants/mock-notices";
import SearchInput from "../components/common/SearchInput";

const ITEMS_PER_PAGE = 7;

export default function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotices = mockNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <S.Container>
      {/* 타이틀 + 게시물 수 + 검색창 */}
      <S.TitleSection style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <S.PageTitle>학사공지</S.PageTitle>
          <S.SubText>
            총 <strong>{filteredNotices.length}</strong>개의 게시물이 있습니다.
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

      {/* 테이블 헤더 */}
      <S.TableHeader>
        <span>No</span>
        <span>제목</span>
        <span>작성일</span>
        <span>작성자</span>
        <span>조회수</span>
        <span>첨부</span>
      </S.TableHeader>

      {/* 공지사항 목록 */}
      <S.TableBody>
        {currentNotices.map((notice) => (
          <NoticeRow key={notice.id} notice={notice} />
        ))}
      </S.TableBody>

      {/* 페이지네이션 */}
      <S.Pagination>
        <button onClick={() => handlePageClick(1)} disabled={currentPage === 1}>{"<<"}</button>
        <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </S.Pagination>
    </S.Container>
  );
}