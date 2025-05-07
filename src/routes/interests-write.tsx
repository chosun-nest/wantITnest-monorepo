import React, { useState } from "react";
import { useNavigate } from "react-router-dom";     // Link로 바꾸기
import { postsWrite } from "../api/interests/api";

export default function PostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await postsWrite({ title, content, tags });
      alert("게시글이 등록되었습니다.");
      navigate("/interests-board");
    } catch (error) {
      alert("게시글 등록에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="text-2xl font-bold text-[#00256c] mb-4">제목에 핵심 내용을 요약해보세요.</h2>

      <input
        type="text"
        className="w-full p-3 mb-4 border rounded"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          태그를 설정하세요 (최대 10개)
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
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/interests-board")}
          className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#002F6C]"
        >
          등록
        </button>
      </div>
    </div>
  );
}
