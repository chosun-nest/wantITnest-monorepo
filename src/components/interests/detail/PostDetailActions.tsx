// 좋아요 / 싫어요 / 공유 버튼
import { useState } from "react";
import Modal from "../../common/modal"; // 실제 경로에 맞게 조정
import type { ModalContent } from "../../../types/modal"; // 타입도 import

interface PostDetailActionsProps {
  likeCount: number;
  dislikeCount: number;
  onLike: () => void;
  onDislike: () => void;
}

export default function PostDetailActions({
  likeCount,
  dislikeCount,
  onLike,
  onDislike,
}: PostDetailActionsProps) {
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setModalContent({
          title: "링크 복사 완료",
          message: "현재 페이지 링크가 클립보드에 복사되었습니다.",
          type: "info",
          onClose: () => setShowModal(false),
        });
        setShowModal(true);
      })
      .catch(() => {
        setModalContent({
          title: "복사 실패",
          message: "링크 복사 중 오류가 발생했습니다.",
          type: "error",
          onClose: () => setShowModal(false),
        });
        setShowModal(true);
      });
  };

  return (
    <>
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={modalContent.onClose}
        />
      )}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onLike}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
        >
          좋아요 {likeCount}
        </button>
        <button
          onClick={onDislike}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
        >
          싫어요 {dislikeCount}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
        >
          🔗 공유
        </button>
      </div>
    </>
  );
}
