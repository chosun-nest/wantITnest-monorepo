{ /* 프로필 이미지 업로드 및 미리보기 */}
import React from "react";

interface Props {
  image: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function EditProfileImage({ image, isEditing, onChange, fileInputRef }: Props) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <label className="w-28 text-sm font-semibold">이미지</label>
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <img
          src={image}
          alt="프로필"
          className="w-24 h-24 rounded-lg object-cover group-hover:opacity-80 transition"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
} 
