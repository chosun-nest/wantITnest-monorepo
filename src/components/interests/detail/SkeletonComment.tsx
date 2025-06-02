// 댓글 로딩 시 스켈레톤 UI
export default function SkeletonComment() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="p-3 border rounded animate-pulse">
          <div className="w-1/3 h-4 mb-2 bg-gray-300 rounded" />
          <div className="w-full h-3 mb-1 bg-gray-200 rounded" />
          <div className="w-5/6 h-3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
