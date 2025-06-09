import CommentItem from "./CommentItem";
import type { CommentWithReplies, BoardType } from "../../../types/api/comments";

interface CommentListProps {
  comments: CommentWithReplies[];
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function CommentList({ comments, boardType, postId, onRefresh }: CommentListProps) {
  const buildCommentTree = () => {
    const map = new Map<number, CommentWithReplies>();
    const roots: CommentWithReplies[] = [];

    comments.forEach((comment) => {
      const commentWithReplies: CommentWithReplies = {
        ...comment,
        replies: comment.replies ?? [],
      };
      map.set(comment.commentId, commentWithReplies);
    });

    map.forEach((comment) => {
      if (!comment.parentId || comment.parentId === 0) {
        roots.push(comment);
      } else {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        } else {
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
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
