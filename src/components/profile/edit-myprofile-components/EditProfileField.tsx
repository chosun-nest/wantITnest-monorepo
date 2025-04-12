{/* 이름/이메일 등 readonly 필드 */}
import React from "react";

interface Props {
  name: string;
  email: string;
}

export default function EditProfileField({ name, email }: Props) {
  return (
    <>
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이름</label>
        <input value={name} disabled className="flex-1 bg-gray-100 p-2 rounded" />
      </div>
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이메일</label>
        <input value={email} disabled className="flex-1 bg-gray-100 p-2 rounded" />
      </div>
    </>
  );
}