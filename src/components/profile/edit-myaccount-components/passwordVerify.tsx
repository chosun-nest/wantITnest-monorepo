import React from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PasswordVerify({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <label className="w-36 text-sm font-semibold">현재 비밀번호</label>
        <input
          type="password"
          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800 mb-1"
          placeholder="현재 비밀번호를 입력하세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
      <div className="flex-1">
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:underline"
        >
          ← 뒤로
        </button>
      </div>
      <button
        onClick={onNext}
        className="bg-blue-900 text-white px-4 py-2 rounded"
      >
        다음
      </button>
    </div>
    </div>
  );
}