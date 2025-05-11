// 게시글 detail 오른쪽 사용자 정보 컴포넌트 > 다시 새롭게 만들 것임
import React from "react";
import { useNavigate } from "react-router-dom";

interface AuthorProfileCardProps {
  memberId: number;
  memberName: string;
  memberImageUrl?: string;
  followerCount: number;
  isFollowing: boolean;
  onToggleFollow: () => void; // 팔로우 / 언팔로우 핸들러
}

export default function AuthorProfileCard({
  memberId,
  memberName,
  memberImageUrl,
  followerCount,
  isFollowing,
  onToggleFollow,
}: AuthorProfileCardProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 bg-white border shadow rounded-xl">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/profile/${memberId}`)}
      >
        <img
          src={memberImageUrl || "/assets/images/user.png"}
          alt="프로필 이미지"
          className="object-cover w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{memberName}</p>
          <p className="text-sm text-gray-500">팔로워 {followerCount}명</p>
        </div>
      </div>

      <button
        onClick={onToggleFollow}
        className={`mt-4 w-full py-1.5 text-sm rounded ${
          isFollowing
            ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
            : "bg-blue-900 text-white hover:bg-blue-800"
        } transition`}
      >
        {isFollowing ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
}
