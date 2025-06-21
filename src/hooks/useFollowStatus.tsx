// 팔로우 상태 확인용
import { useEffect, useState } from "react";
import { getMyFollowing } from "../api/profile/FollowAPI";

export default function useFollowStatus(targetUserId: number): [boolean, (value: boolean) => void] {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const res = await getMyFollowing();
        const followed = res.users.some((user) => user.memberId === targetUserId);
        setIsFollowing(followed);
      } catch (e) {
        console.error("팔로우 상태 확인 실패", e);
      }
    };

    fetchFollowStatus();
  }, [targetUserId]);

  return [isFollowing, setIsFollowing];
}