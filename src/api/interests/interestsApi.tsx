import { API } from "../index_c";

// 게시글 API

// 게시글 작성 (POST)
export interface PostWritePayload { title: string; content: string; tags: string[]; }
export const postsWrite = async (payload: PostWritePayload) => {
  const response = await API.post("/api/v1/posts/new", payload);
  return response.data;
}

