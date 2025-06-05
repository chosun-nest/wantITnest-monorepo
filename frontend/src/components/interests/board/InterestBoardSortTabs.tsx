// 최신순, 좋아요순 드롭다운 컴포넌트
interface Props {
  sortType: "latest" | "likes";
  onChange: (value: Props["sortType"]) => void;
}

export default function InterestBoardSortTabs({ sortType, onChange }: Props) {
  const tabs: { label: string; value: Props["sortType"] }[] = [
    { label: "최신순", value: "latest" },
    { label: "좋아요순", value: "likes" },
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-3 mb-2 text-sm text-gray-500">
        {tabs.map((tab) => (
          <div key={tab.value} className="flex items-center gap-1.5">
            <span className="text-xs">
              <span
                className={`inline-block align-middle w-2 h-2 rounded-full ${
                  sortType === tab.value ? "bg-blue-300" : "bg-transparent"
                }`}
              ></span>
            </span>
            <button
              onClick={() => onChange(tab.value)}
              className={`font-semibold transition-colors duration-150 ${
                sortType === tab.value
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          </div>
        ))}
      </div>
      <hr className="border-t border-gray-200" />
    </div>
  );
}


