import { HistoryProps } from "./history";
import { FaStar, FaRegStar } from "react-icons/fa";
import { updateHistory } from "../../../api/history/history";
import { useState } from "react";

interface HistoryContainerProps extends HistoryProps {
  onDelete: (historyId: number) => void;
  onEdit: (history: HistoryProps) => void;
}

export default function HistoryContainer({
  historyId,
  memberId,
  content,
  startDate,
  endDate,
  important: initialImportant,
  onDelete,
  onEdit,
}: HistoryContainerProps) {
  const [important, setImportant] = useState(initialImportant);

  const toggleImportant = async () => {
    try {
      await updateHistory(historyId, {
        content,
        startDate,
        endDate,
        important: !important,
      });
      setImportant((prev) => !prev);
    } catch (e) {
      console.error("중요 여부 업데이트 실패:", e);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="font-semibold text-black">
        {startDate} ~ {endDate}
      </h2>

      <div className="flex flex-row items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <p className="text-gray-800 text-sm whitespace-pre-line">
              {content}
            </p>
            <button onClick={toggleImportant}>
              {important ? (
                <FaStar className="text-yellow-400 cursor-pointer" />
              ) : (
                <FaRegStar className="text-black cursor-pointer border" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-2 shrink-0">
          <button
            onClick={() =>
              onEdit({
                historyId,
                content,
                startDate,
                endDate,
                important,
                memberId,
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
        </div>
      </div>
    </div>
  );
}
