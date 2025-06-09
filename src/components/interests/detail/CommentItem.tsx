// 댓글 / 대댓글 재귀 랜더링
import { useState, useRef, useEffect } from "react";
import CommentForm from "./CommentForm";
import type { Comment, BoardType } from "../../../types/api/comments";
import {
  deleteComment,
  updateComment,
  createReplyComment,
} from "../../../api/board-common/CommentAPI";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
import { selectCurrentUserId } from "../../../store/slices/userSlice";
import { DotsThreeVertical } from "phosphor-react";

interface CommentItemProps {
  comment: Comment & { replies: Comment[] };
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function CommentItem({
  comment,
  boardType,
  postId,
  onRefresh,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const isMine = comment.author?.id === currentUserId;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteComment(boardType, postId, comment.commentId);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "삭제 실패",
          message: "댓글을 삭제하는 중 문제가 발생했습니다.",
          type: "error",
        })
      );
    }
  };

  const handleUpdate = async (content: string) => {
    try {
      await updateComment(boardType, postId, comment.commentId, { content });
      setIsEditing(false);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "수정 실패",
          message: "댓글 수정 중 문제가 발생했습니다.",
          type: "error",
        })
      );
    }
  };

  const handleReply = async (content: string) => {
    try {
      await createReplyComment(boardType, postId, comment.commentId, { content });
      setIsReplying(false);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "대댓글 실패",
          message: "답글 작성 중 문제가 발생했습니다.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 border-b">
      <img
        src="/default-profile.png"
        alt="profile"
        className="object-cover w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-semibold text-black">{comment.author.name}</span>
          <span className="mx-1">·</span>
          <span>{comment.createdAt.slice(0, 16).replace("T", " ")}</span>

          <div className="relative ml-auto" ref={menuRef}>
            <button
              className="p-2 text-gray-500 rounded hover:bg-gray-100"
              onClick={() => setShowMenu(!showMenu)}
            >
              <DotsThreeVertical size={20} weight="bold" />
            </button>

            {showMenu && (
              <div className="absolute right-0 z-20 mt-2 bg-white border border-gray-200 rounded shadow-md w-36">
                {isMine ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      댓글 수정
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                      댓글 삭제
                    </button>
                  </>
                ) : (
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

        <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
          {isEditing ? (
            <CommentForm
              initialValue={comment.content}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isLoggedIn={true}
            />
          ) : comment.isDeleted ? (
            <i className="text-gray-400">삭제된 댓글입니다.</i>
          ) : (
            comment.content
          )}
        </div>

        {!comment.isDeleted && (
          <div className="mt-2 text-sm text-gray-500">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:underline"
            >
              {isReplying ? "취소" : "답글"}
            </button>
          </div>
        )}

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              isLoggedIn={true}
              placeholder="답글을 입력하세요"
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="mt-4 ml-4 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.commentId}
                comment={reply as Comment & { replies: Comment[] }}
                boardType={boardType}
                postId={postId}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
