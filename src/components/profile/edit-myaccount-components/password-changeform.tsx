import React from "react";
import { motion } from "framer-motion";

interface Props {
  passwords: {
    new: string;
    confirm: string;
  };
  onChange: (field: "new" | "confirm", value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PasswordChangeForm({ passwords, onChange, onSave, onCancel }: Props) {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <label className="w-36 text-sm font-semibold">새 비밀번호</label>
          <input
            type="password"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
            value={passwords.new}
            onChange={(e) => onChange("new", e.target.value)}
          />
        </div>

        <div className="flex items-center mb-6">
          <label className="w-36 text-sm font-semibold">새 비밀번호 확인</label>
          <input
            type="password"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
            value={passwords.confirm}
            onChange={(e) => onChange("confirm", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            취소
          </button>
          <button onClick={onSave} className="bg-blue-900 text-white px-4 py-2 rounded">
            저장
          </button>
        </div>
      </div>
    </motion.div>
  );
}
