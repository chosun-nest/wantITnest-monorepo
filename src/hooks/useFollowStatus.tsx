// 팔로우 상태 확인용
import { useEffect, useState, useCallback } from "react";
import { getMyFollowing, followUser, unfollowUser } from "../api/profile/FollowAPI";

export default function useFollowStatus(targetUserId: number) {
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getMyFollowing();
      const followed = res.users.some((user) => user.memberId === targetUserId);
      setIsFollowing(followed);
    } catch (e) {
      console.error("팔로우 상태 확인 실패", e);
    }
  }, [targetUserId]);

  const follow = async () => {
    setIsFollowing(true); // 즉시 반영
    try {
      await followUser(targetUserId);
    } catch (e) {
      console.error("팔로우 실패", e);
      setIsFollowing(false); // 실패시 되돌리기
      throw e;
    }
  };

  const unfollow = async () => {
    setIsFollowing(false); // 즉시 반영
    try {
      await unfollowUser(targetUserId);
    } catch (e) {
      console.error("언팔로우 실패", e);
      setIsFollowing(true); // 실패시 되돌리기
      throw e;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { isFollowing, follow, unfollow, refetch: fetchStatus };
}
