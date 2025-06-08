// CommentAPI.tsx에서 겹치는 타입들 모아둠
export type BoardType = "INTEREST" | "PROJECT";
export type ReactionType = "LIKE" | "DISLIKE";

// 댓글 api(CommentAPI.tsx) 공통 타입 응답 부분 - 댓글, 대댓글
export interface Comment {    // 댓글 항목 타입
  commentId: number;    // 댓글 ID
  content: string;      // 댓글 내용
  authorName: string;   // 작성자 이름
  createdAt: string;    // 작성일자
  updatedAt: string;    // 수정일자
  parentId: number;     // 부모 댓글 ID (대댓글)
  likeCount: number;    // 댓글 좋아요 수
  dislikeCount: number; // 댓글 싫어요 수
  isDeleted: boolean;   // 삭제된 댓글 여부
}

export type CommentResponse = Comment;  // 공통 타입 응답 부분 (댓글, 대댓글)

export interface FetchCommentsResponse {  // 댓글 전체 응답 타입
  comments: Comment[];
  totalCount: number;
}

// 댓글 작성 (POST), 댓글 수정 (PATCH)
export interface CommentPayload {   
  content: string;    // 1~500자
}

// 댓글 좋아요/싫어요 반응 관리(토글 방식) (POST)
export interface CommentReactionRequest {   // 댓글 반응 타입 - 좋아요/싫어요
  reactionType: ReactionType;
}

// 댓글 좋아요/싫어요 반응 관리(토글 방식) (POST)
export interface CommentReactionResponse {  // 댓글 반응
  commentId: number;      // 댓글 id
  likeCount: number;      // 좋아요수
  dislikeCount: number;   // 싫어요수
  message: string; // 추가, 변경, 취소
}

// 댓글/대댓글 삭제 (DELETE)
export interface DeleteCommentResponse {
  commentId: number;
  message: string;      // ex) 삭제 성공
}