// 관심분야 정보 게시글 삭제 시 알림 사용하는 모달창
interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md border-l-4 border-red-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">❌ {title}</h2>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded">
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
