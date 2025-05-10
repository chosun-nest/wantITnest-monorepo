// 최신순, 좋아요순 드롭다운 컴포넌트
import React from "react";

interface Props {
  sortType: "latest" | "likes";
  onChange: (value: "latest" | "likes") => void;
}

export default function InterestBoardSortDropdown({ sortType, onChange }: Props) {
  return (
    <div className="flex justify-end mb-4">
      <select
        value={sortType}
        onChange={(e) => onChange(e.target.value as "latest" | "likes")}
        className="px-3 py-1 text-sm text-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="latest">최신순</option>
        <option value="likes">좋아요순</option>
      </select>
    </div>
  );
}
