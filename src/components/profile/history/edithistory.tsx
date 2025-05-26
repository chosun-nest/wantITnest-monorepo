import { useEffect, useRef, useState } from "react";
import { HistoryProps } from "../history/history";

interface EditHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit: (data: {
    content: string;
    startDate: string;
    endDate: string;
    important: boolean;
  }) => Promise<void>;
  initialData?: Partial<HistoryProps>; // 수정용 초기 데이터
}

export default function EditHistoryModal({
  open,
  onClose,
  onSuccess,
  onSubmit,
  initialData,
}: EditHistoryModalProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [important, setImportant] = useState(initialData?.important || false);
  const [loading, setLoading] = useState(false);
  const [warning, setWaring] = useState("");

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 초기값이 바뀔 때마다 반영
    setContent(initialData?.content || "");
    setImportant(initialData?.important || false);
    if (startDateRef.current)
      startDateRef.current.value = initialData?.startDate || "";
    if (endDateRef.current)
      endDateRef.current.value = initialData?.endDate || "";
  }, [initialData]);

  const handleSubmit = async () => {
    const startDate = startDateRef.current?.value || "";
    const endDate = endDateRef.current?.value || "";

    // 날짜 유효성 검사
    if (!startDate || !endDate) {
      setWaring("시작 일자와 종료 일자를 모두 입력해주세요.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setWaring("시작 일자는 종료 일자보다 이전이어야 합니다.");
      return;
    }
    if (content == null) {
      setWaring("히스토리 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ content, startDate, endDate, important });

      onSuccess?.();
      setContent("");
      setImportant(false);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2
          className="text-lg font-semibold mb-4 text-center"
          style={{ color: "#002f6c" }}
        >
          히스토리 {initialData ? "수정" : "작성"}
        </h2>

        <label className="mb-1 text-sm" style={{ color: "#002f6c" }}>
          시작 일자
        </label>
        <input
          type="date"
          required
          ref={startDateRef}
          className="w-full p-2 border border-blue-300 rounded mb-2"
        />

        <label className="mb-1 text-sm" style={{ color: "#002f6c" }}>
          종료 일자
        </label>
        <input
          type="date"
          required
          ref={endDateRef}
          className="w-full p-2 border border-blue-300 rounded mb-2"
        />

        <textarea
          className="w-full h-20 p-2 border border-blue-300 rounded resize-none mb-2"
          placeholder="히스토리를 입력하세요"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
            className="mr-2"
          />
          중요 표시
        </label>
        <div className="text-sm text-red-500">{warning}</div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          <>{loading ? "저장 중..." : "저장"}</>
        </button>
      </div>
    </div>
  );
}
