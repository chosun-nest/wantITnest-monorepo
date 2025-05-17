import React from "react";
import { mockParticipants } from "../../constants/mock-project-participants";

export default function ParticipantCardBox() {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md w-full md:w-64">
      <h3 className="text-base font-semibold mb-4">
        참여인원 현황 <span className="text-sm">{mockParticipants.length}/6</span>
      </h3>

      <div className="flex flex-col gap-3">
        {mockParticipants.map((user) => (
          <div
            key={user.id}
            className="relative flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
          >
            {/* 왼쪽: 이미지 + 이름/역할 */}
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

            {/* 오른쪽 상단: 팔로워 */}
            <p className="absolute top-3 right-3 text-xs text-gray-500">
              팔로워 {user.followers}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}