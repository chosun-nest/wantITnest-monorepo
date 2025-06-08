// 팔로우 버튼
import { useState } from "react";

export default function FollowButton() {
  const [followed, setFollowed] = useState(false);

  const handleClick = () => {
    setFollowed((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1.5 border rounded-md text-sm font-bold transition ${
        followed
          ? "bg-white text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#f4f6fa]"
          : "bg-[#1E3A8A] text-white border-transparent hover:bg-[#5f7fce]"
      }`}
    >
      {followed ? "팔로잉" : "팔로우"}
    </button>
  );
}
