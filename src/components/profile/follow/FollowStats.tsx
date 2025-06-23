// 1단계 : 팔로워/팔로잉 수 표시 UI 컴포넌트
import { useState } from "react";
import FollowListModal from "./FollowListModal"; // 2단계 컴포넌트

interface FollowStatsProps {
  memberId: number;
  followerCount: number;
  followingCount: number;
  memberName: string;
}

export default function FollowStats({
  memberId,
  followerCount,
  followingCount,
  memberName,
}: FollowStatsProps) {
  const [openTab, setOpenTab] = useState<"follower" | "following" | null>(null);

  return (
    <>
      <div className="flex justify-center gap-8 mt-4 text-sm font-medium text-gray-700">
        <button onClick={() => setOpenTab("follower")}>
          팔로워 <span className="font-bold">{followerCount}</span>
        </button>
        <button onClick={() => setOpenTab("following")}>
          팔로잉 <span className="font-bold">{followingCount}</span>
        </button>
      </div>

      {openTab && (
        <FollowListModal
          memberId={memberId}
          type={openTab}
          memberName={memberName}
          onClose={() => setOpenTab(null)}
        />
      )}
    </>
  );
}
