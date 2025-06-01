import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // ★ 추가: 비어있는 별
import {
  getUsersAllHistory,
  updateHistory,
} from "../../../api/history/history";
import { HistoryProps } from "./history";

export interface MyPinProps {
  title: string;
  editable?: boolean;
}

export default function MyPin({ title, editable = false }: MyPinProps) {
  const [pinnedItems, setPinnedItems] = useState<HistoryProps[]>([]);

  const fetchPinnedHistories = async () => {
    try {
      const histories: HistoryProps[] = await getUsersAllHistory();
      const pinned = histories.filter((h) => h.important);
      setPinnedItems(pinned);
    } catch (error) {
      console.error("히스토리 불러오기 실패:", error);
    }
  };

  const toggleImportant = async (item: HistoryProps) => {
    try {
      await updateHistory(item.historyId, {
        content: item.content,
        startDate: item.startDate,
        endDate: item.endDate,
        important: !item.important,
      });
      fetchPinnedHistories();
    } catch (error) {
      console.error("중요 여부 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    fetchPinnedHistories();
  }, []);

  return (
    <ul className="mb-4 space-y-1">
      <li className="font-semibold">{title}</li>
      {pinnedItems.length > 0 ? (
        pinnedItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 ml-4 text-gray-800">
            •{" "}
            <strong>
              {item.startDate}~{item.endDate}
            </strong>{" "}
            {item.content}
            {editable && (
              <button onClick={() => toggleImportant(item)}>
                {item.important ? (
                  <FaStar className="text-yellow-400 cursor-pointer" />
                ) : (
                  <FaRegStar className="text-black border border-black cursor-pointer" />
                )}
              </button>
            )}
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-400 ml-4">
          중요 표시된 항목이 없습니다
        </li>
      )}
    </ul>
  );
}
