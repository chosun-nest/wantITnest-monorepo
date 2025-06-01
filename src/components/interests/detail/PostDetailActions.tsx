// 좋아요 / 싫어요 / 공유 버튼

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
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onLike}
        className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
      >
        좋아요 {likeCount}
      </button>
      <button
        onClick={onDislike}
        className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
      >
        싫어요 {dislikeCount}
      </button>
      <button className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
        🔗 공유
      </button>
    </div>
  );
}
