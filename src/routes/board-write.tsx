// 프로젝트 게시판 & 관심분야 게시판 글쓰기 페이지
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { postsWrite } from "../api/interests/api";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/board/TagFilterModal";
import MDEditor from "@uiw/react-md-editor"; // npm install @uiw/react-md-editor @uiw/react-markdown-preview
import BoardTagFilterButton from "../components/board/BoardTagFilterButton" // 기술 필터 & 선택 태그

export default function BoardWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [boardType, setBoardType] = useState<"interests" | "projects">(() => {
    const from = location.state?.from;
    if (from === "project-board") return "projects";
    return "interests";
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [participants, setParticipants] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);      // 태그 필터 모달
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(""); 
  const [showGuide, setShowGuide] = useState(false);
  
  
  const defaultProjectContent = `[개발 프로젝트 모집 예시]

- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수):`;

  const defaultInterestContent = `[관심분야 정보 예시]

# AI 시대 개발자들의 놀이터 '허깅페이스'
## 1. 허깅 페이스란?

## 2. 허깅 페이스 핵심 서비스들 보기

## 3. 허깅 페이스 활용 사례

`;


  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    setContent(boardType === "projects" ? defaultProjectContent : defaultInterestContent);
  }, [boardType]);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await postsWrite({ title, content, tags: selectedTags });
      alert("게시글이 등록되었습니다.");
      navigate(boardType === "projects" ? "/project-board" : "/interests-board");
    } catch (err) {
      console.error(err);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadedImageUrl(data.url);
      alert("업로드 완료: 마크다운에 이미지 링크를 붙여 넣으세요.");
    } catch (err) {
      console.error("업로드 실패", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };
  
  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };
  
  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-5xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <h2 className="text-2xl font-bold text-[#002F6C] mb-4">
          {boardType === "projects" ? "프로젝트 모집 글쓰기" : "관심분야 정보 게시글 쓰기"}
        </h2>
        
        <select
          value={boardType}
          onChange={(e) => setBoardType(e.target.value as "interests" | "projects")}
          className="p-2 mb-4 border rounded"
        >
          <option value="interests">관심분야 정보 게시판</option>
          <option value="projects">프로젝트 모집 게시판</option>
        </select>

        {boardType === "projects" ? (
          <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
            <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong>
            <br />
            꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
          </div>
        ) : (
          <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
            <strong>관심분야 정보 예시를 참고해 작성해주세요.</strong>
            <br />
            최신 관심분야에 대한 정보를 정확하게 입력해주세요.
          </div>
        )}
        
        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder={boardType === "projects" ? "제목에 핵심 내용을 요약해보세요." : "제목을 입력하세요"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {boardType === "projects" && (
          <input
            className="w-full p-3 mb-4 border rounded"
            placeholder="참여인원/정원 (예: 3/6)"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        )}

        <div className="mb-4">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadedImageUrl && (
            <div className="mt-2 text-sm text-green-700">
              업로드 완료: <code>![이미지 설명]({uploadedImageUrl})</code>
            </div>
          )}
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
          <MDEditor
          value={content}
          onChange={(value: string | undefined) => setContent(value || "")}
          height={600}
        />
        </div>
        
        {/* 기술 필터 및 선택된 태그들 */}
        <div className="mb-6">
          <BoardTagFilterButton
            selectedTags={selectedTags}
            onRemoveTag={removeSelectedTag}
            onOpenFilter={() => setShowFilterModal(true)}
          />
        </div>

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
        
    </>
  );
}