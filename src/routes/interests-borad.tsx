// 관심분야 정보 게시판 메인 페이지
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import InterestBoardHeader from "../components/interests/board/InterestBoardHeader";
import InterestBoardSearch from "../components/interests/board/InterestBoardSearch";
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import InterestBoardSortTabs from "../components/interests/board/InterestBoardSortTabs";
import InterestPostCardList from "../components/interests/board/InterestPostCardList";
import InterestBoardWriteButton from "../components/board/tag/BoardWriteButton";
import Pagination from "../components/interests/board/Pagination";
import { fetchPosts } from "../api/interests/InterestsAPI";
import type { PostSummary } from "../api/types/interest-board";

export default function InterestBoard() {
  const [navHeight, setNavHeight] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<"latest" | "likes">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const navbarRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        sort: sortType === "likes" ? "likeCount,desc" : "createdAt,desc",
        tags: selectedTags,
      };
      const data = await fetchPosts(params);
      setPosts(data.posts);   // PostSummary[] 타입이 보장됨
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("게시글 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedTags, sortType, searchKeyword]);

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight }}
      >
        {/* 제목 + 게시글 개수 */}
        <InterestBoardHeader postCount={totalCount} />

        {/* 검색 + 정렬 */}
        <InterestBoardSearch
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />

        {/* 기술 필터 및 선택된 태그들 */}
        <BoardTagFilterButton
          selectedTags={selectedTags}
          onRemoveTag={removeSelectedTag}
          onOpenFilter={() => setShowFilterModal(true)}
        />

        {/* 관심분야 검색 모달 */}
        {showFilterModal && (
          <TagFilterModal
            onClose={() => setShowFilterModal(false)}
            onApply={(tags) => {
              setSelectedTags(tags);
              setShowFilterModal(false);
            }}
          />
        )}

        {/* 정렬 드롭다운 */}
        <InterestBoardSortTabs 
          sortType={sortType} 
          onChange={setSortType}
        />

        {/* 게시글 목록 */}
        <InterestPostCardList posts={posts} />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* 글쓰기 버튼 */}
        <InterestBoardWriteButton />
      </div>
    </>
  );
}
