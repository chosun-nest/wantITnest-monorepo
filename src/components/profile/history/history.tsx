import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import { getUsersAllHistory } from "../../../api/history/history";

export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  important: boolean;
}

export default function History() {
  const [history, setHistory] = useState<HistoryProps | null>(null);

  const fetchHistory = async () => {
    try {
      setHistory(await getUsersAllHistory());
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  // 존재하지 않는 API 호출 시 로그아웃 되므로 주석 처리함
  /*
  useEffect(() => {
    fetchHistory();
  }, []);*/
  return (
    <div>
      <HistoryContainer key={history?.historyId} {...history} />
    </div>
  );
}
