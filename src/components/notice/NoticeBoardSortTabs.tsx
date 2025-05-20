interface Props {
  selectedCategory: string;
  onChange: (value: string) => void;
}

export default function NoticeBoardSortTabs({ selectedCategory, onChange }: Props) {
  const categories = [
    "전체",
    "학사공지",
    "장학공지",
    "IT융합대학 공지",
    "컴퓨터공학과 공지",
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-colors duration-150 ${
              selectedCategory === category
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
