// 관심분야 정보 게시판 메인 페이지
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import InterestBoardHeader from "../components/board/InterestBoardHeader"    // 제목 및 게시글 개수
import InterestBoardSearch from "../components/board/InterestBoardSearch"    // 상단 검색 바
import InterestBoardTagFilter from "../components/board/InterestBoardTagFilter" // 기술 필터 & 선택 태그
import TagFilterModal from "../components/modals/interests/TagFilterModal";   // 필터 모달
import InterestBoardSortDropdown from "../components/board/InterestBoardSortDropdown";  // 최신순, 좋아요순 드롭다운
import PostList from "../components/board/PostList";                    // 게시글 리스트
import InterestBoardWriteButton from "../components/board/BoardWriteButton"    // 글 쓰기 버튼

export default function InterestBoard() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<"latest" | "likes">("latest");
  const [postCount, setPostCount] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-5xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight }}
      >
        {/* 제목 + 게시글 개수 */}
        <InterestBoardHeader postCount={postCount} />

        {/* 검색 + 정렬 */}
        <InterestBoardSearch
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />

        {/* 기술 필터 및 선택된 태그들 */}
        <InterestBoardTagFilter
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
        <InterestBoardSortDropdown
          sortType={sortType}
          onChange={(value) => setSortType(value)}
        />
                
        {/* 게시글 목록 */}
        <PostList
          selectedTags={selectedTags}
          searchKeyword={searchKeyword}
          sortType={sortType}
          onCountChange={(count) => setPostCount(count)}
        />

        {/* 글쓰기 버튼 */}
        <InterestBoardWriteButton />
      </div>
    </>
  );
}