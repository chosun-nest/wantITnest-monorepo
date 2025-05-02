{/* 관심분야 검색 + 선택 + 삭제 */}
import React from "react";
import { Item } from "./EditDepartment";

interface Props {
  isEditing: boolean;
  interests: string[];
  newInterest: string;
  filtered: Item[];
  onInputChange: (val: string) => void;
  onSelect: (item: Item) => void;
  onDelete: (index: number) => void;
}

export default function EditInterests({ isEditing, interests, newInterest, filtered, onInputChange, onSelect, onDelete }: Props) {
  return (
    <div className="flex items-start mb-4">
      <label className="w-28 text-sm font-semibold mt-2">관심분야</label>
      <div className="flex-1">
        {isEditing && (
          <>
            <input
              value={newInterest}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="ex) AI, 백엔드"
              className="mt-2 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
            />
            {filtered.length > 0 && (
              <ul className="border mt-1 rounded max-h-40 overflow-y-auto">
                {filtered.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {interests.map((tag, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1">
              #{tag}
              {isEditing && <button onClick={() => onDelete(i)} className="text-red-500">×</button>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}