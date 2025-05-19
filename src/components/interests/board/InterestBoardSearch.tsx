// 게시글 검색
interface InterestBoardSearchProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
}

export default function InterestBoardSearch({
  searchKeyword,
  setSearchKeyword,
}: InterestBoardSearchProps) {
  return (
    <div className="flex w-full gap-2 mb-4">
      <input
        type="text"
        placeholder="게시글 제목을 검색해보세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="flex-grow p-3 border rounded"
      />
      <button className="px-10 py-2 text-white bg-[#002F6C] rounded">
        검색
      </button>
    </div>
  );
}
