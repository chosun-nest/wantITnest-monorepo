// 관심분야 정보 게시판 댓글 부분
import type { Comment } from "../../../api/types/comments";

interface CommentSectionProps {
  comments: Comment[];
  isLoggedIn: boolean;
}

export default function CommentSection({ comments, isLoggedIn }: CommentSectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        댓글 {comments.length}
      </h2>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.commentId} className="p-3 border rounded">
              <div className="text-sm font-semibold text-gray-700">{c.authorName}</div>
              <div className="text-sm text-gray-800">{c.content}</div>
              <div className="text-xs text-gray-400">{c.createdAt.slice(0, 10)}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">등록된 댓글이 없습니다.</p>
        )}
      </div>

      {isLoggedIn ? (
        <div className="mt-4">댓글 입력 컴포넌트</div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">댓글을 작성하려면 로그인하세요.</p>
      )}
    </section>
  );
}
