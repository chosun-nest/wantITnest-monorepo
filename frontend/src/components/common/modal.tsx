import { useRef, useEffect } from "react";

interface ModalProps {
  title: string;
  message: string;
  type?: "error" | "info";
  onClose?: () => void;
}

export default function Modal({
  title,
  message,
  type = "info",
  onClose,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity">
      <div
        ref={modalRef}
        className={`w-[90%] max-w-md bg-white rounded-xl p-6 shadow-lg scale-100 animate-modal-in
          ${type === "error" ? "border-l-4 border-red-500" : "border-l-4 border-blue-500"}
        `}
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
          {type === "error" ? "❌" : "ℹ️"} {title}
        </h2>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded font-medium ${
              type === "error"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
