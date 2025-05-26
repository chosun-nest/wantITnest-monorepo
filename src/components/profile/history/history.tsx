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

export default function History() {
  const [histories, setHistories] = useState<HistoryProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const fetchHistory = async () => {
    try {
      setHistories(await getUsersAllHistory());
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
      setHistories((prev) =>
        prev.filter((history) => history.historyId !== pendingDeleteId)
      );
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
