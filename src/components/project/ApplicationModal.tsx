import React, { useState } from "react";
import { mockApplications } from "../../constants/mock-project-applications";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

interface Application {
  id: number;
  name: string;
  major: string;
  message: string;
  role: string;
  status: "pending" | "accepted" | "rejected";
}

export default function ApplicationModal({ onClose }: Props) {
  const [applications, setApplications] = useState<Application[]>(
    mockApplications.map((app) => ({ ...app, status: "pending" }))
  );

  // ✅ 수락: 상태 변경
  const handleAccept = (id: number) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "accepted" } : app
      )
    );
  };

  // ✅ 거절: 목록에서 제거
  const handleReject = (id: number) => {
    setApplications((prev) =>
      prev.filter((app) => app.id !== id)
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-lg w-[90%] max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">지원서 확인</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-md p-3 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-blue-600">#{app.role}</span>
                <span className="text-sm">👤 {app.name}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                {app.message}
              </p>
              {app.status === "pending" ? (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleAccept(app.id)}
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    거절
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold mt-2 text-green-600 text-right">
                  ✅ 수락됨
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}