// 관심분야 정보 게시판 메인 페이지
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import InterestBoardHeader from "../components/interests/board/InterestBoardHeader"    // 제목 및 게시글 개수
import InterestBoardSearch from "../components/interests/board/InterestBoardSearch"    // 상단 검색 바
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton" // 기술 필터 & 선택 태그 버튼
import TagFilterModal from "../components/board/tag/TagFilterModal";   // 필터 모달
import InterestBoardSortTabs from "../components/interests/board/InterestBoardSortTabs";  // 최신순, 좋아요순 드롭다운
//import PostList from "../components/interests/board/PostList"; 
import InterestPostCardList from "../components/interests/board/InterestPostCardList";                   // 게시글 리스트
import InterestBoardWriteButton from "../components/board/tag/BoardWriteButton"    // 글 쓰기 버튼
import Pagination from "../components/interests/board/Pagination";

export default function InterestBoard() {
  const [navHeight, setNavHeight] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<"latest" | "likes">("latest");
  const [postCount, setPostCount] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const mockPosts = [
  {
    id: 1,
    title: "관심분야 정보 게시판 오픈!",
    summary: "게시판 기능 정리 및 주요 내용 안내",
    tags: ["웹", "React"],
    author: "관리자",
    date: "3일 전",
    likes: 25,
    views: 120,
    comments: 3,
  },
  {
    id: 2,
    title: "2025 프론트엔드 트렌드 정리",
    summary: "2025년에 주목할 주요 기술 스택과 동향",
    tags: ["프론트엔드", "트렌드", "TypeScript"],
    author: "지금 IT야",
    date: "1일 전",
    likes: 45,
    views: 300,
    comments: 10,
  },
  {
    id: 3,
    title: "MacOS에서 개발 환경 세팅하기",
    summary: "Zsh, Brew, VSCode까지 한 번에 정리",
    tags: ["MacOS", "환경설정"],
    author: "제로실버",
    date: "5일 전",
    likes: 12,
    views: 88,
    comments: 1,
  },
];

const filteredPosts = mockPosts
  .filter((post) =>
    selectedTags.length > 0
      ? selectedTags.every((tag) => post.tags.includes(tag))
      : true
  )
  .filter((post) =>
    searchKeyword.trim()
      ? post.title.toLowerCase().includes(searchKeyword.toLowerCase())
      : true
  )
  .sort((a, b) => {
    if (sortType === "likes") return b.likes - a.likes;
    return b.id - a.id;
  });
  
  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const POSTS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
);


  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);
  
  
  useEffect(() => {
    setPostCount(filteredPosts.length);
  }, [filteredPosts]);


  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
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
        {/* <PostList
          //posts={posts}
          posts={mockPosts}
          selectedTags={selectedTags}
          searchKeyword={searchKeyword}
          sortType={sortType}
          onCountChange={(count) => setPostCount(count)}
        /> */}
        <InterestPostCardList posts={paginatedPosts} />

        { /* 페이지네이션 */}
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