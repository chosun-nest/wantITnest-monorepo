import React from "react";

interface Props {
  onEdit: () => void;
  passwordLength: number;
}

export default function PasswordSummary({ onEdit, passwordLength }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <label className="w-36 text-sm font-semibold">비밀번호</label>
        <input
          type="password"
          value={"*".repeat(passwordLength)}
          disabled
          className="flex-1 bg-gray-100 p-2 rounded text-lg tracking-widest"
        />
      </div>
      <div className="text-right">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-900 text-white rounded"
        >
          설정
        </button>
      </div>
    </div>
  );
}