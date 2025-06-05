// 제목 및 게시글 개수
interface Props {
  postCount: number;
}

export default function InterestBoardHeader({ postCount }: Props) {
  return (
    <div className="max-w-5xl mx-auto mt-[40px] px-4 mb-6">
      <h2 className="text-2xl font-bold text-[#00256c]">관심분야 정보 게시판</h2>
      
      <p className="mt-5 text-sm text-gray-700">
        총 <strong>{postCount}</strong>개의 게시물이 있습니다.
      </p>
      <hr className="mt-5 mb-5"/>
    </div>
  );
}