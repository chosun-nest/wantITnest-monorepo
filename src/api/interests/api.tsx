import { API } from "../index_c";
//import { getAccessToken } from "../../utils/auth";

// 댓글 API
// 댓글 작성 - 생성, 조회, 수정, 삭제 기능 (POST)
// 댓글 요청 타입
export interface CommentActionPayload {
  content: string;
}
// 댓글 단일 API
export const commentAction = async (postId: number, payload: CommentActionPayload) => {
  const res = await API.post(`/api/v1/posts/${postId}/comments/new`, payload);
  return res.data;  // commentId, message
};

// 게시글 API
// 게시글 작성 (POST)
export interface PostWritePayload {
  title: string;
  content: string;
  tags: string[];
}
export const postsWrite = async (payload: PostWritePayload) => {
  const response = await API.post("/api/v1/posts/new", payload);
  return response.data;
};

// export const postsWrite = async (payload: PostWritePayload) => {
//   const response = await API.post("/api/v1/posts/new", payload);
//   return response.data;
// };

// 게시글 수정 요청 (PATCH)
export interface PostUpdatePayload {
  title?: string | null;
  content?: string | null;
  tags?: string[] | null;
}
export const updatePost = async (postId: number, payload: PostUpdatePayload) => {
  const response = await API.patch(`/api/v1/posts/update/${postId}`, payload);
  return response.data;   // postId, message
}

// 게시글 목록 조회 (GET)
export interface PostItem {
  id: number;
  title: string;
  previewContent: string;
  authorName: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
}
export interface PostsResponse {
  posts: PostItem[];
  totalCount: number;
}
export const fetchPostList = async (tags: string[] = []) => {
  const params = new URLSearchParams();
  tags.forEach(tag => params.append("tags", tag));

  const response = await API.get(`/api/v1/posts?${params.toString()}`);
  return response.data; // posts, totalCount
};

// 게시글 상세 조회 (GET)
export const fetchPostDetail = async (postId: number) => {
  const response = await API.get(`/api/v1/posts/${postId}`);
  return response.data;
};

// 게시글 삭제 (DELETE)
export const deletePost = async (postId: number) => {
  const response = await API.delete(`/api/v1/posts/delete/${postId}`);
  return response.data; // postId, message
};

// ----------------------------

// 프로필 이미지, 사용자 이름 정보, 다른 사용자 정보 가져오기 위해 필요한 api

// 회원 정보 조회 (GET)
export interface MemberProfile {
  memberId: number;
  memberEmail: string;
  memberRole: string;
  memberName: string;
  memberSnsUrl1: string;
  memberSnsUrl2: string;
  memberSnsUrl3: string;
  memberSnsUrl4: string;
  memberIsStudent: boolean;
  memberIntroduce: string;
  memberImageUrl: string;
  memberPasswordLength: number;

  memberDepartmentResponseDtoList: {
    memberDepartmentId: number;
    memberId: number;
    departmentId: number;
    departmentName: string;
  }[];

  memberInterestResponseDtoList: {
    memberInterestId: number;
    memberId: number;
    interestId: number;
    interestName: string;
  }[];

  memberTechStackResponseDtoList: {
    memberTechStackId: number;
    memberId: number;
    techStackId: number;
    techStackName: string;
  }[];
}

// 회원 정보 조회 (GET)
export const getMemberProfile = async (): Promise<MemberProfile> => {
  const res = await API.get("/api/v1/members/me");
  const BASE_URL = "http://119.219.30.209:6030";

  return {
    ...res.data,
    memberImageUrl: res.data.memberImageUrl
      ? `${BASE_URL}${res.data.memberImageUrl}`
      : "",
  };
};

