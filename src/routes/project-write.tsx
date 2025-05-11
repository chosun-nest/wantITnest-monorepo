import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../assets/styles/project-write.styles";
import { mockProjects } from "../constants/mock-projects";

export default function ProjectWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(`[개발 프로젝트 모집 예시]

- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수): 
`);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag) && tags.length < 6) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title || !content) {
      alert("제목과 본문은 필수입니다!");
      return;
    }

    const newProject = {
      id: mockProjects.length + 1,
      title,
      content,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      author: "유겸",
      views: 0,
      participants: "0/0", // 참여인원 필드 임시 유지
      hasAttachment,
      status: "모집중",
      tags,
    };

    mockProjects.push(newProject);
    alert("게시글이 추가되었습니다!");
    navigate("/project-board");
  };

  return (
    <div className="max-w-5xl mx-auto pt-[120px] px-4 mb-6">
      <h2 className="text-2xl font-bold text-[#00256c] p-3">프로젝트 모집 글쓰기</h2>

      <S.InfoBanner>
        <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong>
        <br />
        꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
      </S.InfoBanner>

      <input
        type="text"
        className="w-full p-4 mb-4 border text-xl rounded"
        placeholder="제목에 핵심 내용을 요약해보세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 태그 입력 영역 */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          태그를 설정하세요 (최대 6개)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-grow p-2 border rounded"
            placeholder="태그 입력 후 Enter"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-[#00256c] text-white rounded"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-[#00256c] rounded-full flex items-center gap-1 text-sm"
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <textarea
        className="w-full p-4 mb-6 border rounded h-60"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={hasAttachment}
          onChange={(e) => setHasAttachment(e.target.checked)}
        />
        <span className="text-sm">첨부파일 있음</span>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/project-board")}
          className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#001f4d]"
        >
          등록
        </button>
      </div>
    </div>
  );
}