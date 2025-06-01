// 작성자 정보, 날짜, 팔로우 버튼

interface PostDetailInfoProps {
  author: {
    id: number;
    name: string;
  };
  isAuthor: boolean;
  viewCount: number;
  date: string;
}

export default function PostDetailInfo({
  author,
  isAuthor,
  viewCount,
  date,
}: PostDetailInfoProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img
        src="/assets/images/manager-bird.png"
        alt="작성자"
        className="rounded-full w-9 h-9"
      />
      <span className="text-sm font-semibold text-[#002F6C]">{author.name}</span>
      {!isAuthor && (
        <button className="ml-auto px-3 py-1 text-sm border border-[#002F6C] text-[#002F6C] rounded hover:bg-gray-50">
          + 팔로우
        </button>
      )}
      <div className="ml-auto text-sm text-gray-500">
        <span>{date.slice(0, 10)}</span>
        <span className="mx-2">·</span>
        <span>조회 {viewCount}</span>
      </div>
    </div>
  );
}
