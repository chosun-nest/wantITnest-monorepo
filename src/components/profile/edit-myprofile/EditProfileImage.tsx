// 프로필 이미지 업로드 및 미리보기
import React from "react";
interface Props {
  image: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function EditProfileImage({
  image,
  isEditing,
  onChange,
  fileInputRef,
}: Props) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <label className="text-sm font-semibold w-28">이미지</label>
      
      <div
        className={`relative w-24 h-24 overflow-hidden rounded-full ${  
          isEditing ? "cursor-pointer group" : "cursor-default"   // button 상태가 isEditing일 때만 hover 효과 표시됨
        }`}
        onClick={() => {
          if (isEditing) fileInputRef.current?.click();
        }}
      >
        <img
          src={image || "/assets/images/user.png"}
          alt="프로필"
          className={`object-cover w-full h-full transition ${
            isEditing ? "group-hover:opacity-80" : ""
          }`}
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
