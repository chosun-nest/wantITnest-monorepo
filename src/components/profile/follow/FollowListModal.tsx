// 팔로워/팔로잉/서로 팔로우
import { useEffect, useState } from "react";
import { checkOthersFollowers, checkOthersFollowings } from "../../../api/following/follow";
import type { FollowUser } from "../../../types/follow/follow";
import FollowUserItem from "./FollowUserItem";
import Modal from "../../common/modal";
import SkeletonFollowUserItem from "./SkeletonFollowUserItem";

interface FollowListModalProps {
  type: "follower" | "following";
  memberId: number;
  memberName: string;
  onClose: () => void;
  onRefreshFollowerCount?: () => void;
  onRefreshFollowingCount?: () => void;
}

export default function FollowListModal({
  type,
  memberId,
  onClose,
  onRefreshFollowerCount,
  onRefreshFollowingCount,
}: FollowListModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  const title = type === "follower" ? "팔로워 목록" : "팔로잉 목록";

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const data =
          type === "follower"
            ? await checkOthersFollowers(String(memberId))
            : await checkOthersFollowings(String(memberId));
        setUsers(data.users);
      } catch (e) {
        console.error("팔로우 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [type, memberId]);

  return (
    <Modal 
      title={title} 
      onClose={onClose} 
      type="info" 
      message="아래 목록에서 사용자를 확인하고 프로필을 방문하거나 팔로우 상태를 변경할 수 있습니다.">
      {loading ? (
        <ul className="max-h-[400px] overflow-y-auto divide-y">
          {[...Array(5)].map((_, i) => (
            <li key={i}>
              <SkeletonFollowUserItem />
            </li>
          ))}
        </ul>
      ) : users.length === 0 ? (
        <div className="p-4 text-center text-gray-500">표시할 사용자가 없습니다.</div>
      ) : (
        <ul className="max-h-[400px] overflow-y-auto divide-y">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <SkeletonFollowUserItem />
                </li>
              ))
            : users.map((user) => (
                <li key={user.memberId}>
                  <FollowUserItem
                    user={user}
                    onFollowChange={() => {
                      if (type === "follower") onRefreshFollowerCount?.();
                      if (type === "following") onRefreshFollowingCount?.();
                    }}
                  />
                </li>
              ))}
        </ul>
      )}
    </Modal>
  );
}
