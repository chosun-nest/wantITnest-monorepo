// 프로필 카드 - 본인 : 프로필 수정 버튼 & 타인 : 팔로잉/팔로우 버튼
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { showModal } from "../../../store/slices/modalSlice";

// TODO: 실제 API로 교체하기
const follow = async (userId: number) => {
  console.log("follow", userId);
  // await API.post(`/api/v1/follow/${userId}`);
};
const unfollow = async (userId: number) => {
  console.log("unfollow", userId);
  // await API.delete(`/api/v1/follow/${userId}`);
};

interface ProfileFollowButtonProps {
  isMine: boolean;
  targetUserId: number;
}

export default function ProfileActionButton({
  isMine,
  targetUserId,
}: ProfileFollowButtonProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false); // 추후 API 연동 필요

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(
        showModal({
          title: "언팔로우 확인",
          message: "정말 이 사용자를 언팔로우 하시겠습니까?",
          type: "info",
          onClose: async () => {
            try {
              await unfollow(targetUserId);
              setIsFollowing(false);
            } catch {
              dispatch(
                showModal({
                  title: "오류",
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
          await follow(targetUserId);
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