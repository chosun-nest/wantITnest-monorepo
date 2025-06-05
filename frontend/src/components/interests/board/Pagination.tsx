// 페이지네이션
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded border ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
