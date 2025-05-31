import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import EditHistoryModal from "./edithistory";
import {
  postAHistory,
  updateHistory,
  deleteHistory,
  getUsersAllHistory,
} from "../../../api/history/history";

export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string;
  endDate: string;
  important: boolean;
}

export default function HistoryTimeline() {
  const [groupedData, setGroupedData] = useState<
    Record<number, HistoryProps[]>
  >({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<HistoryProps> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // group by year
  const groupByYear = (
    histories: HistoryProps[]
  ): Record<number, HistoryProps[]> => {
    return histories.reduce(
      (acc, history) => {
        const year = new Date(history.startDate).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(history);
        return acc;
      },
      {} as Record<number, HistoryProps[]>
    );
  };

  // fetch and group
  const fetchAndGroupHistories = async () => {
    try {
      const data = await getUsersAllHistory();
      const sorted = data.sort(
        (
          a: { startDate: string | number | Date },
          b: { startDate: string | number | Date }
        ) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      const grouped = groupByYear(sorted);
      setGroupedData(grouped);

      // 최신 연도로 자동 선택
      const latestYear =
        Object.keys(grouped)
          .map(Number)
          .sort((a, b) => b - a)[0] || null;
      setSelectedYear(latestYear);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  useEffect(() => {
    fetchAndGroupHistories();
  }, [refreshKey]);

  const handleSuccess = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditData(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (history: HistoryProps) => {
    setEditData(history);
    setIsEditing(true);
  };

  const handleUpdate = async (data: Partial<HistoryProps>) => {
    if (!data.historyId) return;
    await updateHistory(data.historyId, {
      content: data.content || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      important: data.important || false,
    });
    handleSuccess();
  };

  const handleDelete = async (id: number) => {
    await deleteHistory(id);
    setRefreshKey((prev) => prev + 1);
  };

  const years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full py-4 px-2">
      {/* 타임라인 바 */}
      <div className="relative w-full h-12 mb-12">
        <div className="absolute top-1/2 w-full border-t-4 border-blue-800"></div>

        <div className="flex items-center px-4 gap-6">
          {/* 좌측 고정: 전체 버튼 */}
          <div
            onClick={() => setSelectedYear(null)}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              selectedYear === null
                ? "scale-110"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            <div className="w-1 h-6 bg-yellow-500" />
            <span
              className={`text-sm mt-1 ${
                selectedYear === null
                  ? "text-yellow-700 font-semibold"
                  : "text-blue-900"
              }`}
            >
              전체
            </span>
          </div>

          {/* 타임라인 연도 정렬 */}
          {selectedYear === null ? (
            // 전체 보기: 균등 정렬
            <div className="flex-1 flex justify-between items-center transition-all duration-500">
              {years.map((year) => (
                <div
                  key={year}
                  className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedYear(year)}
                >
                  <div className="w-1 h-6 bg-[#002f6c]" />
                  <span className="text-sm mt-1 text-blue-900">{year}</span>
                </div>
              ))}
            </div>
          ) : (
            // 선택된 연도 기준으로 좌우 분리 (순서는 항상 오름차순)
            <div className="flex-1 flex items-center justify-center gap-12 transition-all duration-500 ease-in-out">
              {/* 이전 연도들 (작은 값부터 선택 연도 전까지) */}
              <div className="flex gap-4">
                {years
                  .filter((year) => year < selectedYear)
                  .map((year) => (
                    <div
                      key={year}
                      className="flex flex-col items-center cursor-pointer transition-transform duration-500 hover:scale-105"
                      onClick={() => setSelectedYear(year)}
                    >
                      <div className="w-1 h-6 bg-[#002f6c]" />
                      <span className="text-sm mt-1 text-blue-900">{year}</span>
                    </div>
                  ))}
              </div>

              {/* 선택된 연도 */}
              <div
                className="flex flex-col items-center cursor-pointer mx-6 transition-transform duration-500 scale-125"
                onClick={() => setSelectedYear(null)}
              >
                <div className="w-1 h-6 bg-yellow-500" />
                <span className="text-sm mt-1 text-yellow-700 font-bold">
                  {selectedYear}
                </span>
              </div>

              {/* 이후 연도들 (선택 연도 이후부터 끝까지) */}
              <div className="flex gap-4">
                {years
                  .filter((year) => year > selectedYear)
                  .map((year) => (
                    <div
                      key={year}
                      className="flex flex-col items-center cursor-pointer transition-transform duration-500 hover:scale-105"
                      onClick={() => setSelectedYear(year)}
                    >
                      <div className="w-1 h-6 bg-[#002f6c]" />
                      <span className="text-sm mt-1 text-blue-900">{year}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 히스토리 목록 */}
      <div className="space-y-4">
        {(selectedYear === null
          ? years.flatMap((y) => groupedData[y] || [])
          : groupedData[selectedYear] || []
        ).map((history) => (
          <HistoryContainer
            key={history.historyId}
            {...history}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 새 히스토리 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#002f6c] text-white px-4 py-2 rounded text-sm hover:bg-blue-900"
        >
          새 히스토리
        </button>
      </div>

      {/* 작성 모달 */}
      <EditHistoryModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onSuccess={handleSuccess}
        onSubmit={postAHistory}
      />

      {/* 수정 모달 */}
      <EditHistoryModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditData(null);
        }}
        onSuccess={handleSuccess}
        onSubmit={handleUpdate}
        initialData={editData || {}}
      />
    </div>
  );
}
