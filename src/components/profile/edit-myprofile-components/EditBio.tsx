import React from "react";

interface Props {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}

export default function EditBio({ value, isEditing, onChange }: Props) {
  return (
    <div className="flex items-start mb-4">
      <label className="w-28 text-sm font-semibold mt-2">자기소개</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        className="flex-1 p-2 rounded border min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
      />
    </div>
  );
} 
