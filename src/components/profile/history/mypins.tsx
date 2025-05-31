import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getUsersAllHistory } from "../../../api/history/history";
import { HistoryProps } from "./history";

export interface MyPinProps {
  title: string;
  editable?: boolean;
}

export default function MyPin({ title, editable }: MyPinProps) {
  const [pinnedItems, setPinnedItems] = useState<
    { text: string; pinned: boolean }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const histories: HistoryProps[] = await getUsersAllHistory();
        const pinned = histories
          .filter((h) => h.important)
          .map((h) => ({
            text: h.content,
            pinned: true,
          }));
        setPinnedItems(pinned);
      } catch (error) {
        console.error("히스토리 불러오기 실패:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6 border border-gray-300">
      <ul className="mb-4 space-y-1">
        <li className="font-semibold">{title}</li>
        {pinnedItems.length > 0 ? (
          pinnedItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 ml-4 text-gray-800"
            >
              • {item.text}
              {item.pinned && <FaStar className="text-yellow-400" />}
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-400 ml-4">
            중요 표시된 항목이 없습니다
          </li>
        )}
      </ul>
      {editable && (
        <Link to="/dummy">
          <button className="absolute bottom-4 right-4 px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-100">
            수정
          </button>
        </Link>
      )}
    </div>
  );
}
