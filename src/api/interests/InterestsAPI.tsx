// [관심분야 정보 게시판] 게시글 API
import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import {
  CreatePostPayload,
  CreatePostResponse,
  PostDetail,
  DeletePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  PostListResponse,
  FetchPostsParams,
  ReactionType,
  ReactionResponse,
  SearchPostListResponse,
  SearchPostsParams
} from "../types/interest-board";

// =========================================
// [관심분야 게시판 글쓰기용 - board-write.tsx]
// =========================================

// 관심분야 게시글 작성 (POST) - 인증 필요
export const createInterestPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse> => {
  const token = getAccessToken();
  const response = await API.post<CreatePostResponse>(
    "/api/v1/posts",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// =========================================
// [관심분야 게시글 상세 페이지용 - interests-detail.tsx]
// =========================================

// 게시글 상세 조회 (GET) - 인증 불필요
export const fetchPostDetail = async (
  postId: number
): Promise<PostDetail> => {
  const response = await API.get<PostDetail>(`/api/v1/posts/${postId}`, {
    headers: { skipAuth: true },
  });
  return response.data;
};

// 게시글 삭제 (DELETE) - 인증 필요
export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
  const token = getAccessToken();
  const response = await API.delete<DeletePostResponse>(
    `/api/v1/posts/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 게시글 수정 요청 (PATCH) - 인증 필요
export const updatePost = async (
  postId: number,
  payload: UpdatePostRequest
): Promise<UpdatePostResponse> => {
  const token = getAccessToken();
  const response = await API.patch<UpdatePostResponse>(
    `/api/v1/posts/${postId}`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // postId, message
};

// =========================================
// [관심분야 게시판용 - interests-board.tsx]
// =========================================

// 게시글 목록 조회 (GET)

// 게시글 목록 요청 파라미터 : params
// 서버 응답 타입 : Promise<PostListResponse>
export const fetchPosts = async (
  params: FetchPostsParams
): Promise<PostListResponse> => {  
  const queryParams = new URLSearchParams();    // ?page=0&size=10&tags=JAVA 같은 형식

  if (params.page !== undefined) 
    queryParams.append("page", String(params.page));  // page 값이 있으면 쿼리 쿼리 스트링에 추가. ex) "page=0"
  if (params.size !== undefined) 
    queryParams.append("size", String(params.size));  // 한 페이지에 표시할 게시글 개수 ex) "size=10"
  if (params.sort) 
    queryParams.append("sort", params.sort);          // 정렬 기준 추가 ex) "createdAt, desc"
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));  // tags는 여러 개 지원하므로 tags=JAVA&tags=SPRING처럼 하나씩 반복 추가
  }

    const response = await API.get<PostListResponse>(
    `/api/v1/posts?${queryParams.toString()}`,
    { headers: { skipAuth: true },}
  );
  return response.data;
};

// 게시글 좋아요/싫어요 반응 관리(토글 방식) (POST) - 인증 필요

//type ReactionType = "LIKE" | "DISLIKE"; // 반응 타입

// interface ReactionRequest {
//   reactionType: ReactionType;
// }

export const reactToPost = async (
  postId: number,               // 게시글 ID
  reactionType: ReactionType    // 반응 타입
): Promise<ReactionResponse> => {
  const token = getAccessToken();
  const response = await API.post<ReactionResponse>(  // 로그인한 사용자만 반응 가능
    `/api/v1/posts/${postId}/reaction`,
    { reactionType },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// =========================================
// 게시글 검색 (GET) - 인증 불필요
export const searchPosts = async (
  params: SearchPostsParams
): Promise<SearchPostListResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append("keyword", params.keyword);
  if (params.searchType) 
    queryParams.append("searchType", params.searchType);
  if (params.page !== undefined) 
    queryParams.append("page", String(params.page));
  if (params.size !== undefined) 
    queryParams.append("size", String(params.size));
  if (params.sort) 
    queryParams.append("sort", params.sort);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => queryParams.append("tags", tag));
  }

  const response = await API.get<SearchPostListResponse>(
    `/api/v1/posts/search?${queryParams.toString()}`,
    {
      headers: { skipAuth: true },
    }
  );
  return response.data;
};