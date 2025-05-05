// 관심분야 게시판 메인 페이지
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/interests/modals/TagFilterModal";
import PostList from "../components/interests/modals/PostList";

export default function InterestBoard() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
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
        style={{ paddingTop: navHeight + 60 }}
      >
        {/* 상단 검색 바 */}
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder="게시글 제목을 검색해보세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-grow p-3 border rounded"
            />
            <button className="px-10 py-2 text-white bg-[#002F6C] rounded">
              검색
            </button>
          </div>
        </div>

        {/* 기술 필터, 선택 태그 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-1 text-gray-700 border border-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-700"
            >
              🔎 관심분야 검색
            </button>
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-[#002F6C] bg-blue-100 text-[#002F6C]"
              >
                {tag}
                <button
                  onClick={() => removeSelectedTag(tag)}
                  className="text-[#002F6C] hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <select
            className="p-2 text-sm border rounded"
            defaultValue="latest"
            onChange={(e) => console.log("정렬 기준:", e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
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
        <PostList selectedTags={selectedTags} searchKeyword={searchKeyword} />

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
