{/* 이름/이메일 등 readonly 필드 */}
import React from "react";

interface Props {
  name: string;
  email: string;
}

export default function EditProfileField({ name, email }: Props) {
  const isChosunEmail = email.endsWith("@chosun.ac.kr") || email.endsWith("@chosun.kr");

  return (
    <>
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이름</label>
        <input value={name} disabled className="flex-1 bg-gray-100 p-2 rounded" />
      </div>

      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이메일</label>
        <div className="flex-1 flex items-center gap-2">
          <input value={email} disabled className="w-full bg-gray-100 p-2 rounded" />
          {isChosunEmail && (
            <img
              src="/assets/images/verified-badge.png"
              alt="Verified"
              title="조선대 인증 이메일"
              className="w-5 h-5"
            />
          )}
        </div>
      </div>
    </>
  );
}

