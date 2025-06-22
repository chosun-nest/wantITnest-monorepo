import { useNavigate } from "react-router-dom";
import type { ProjectDetail, ProjectMember } from "../../types/api/project-board";

interface Props {
  project: ProjectDetail;
  participants: ProjectMember[]; // 현재는 project.projectMembers랑 동일
  onOpenModal: () => void;
  onAccept: (user: ProjectMember) => void;
  currentUserId: number;
}

const ROLES = ["FRONTEND", "BACKEND", "DESIGN", "AI", "PM"];

export default function ParticipantCardBox({
  project,
  participants,
  onOpenModal,
  onAccept,
  currentUserId,
}: Props) {
  const navigate = useNavigate();

  const isAuthor = project.author?.id === currentUserId;
  const isClosed = project.isRecruiting === false;

  const handleApply = () => {
    navigate("/project-apply", { state: { project } });
  };

  const getMemberByRole = (role: string) =>
    participants.find((m) => m.part === role);

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
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

      <div className="flex flex-col gap-2">
        {ROLES.map((role) => {
          const member = getMemberByRole(role);

          return (
            <div
              key={role}
              className="flex items-center justify-between p-2 rounded border shadow-sm bg-white"
            >
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-green-800 bg-green-100 border border-green-300">
                {role}
              </span>

              {member && member.memberName ? (
                <button
                  onClick={() => navigate(`/profile/${member.memberId}`)}
                  className="text-sm text-blue-700 hover:underline"
                >
                  {member.memberName}
                  {member.role === "LEADER" ? " (리더)" : ""}
                </button>
              ) : (
                <span className="text-sm text-gray-600">모집중</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ 전체 참여 인원 표시 */}
      <div className="text-sm text-gray-600 text-right mt-3">
        참여 {project.currentNumberOfMembers} / {project.maximumNumberOfMembers}
      </div>
    </div>
  );
}
