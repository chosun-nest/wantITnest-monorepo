// 프로필 카드 - 본인 : 프로필 수정 버튼 & 타인 : 팔로잉/팔로우 버튼
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { showModal } from "../../../store/slices/modalSlice";
import { getMyFollowing, followUser, unfollowUser } from "../../../api/profile/FollowAPI"
import useFollowStatus from "../../../hooks/useFollowStatus";   // 팔로우 상태 여부 체크 컴포넌트

interface ProfileFollowButtonProps {
  isMine: boolean;
  memberId: number;
}

export default function ProfileActionButton({
  isMine,
  memberId,
}: ProfileFollowButtonProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useFollowStatus(memberId);  // 초기 팔로우 상태 API로부터 받아옴

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(
        showModal({
          title: "언팔로우 확인",
          message: "정말 이 사용자를 언팔로우 하시겠습니까?",
          type: "info",
          onClose: async () => {
            try {
              await unfollowUser(memberId);
              setIsFollowing(false);
            } catch {
              dispatch(
                showModal({
                  title: "error",
                  message: "언팔로우 처리 중 오류가 발생했습니다.",
                  type: "error",
                })
              );
            }
          },
        })
      );
    } else {
      (async () => {
        try {
          await followUser(memberId);
          setIsFollowing(true);
        } catch {
          dispatch(
            showModal({
              title: "오류",
              message: "팔로우 처리 중 오류가 발생했습니다.",
              type: "error",
            })
          );
        }
      })();
    }
  };

  useEffect(() => {
  const checkFollowingStatus = async () => {
    try {
      const res = await getMyFollowing();
      const isUserFollowed = res.users.some((user) => user.memberId === memberId);
      setIsFollowing(isUserFollowed);
    } catch (e) {
      console.error("팔로잉 상태 확인 실패", e);
    }
  };

  checkFollowingStatus();
}, [memberId]);

  return (
    <div className="flex justify-center gap-2 mt-10">
      {isMine ? (
        <button
          onClick={() => navigate("/profile-edit")}
          className="px-20 py-2 text-white bg-blue-900 rounded-md whitespace-nowrap"
        >
          프로필 수정
        </button>
      ) : (
        <button
          onClick={handleFollowToggle}
          className={`px-20 py-2 rounded-md whitespace-nowrap font-bold transition border
            ${
              isFollowing
                ? "bg-white text-blue-900 border-blue-900 hover:bg-gray-100"
                : "bg-blue-900 text-white border-transparent hover:bg-[#5f7fce]"
            }`}
        >
          {isFollowing ? "팔로잉" : "팔로우"}
        </button>
      )}
    </div>
  );
}