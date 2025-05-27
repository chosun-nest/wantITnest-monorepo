import { useState } from "react";
import History, { HistoryProps } from "./history";
import EditHistoryModal from "./edithistory"; // 모달 컴포넌트
import { postAHistory, updateHistory } from "../../../api/history/history";

export default function HistoryTimeline() {
  const years = [2020, 2021, 2022, 2023, 2024];
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<HistoryProps> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // 강제 리렌더용 키

  const handleSuccess = () => {
    setIsAdding(false);
    setRefreshKey((prev) => prev + 1); // History 리렌더링 트리거
  };

  const handleEdit = (history: HistoryProps) => {
    setEditData(history);
    setIsEditing(true);
  };

  const handleUpdate = async (data: Partial<HistoryProps>) => {
    if (!data.historyId) {
      console.error("historyId is required to update history");
      return;
    }
    updateHistory(data.historyId, {
      content: data.content || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      important: data.important || false,
    });
    setIsEditing(false);
    setEditData(null);
    setRefreshKey((prev) => prev + 1);
    console.log("Updating history with id:", data.historyId, "and data:", data);
  };

  return (
    <div className="w-full py-4 px-2">
      <h2 className="text-xl font-bold mb-4">History</h2>
      {/* 타임라인 */}
      <div className="relative w-full h-12 mb-12">
        <div className="absolute top-1/2 w-full border-t-4 border-blue-800"></div>
        <div className="flex justify-between items-center px-4">
          {years.map((year) => (
            <div key={year} className="flex flex-col items-center relative">
              <div className="w-1 h-6 bg-[#002f6c]"></div>
              <span className="text-sm mt-1 text-blue-900">{year}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 히스토리 목록 */}
      <History key={refreshKey} onEdit={handleEdit} />
      {/* 새 히스토리 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#002f6c] text-white px-4 py-2 rounded text-sm hover:bg-blue-900"
        >
          새 히스토리
        </button>
      </div>
      {/* 히스토리 작성 모달 */}
      <EditHistoryModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onSuccess={handleSuccess}
        onSubmit={postAHistory}
      />{" "}
      {/* 수정 모달 */}
      <EditHistoryModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        onSuccess={handleSuccess}
        onSubmit={handleUpdate}
        initialData={editData || {}}
      />
    </div>
  );
}
