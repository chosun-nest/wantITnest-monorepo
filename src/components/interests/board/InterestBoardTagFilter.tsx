// 기술 필터 & 선택 태그
import React from "react";

interface Props {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  onOpenFilter: () => void;
}

export default function InterestBoardTagFilter({ selectedTags, onRemoveTag, onOpenFilter }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <button
        onClick={onOpenFilter}
        className="px-4 py-1 text-gray-700 border border-gray-700 rounded-md hover:bg-gray-100"
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
            onClick={() => onRemoveTag(tag)}
            className="text-[#002F6C] hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}