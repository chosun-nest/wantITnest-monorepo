// 기술 필터 & 선택 태그
import React from "react";

interface Props {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  onOpenFilter: () => void;
}

export default function BoardTagFilterButton({
  selectedTags,
  onRemoveTag,
  onOpenFilter,
}: Props) {
  return (
    <div className="mb-6">
      {/* 버튼 */}
      <div className="mb-3">
        <button
          onClick={onOpenFilter}
          className="px-3 py-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          🔎 태그 선택
        </button>
      </div>

      {/* 태그 리스트 */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            onClick={() => onRemoveTag(tag)}
            className="inline-flex items-center px-2 py-1 text-[13px] font-medium bg-gray-100 text-gray-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
          >
            {tag}
            <span className="ml-1">×</span>
          </span>
        ))}
      </div>
    </div>
  );
}
