import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import {
  getUsersAllHistory,
  deleteHistory,
} from "../../../api/history/history";
import CheckModal from "../../common/checkmodal";
export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  important: boolean;
}

interface HistoryPropsFromParent {
  onEdit: (history: HistoryProps) => void;
  onGroupedHistoryChange?: (grouped: Record<number, HistoryProps[]>) => void;
}

export default function History({
  onEdit,
  onGroupedHistoryChange,
}: HistoryPropsFromParent) {
  const [histories, setHistories] = useState<HistoryProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

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

  const fetchHistory = async () => {
    try {
      const data = await getUsersAllHistory();

      const sorted = data.sort(
        (a: HistoryProps, b: HistoryProps) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setHistories(sorted);

      const grouped = groupByYear(sorted);
      onGroupedHistoryChange?.(grouped); // 부모에게 전달
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleDelete = (historyId: number) => {
    setPendingDeleteId(historyId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId !== null) {
      await deleteHistory(pendingDeleteId);
      const updated = histories.filter(
        (history) => history.historyId !== pendingDeleteId
      );
      setHistories(updated);

      const grouped = groupByYear(updated);
      onGroupedHistoryChange?.(grouped);

      setPendingDeleteId(null);
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <div className="space-y-4">
        {histories.map((history) => (
          <HistoryContainer
            key={history.historyId}
            {...history}
            onDelete={handleDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {showModal && (
        <CheckModal
          title="히스토리 삭제"
          message="정말로 이 히스토리를 삭제하겠습니까?"
          type="info"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
