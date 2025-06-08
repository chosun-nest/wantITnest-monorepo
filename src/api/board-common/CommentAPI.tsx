// [모든 게시판 공통] 댓글 API
import { API } from "..";
import { getAccessToken } from "../../utils/auth"
import {      // CommentAPI.tsx에서 겹치는 타입들 모아둠
  BoardType,
  CommentResponse,
  CommentPayload,
  CommentReactionRequest,
  CommentReactionResponse,
  DeleteCommentResponse,
  FetchCommentsResponse
} from "../../types/api/comments";

// =========================================
// 댓글 목록 조회 (GET)
export const fetchComments = async (    // 댓글 목록 조회
  boardType: BoardType,
  postId: number
): Promise<FetchCommentsResponse> => {
  const token = getAccessToken();
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const res = await API.get<FetchCommentsResponse>(   // 임시로 로그인 하지 않아도 볼 수 있게 함
    `/api/v1/${boardType}/${postId}/comments`,
    { headers } // token이 없으면 headers는 undefined
  );
  return res.data;
};

// =========================================
// 댓글 작성 (POST)
export const createComment = async (
  boardType: BoardType,           // 게시판 종류 ("INTEREST" | "PROJECT")
  postId: number,                 // 댓글을 작성할 게시글 ID
  payload: CommentPayload   // 댓글 내용 (content)
): Promise<CommentResponse> => {      // 공통 타입 응답 부분
  const token = getAccessToken();
  const res = await API.post<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// =========================================
// 대댓글 작성 (POST)
export const createReplyComment = async (
  boardType: BoardType,
  postId: number,               // 대상 게시글 ID
  parentId: number,             // 부모 댓글 ID
  payload: CommentPayload   // 대댓글 내용
): Promise<CommentResponse> => {      // 공통 타입 응답 부분
  const token = getAccessToken();
  const res = await API.post<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${parentId}/reply`,
    payload,
    {
      headers: {    // 인증된 사용자만
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// =========================================
// 댓글 좋아요/싫어요 반응 관리(토글 방식) (POST)
export const reactToComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number,
  payload: CommentReactionRequest
): Promise<CommentReactionResponse> => {
  const token = getAccessToken();
  const res = await API.post<CommentReactionResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}/reaction`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// =========================================
// 댓글/대댓글 삭제 (DELETE)
// - 본인이 작성한 댓글만 삭제
// - 대댓글이 존재하는 부모 댓글은 soft delete 처리됨. (내용은 "삭제된 댓글입니다."로 변경되고, 자식 댓글은 유지)
// - 대댓글이 없는 댓글은 물리적으로 삭제(DB delete)

export const deleteComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number     // await deleteComment("PROJECT", 42, 123); // 123번 댓글 삭제 시도
): Promise<DeleteCommentResponse> => {
  const token = getAccessToken();
  const res = await API.delete<DeleteCommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// =========================================
// 댓글 수정 (PATCH)
export const updateComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number,
  payload: CommentPayload   // await updateComment("PROJECT", 42, 123, { content: "댓글 수정 내용입니다." });
): Promise<CommentResponse> => {
  const token = getAccessToken();
  const res = await API.patch<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


