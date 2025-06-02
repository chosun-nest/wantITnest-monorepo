interface PostDetailInfoProps {
  author: {
    id: number;
    name: string;
  };
  isAuthor: boolean;
  date: string;
  viewCount: number;
}

export default function PostDetailInfo({
  author,
  date,
  viewCount,
}: PostDetailInfoProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-600">
      {/* 프로필 이미지 */}
      <div className="flex items-center gap-2">
        <img
          src="/assets/images/manager-bird.png"
          alt="프로필"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold text-[16px] text-gray-900">
          {author.name}
        </span>
      </div>
      
      {/* 텍스트 영역 */}
      <div className="mt-1 text-[15px] text-gray-600 flex gap-2">
        <span> {date.slice(0, 10).replace(/-/g, '.')}</span>
        <span>· 조회수 {viewCount}</span>
      </div>
  
      {/* 팔로우 버튼 – 본인이 아닌 경우 > 조건부 렌더링 */}
        {/* {!author && (
          <button className="px-2 py-1 text-sm text-blue-600 border border-blue-400 rounded hover:bg-blue-50">
            + 팔로우
          </button>
        )} */}
    </div>
  );
}
