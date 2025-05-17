import React, { useState } from "react";
import { mockParticipants } from "../../constants/mock-project-participants";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationModal from "./ApplicationModal";

export default function ParticipantCardBox() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md w-full">
      {/* 제목 + 조건부 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[17px] font-semibold text-gray-800">참여인원 현황</h2>

        {project?.author?.name === "박유진" ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            지원서 확인
          </button>
        ) : (
          <button
            onClick={() => navigate("/project-apply", { state: { project } })}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            지원하기
          </button>
        )}
      </div>

      {isModalOpen && <ApplicationModal onClose={() => setIsModalOpen(false)} />}

      {/* 참여자 리스트 */}
      <div className="flex flex-col gap-3">
        {mockParticipants.map((user) => (
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
              팔로워 {user.followers}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}