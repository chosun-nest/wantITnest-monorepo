// 프로필 카드 - 본인 : 프로필 수정 버튼 & 타인 : 팔로잉/팔로우 버튼
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
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
  const { isFollowing, follow, unfollow } = useFollowStatus(memberId);  // 초기 팔로우 상태 API로부터 받아옴

  const handleFollowToggle = async () => {
    if (isFollowing) {
      dispatch(showModal({
        title: "언팔로우 확인",
        message: "정말 이 사용자를 언팔로우 하시겠습니까?",
        type: "info",
        onClose: async () => {
          try {
            await unfollow();
          } catch {
            dispatch(showModal({
              title: "오류",
              message: "언팔로우 실패. 다시 시도해주세요.",
              type: "error",
            }));
          }
        },
      }));
    } else {
      try {
        await follow();
      } catch {
        dispatch(showModal({
          title: "오류",
          message: "팔로우 실패. 다시 시도해주세요.",
          type: "error",
        }));
      }
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