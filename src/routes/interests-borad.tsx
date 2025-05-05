// 관심분야 게시판 메인 페이지
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/interests/modals/TagFilterModal";
import PostList from "../components/interests/modals/PostList";

export default function InterestBoard() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-5xl min-h-screen p-4 mx-auto bg-white" style={{ paddingTop: navHeight + 60 }}>
        {/* 검색 영역 */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="관심분야를 검색해보세요"
            className="flex-grow p-3 border rounded"
          />
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 border rounded text-[#002F6C] border-[#002F6C] hover:bg-[#002F6C] hover:text-white"
          >
            기술 검색
          </button>
        </div>

        {/* 필터 모달 */}
        {showFilterModal && (
          <TagFilterModal
            onClose={() => setShowFilterModal(false)}
            onApply={(tags) => {
              setSelectedTags(tags);
              setShowFilterModal(false);
            }}
          />
        )}

        {/* 게시글 리스트 */}
        <PostList selectedTags={selectedTags} />

        {/* 글쓰기 버튼 */}
        <button
          className="fixed bottom-8 right-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d]"
          onClick={() => console.log("글쓰기 이동")}
        >
          ✏️ 글쓰기
        </button>
      </div>
    </>
  );
}
