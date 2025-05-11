// 관심분야 정보 게시글 쓰기 (InterestWrite.tsx)

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsWrite } from "../api/interests/api";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/interests/TagFilterModal";
import MDEditor from "@uiw/react-md-editor";

export default function InterestWrite() {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string | undefined>(
    `[관심분야 정보 예시]

# AI 시대 개발자들의 놀이터 '허깅페이스'
1. 허깅 페이스란?
~~~
2. 허깅 페이스 핵심 서비스들 보기
~~~
3. 허깅 페이스 활용 사례
~~~`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (navbarRef.current) setNavHeight(navbarRef.current.offsetHeight);
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    try {
      await postsWrite({ title, content, tags });
      alert("게시글이 등록되었습니다.");
      navigate("/interests-board");
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  const handleBoardChange = (value: "interests" | "projects") => {
    if (value === "projects") navigate("/project-write", { replace: true });
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-5xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <h2 className="text-2xl font-bold text-[#002F6C] mb-4">관심분야 정보 게시글 쓰기</h2>

        <div className="mb-4">
          <select
            value="interests"
            onChange={(e) => handleBoardChange(e.target.value as "interests" | "projects")}
            className="p-2 mb-4 border rounded"
          >
            <option value="interests">관심분야 정보 게시판</option>
            <option value="projects">프로젝트 모집 게시판</option>
          </select>
        </div>

        <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
          <strong>관심분야 정보 예시를 참고해 작성해주세요.</strong>
          <br />
          최신 관심분야에 대한 정보를 정확하게 입력해주세요.
        </div>

        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 mb-2 text-sm text-white bg-[#00256c] rounded"
        >
          🔎 태그 선택
        </button>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-blue-100 text-[#002F6C] rounded-full flex items-center gap-1"
            >
              {tag}
              <button onClick={() => setTags(tags.filter((t) => t !== tag))}>×</button>
            </span>
          ))}
        </div>

        <div className="mb-6">
        <button
          className="flex items-center gap-1 text-sm font-semibold"
          onClick={() => setShowGuide((prev) => !prev)}
        >
          <span className="text-xs">{showGuide ? "▲" : "▼"}</span>
          📘 마크다운 사용법 예시
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 underline"
          >
            (바로가기)
          </a>
        </button>

        {showGuide && (
          <div className="p-4 mt-2 text-sm text-gray-700 border rounded bg-gray-50">
            <p>📷 사진: <code>![설명](이미지 URL)</code></p>
            <p>🎥 영상: <code>[영상 제목](YouTube 링크)</code></p>
            <p>🔗 링크: <code>[텍스트](URL)</code></p>
            <p>⌨ 코드: <code>```언어명\n코드내용```</code></p>
          </div>
          )}
        </div>

        <div className="mb-6">
          <MDEditor value={content} onChange={(value) => setContent(value || "")} height={600} />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#001a47]"
          >
            등록
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TagFilterModal
          onClose={() => setIsModalOpen(false)}
          onApply={(selectedTags) => {
            setTags(selectedTags);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
