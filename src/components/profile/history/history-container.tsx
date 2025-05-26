import { useState } from "react";
import { HistoryProps } from "./history";
import { FaStar } from "react-icons/fa";

interface HistoryContainerProps extends HistoryProps {
  onDelete: (historyId: number) => void;
  onEdit: (history: HistoryProps) => void;
}

export default function HistoryContainer({
  historyId,
  content,
  startDate,
  endDate,
  important,
  onDelete,
  onEdit,
}: HistoryContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [payload, setPayload] = useState(content);

  const handleSaveClick = () => {
    setIsEditing(false);
    // TODO: 저장 API 연동
  };
  const handleCancelClick = () => {
    setPayload(content);
    setIsEditing(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPayload(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="font-semibold text-black">
        {startDate} ~ {endDate}
      </h2>
      <div className="flex flex-row items-start gap-4">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={payload}
              onChange={handleChange}
              className="w-full h-28 p-2 border border-blue-300 rounded resize-none focus:outline-none"
              placeholder="활동 내역을 입력하세요"
            />
          ) : (
            <div className="flex flex-row items-center justify-start gap-2">
              <p className="text-gray-800 text-sm whitespace-pre-line">
                {payload}
              </p>
              {important && <FaStar className="text-yellow-400" />}
            </div>
          )}
        </div>

        <div className="flex flex-row gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={handleCancelClick}
                className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  onEdit({
                    historyId,
                    content,
                    startDate,
                    endDate,
                    important,
                  })
                }
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(historyId)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
