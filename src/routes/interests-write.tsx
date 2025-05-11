import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postsWrite } from "../api/interests/api";
import Navbar from "../components/layout/navbar";

export default function InterestsWrite() {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  const [boardType, setBoardType] = useState("interests"); // 'interests' | 'projects'
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await postsWrite({ title, content, tags });
      alert("등록 완료되었습니다.");
      navigate(
        boardType === "interests" ? "/interests-board" : "/project-board"
      );
    } catch (err) {
      alert("게시글 등록 실패");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-5xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <h2 className="text-2xl font-bold text-[#002F6C] mb-4">관심분야 정보 게시글 쓰기</h2>

        {/* 게시판 선택 */}
        <div className="mb-4">
          <select
            value={boardType}
            onChange={(e) => setBoardType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="projects">프로젝트 모집</option>
            <option value="interests">관심분야 정보</option>
          </select>
        </div>

        {/* 제목 */}
        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 태그 */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              className="flex-grow p-2 border rounded"
              placeholder="태그 입력 후 Enter"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            <button onClick={handleAddTag} className="px-4 py-2 bg-[#00256c] text-white rounded">
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 rounded-full">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* 편집 툴바 (사진/링크/코드 UI) */}
        <div className="flex items-center gap-4 mb-2 text-xl text-gray-600">
          📷 🎥 🔗 ⌨️ {/* placeholder icons */}
        </div>

        {/* 본문 */}
        <textarea
          className="w-full p-4 mb-6 border rounded h-60"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button onClick={() => navigate(-1)} className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100">
            취소
          </button>
          <button onClick={handleSubmit} className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#001a47]">
            등록
          </button>
        </div>
      </div>
    </>
  );
}
