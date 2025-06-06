// 댓글 / 대댓글 재귀 랜더링
import { useState, useRef, useEffect } from "react";
import CommentForm from "./CommentForm";
import type { Comment, BoardType } from "../../../api/types/comments";
import {
  deleteComment,
  updateComment,
  createReplyComment,
} from "../../../api/board-common/CommentAPI";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
import { MoreVertical } from "lucide-react";

interface CommentItemProps {
  comment: Comment & { replies: Comment[] };
  boardType: BoardType;
  postId: number;
  memberId?: number;
  onRefresh: () => void;
}

export default function CommentItem({ comment, boardType, postId, memberId, onRefresh }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem("username");
  const isMine = username && comment.authorName === username;

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
      dispatch(showModal({
        title: "삭제 실패",
        message: "댓글을 삭제하는 중 문제가 발생했습니다.",
        type: "error",
      }));
    }
  };

  const handleUpdate = async (content: string) => {
    try {
      await updateComment(boardType, postId, comment.commentId, { content });
      setIsEditing(false);
      onRefresh();
    } catch {
      dispatch(showModal({
        title: "수정 실패",
        message: "댓글 수정 중 문제가 발생했습니다.",
        type: "error",
      }));
    }
  };

  const handleReply = async (content: string) => {
    try {
      await createReplyComment(boardType, postId, comment.commentId, { content });
      setIsReplying(false);
      onRefresh();
    } catch {
      dispatch(showModal({
        title: "대댓글 실패",
        message: "답글 작성 중 문제가 발생했습니다.",
        type: "error",
      }));
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 border-b">
      {/* 프로필 이미지 */}
      <img
        src="/default-profile.png"
        alt="profile"
        className="object-cover w-10 h-10 rounded-full"
      />

      {/* 본문 */}
      <div className="flex-1">
        {/* 상단 정보 */}
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-semibold text-black">{comment.authorName}</span>
          <span className="mx-1">·</span>
          <span>{comment.createdAt.slice(0, 16).replace("T", " ")}</span>
          <span className="mx-1">·</span>
          <button className="hover:underline">신고</button>

          {isMine && (
            <div className="relative ml-auto" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className="p-1">
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 z-10 mt-2 text-sm bg-white border rounded shadow-sm w-28">
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 본문 or 수정 */}
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

        {/* 하단 버튼 */}
        {!comment.isDeleted && (
          <div className="mt-2 text-sm text-gray-500">
            <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">
              {isReplying ? "취소" : "답글"}
            </button>
          </div>
        )}

        {/* 대댓글 입력 */}
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

        {/* 대댓글 목록 */}
        {comment.replies.length > 0 && (
          <div className="mt-4 ml-4 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.commentId}
                comment={{ ...reply, replies: [] }}
                boardType={boardType}
                postId={postId}
                memberId={memberId}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
