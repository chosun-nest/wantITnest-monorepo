// 댓글 입력 폼 (수정/작성 공통)
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  isLoggedIn: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "댓글을 입력하세요",
  isLoggedIn,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent(""); // 작성 후 초기화 (단, 수정 모드에서는 필요에 따라 제거 가능)
  };

  if (!isLoggedIn) {
    return (
      <div className="p-3 text-gray-500 bg-gray-100 border rounded">
        댓글을 작성하려면 로그인 해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring focus:border-blue-500"
        rows={3}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button className="px-4 py-1 border rounded" onClick={onCancel}>
            취소
          </button>
        )}
        <button
          className="px-4 py-1 text-white rounded bg-[#1E3A8A]"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>
    </div>
  );
}
