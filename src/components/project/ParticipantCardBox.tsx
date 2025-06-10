import { Participant } from "../../types/participant";
import { useNavigate } from "react-router-dom";
import type { ProjectDetail } from "../../types/api/project-board";

interface Props {
  project: ProjectDetail;
  participants: Participant[];
  onOpenModal: () => void;
  onAccept: (user: Participant) => void;
  currentUserId: number;
}

export default function ParticipantCardBox({
  project,
  participants,
  onOpenModal,
  onAccept,
  currentUserId,
}: Props) {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/project-apply", { state: { project } });
  };

  const isAuthor = project.author?.id === currentUserId;
  const isClosed = project.status === "모집완료";

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[17px] font-semibold text-gray-800">참여인원 현황</h2>

        {isAuthor ? (
          <button
            onClick={onOpenModal}
            disabled={isClosed}
            className={`px-3 py-1.5 text-sm rounded ${
              isClosed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            지원서 확인
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={isClosed}
            className={`px-3 py-1.5 text-sm rounded ${
              isClosed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            지원하기
          </button>
        )}
      </div>

      {/* 모바일: 2열, md 이상: 1열 */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {participants.map((user) => (
          <div
            key={user.id}
            className="relative flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2">
                <img
                  src={user.imageUrl || "/assets/images/default-profile.png"}
                  alt="프로필"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              </div>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <p className="absolute top-3 right-3 text-xs text-gray-500">
              팔로워 {user.followers ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}