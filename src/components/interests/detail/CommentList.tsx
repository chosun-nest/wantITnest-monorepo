// 댓글 배열을 parentId 기반으로 계층 구조로 재정렬하고, 각 댓글을 CommentItem으로 렌더링
import CommentItem from "./CommentItem";
import type { Comment, BoardType } from "../../../api/types/comments";

interface CommentListProps {
  comments: Comment[];
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function CommentList({ comments, boardType, postId, onRefresh }: CommentListProps) {
  // 현재 로그인한 사용자 ID를 localStorage에서 직접 확인
  const memberId = Number(localStorage.getItem("memberId"));
  const isLoggedIn = !Number.isNaN(memberId);

  const buildCommentTree = () => {
    const map = new Map<number, Comment & { replies: Comment[] }>();
    const roots: (Comment & { replies: Comment[] })[] = [];

    comments.forEach((comment) => {
      map.set(comment.commentId, { ...comment, replies: [] });
    });

    map.forEach((comment) => {
      if (!comment.parentId || comment.parentId === 0) {
        roots.push(comment);
      } else {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        } else {
          // 부모 댓글을 못 찾으면 루트로 취급 (예외 처리)
          roots.push(comment);
        }
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree();

  return (
    <div className="mt-6 space-y-4">
      {commentTree.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          boardType={boardType}
          postId={postId}
          memberId={isLoggedIn ? memberId : undefined}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}