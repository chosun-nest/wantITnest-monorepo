{ /* 프로필 이미지 업로드 및 미리보기 */}
import React from "react";

interface Props {
  image: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function EditProfileImage({
  image,
  onChange,
  fileInputRef,
}: Props) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <label className="text-sm font-semibold w-28">이미지</label>

      <div
        className="relative w-24 h-24 overflow-hidden rounded-full cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <img
          src={image || "/assets/images/user.png"}
          alt="프로필"
          className="object-cover w-full h-full transition group-hover:opacity-80"
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