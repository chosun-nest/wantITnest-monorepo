// 제목, 설정 버튼 (수정, 삭제, 신고)
import { DotsThreeVertical } from "phosphor-react";
import { useState } from "react";

interface PostDetailHeaderProps {
  title: string;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostDetailHeader({
  title,
  isAuthor,
  onEdit,
  onDelete,
}: PostDetailHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-start justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="relative">
        <button
          className="p-2 text-gray-600 rounded hover:bg-gray-100"
          onClick={() => setShowMenu(!showMenu)}
        >
          <DotsThreeVertical size={20} weight="bold" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 z-10 mt-2 bg-white border rounded shadow-md">
            {isAuthor ? (   // 작성자이면 수정, 삭제
              <>
                <button
                  onClick={onEdit}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  게시글 수정
                </button>
                <button
                  onClick={onDelete}
                  className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  게시글 삭제
                </button>
              </>
            ) : (         // 작성자가 아니면 신고하기 버튼이 뜸
              <button
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
              >
                신고하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
