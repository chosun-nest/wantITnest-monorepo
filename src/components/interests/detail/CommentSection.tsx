// 관심분야 정보 게시판 댓글 전체 랜더링 컨트롤
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
import {
  fetchComments,
  createComment,
} from "../../../api/board-common/CommentAPI";
import type { RawComment, CommentWithReplies, BoardType } from "../../../types/api/comments";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import SkeletonComment from "./SkeletonComment";

export default function CommentSection({ boardType, postId }: { boardType: BoardType; postId: number }) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const memberId = Number(localStorage.getItem("memberId"));
  const isLoggedIn = !Number.isNaN(memberId);

  // children → replies 변환 함수
  const mapBackendComments = (rawComments: RawComment[]): CommentWithReplies[] => {
    return rawComments.map((comment) => ({
      ...comment,
      replies: comment.children ? mapBackendComments(comment.children) : [],
    }));
  };

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await fetchComments(boardType, postId);
      const converted = mapBackendComments(res.comments);
      setComments(converted);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
      dispatch(
        showModal({
          title: "댓글 불러오기 실패",
          message: "댓글 목록을 불러오는 중 오류가 발생했습니다.",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleAddComment = async (content: string) => {
    if (!isLoggedIn) {
      dispatch(
        showModal({
          title: "로그인 필요",
          message: "댓글을 작성하려면 로그인 해주세요.",
          type: "error",
        })
      );
      return;
    }
    try {
      await createComment(boardType, postId, { content });
      await new Promise((res) => setTimeout(res, 300)); // 약간의 지연
      await loadComments();
    } catch (err) {
      console.error("댓글 작성 실패", err);
      dispatch(
        showModal({
          title: "댓글 작성 실패",
          message: "댓글 작성 중 오류가 발생했습니다.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-lg font-semibold">댓글</h3>
      <CommentForm
        onSubmit={handleAddComment}
        isLoggedIn={isLoggedIn}
        placeholder="댓글을 입력하세요"
      />
      {loading ? (
        <SkeletonComment />
      ) : (
        <CommentList
          comments={comments}
          postId={postId}
          boardType={boardType}
          onRefresh={loadComments}
        />
      )}
    </div>
  );
}
