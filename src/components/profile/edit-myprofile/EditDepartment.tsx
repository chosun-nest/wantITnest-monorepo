{/* 학과 검색 + 선택 */}
import React from "react";

export interface Item {
  id: number;
  name: string;
}
interface EditDepartmentProps {
  isEditing: boolean;
  departmentInput: string;
  onInputChange: (value: string) => void;
  filteredDepartments: { id: number; name: string }[];
  onSelect: (item: { id: number; name: string }) => void;
}

export default function EditDepartment({
  isEditing,
  departmentInput,
  onInputChange,
  filteredDepartments,
  onSelect,
}: EditDepartmentProps) {
  return (
    <div className="flex items-start mb-4">
      <label className="w-28 text-sm font-semibold mt-2">학과</label>
      <div className="flex-1">
        <input
          value={departmentInput}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isEditing}
          className="block w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
        />
        {isEditing && filteredDepartments.length > 0 && (
          <ul className="border mt-1 rounded max-h-40 overflow-y-auto">
            {filteredDepartments.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}