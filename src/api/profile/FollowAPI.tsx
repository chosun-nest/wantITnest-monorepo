// 팔로우 관련 API
import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import type { FollowUserListResponse, FollowRequestPayload } from "../../types/api/follow";

// 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

// 내가 팔로잉 하는 사용자 목록 조회 (GET)
export const getMyFollowing = async (): Promise<FollowUserListResponse> => {
  const res = await API.get("/api/v1/follow/following", authHeader());
  return res.data;
};

// 나를 팔로우하는 사용자 목록 조회 (GET)
export const getMyFollowers = async (): Promise<FollowUserListResponse> => {
  const res = await API.get("/api/v1/follow/followers", authHeader());
  return res.data;
};

// 팔로우 요청 (POST)
export const followUser = async (followingId: number): Promise<{ message: string }> => {
  const payload: FollowRequestPayload = { followingId };
  const res = await API.post("/api/v1/follow", payload, authHeader());
  return res.data;
};

// 언팔로우 요청 (DELETE)
export const unfollowUser = async (followingId: number): Promise<void> => {
  await API.delete(`/api/v1/follow/${followingId}`, authHeader());
};

// 특정 사용자의 팔로잉 목록 조회 (GET)
export const getFollowingByMemberId = async (
  memberId: number
): Promise<FollowUserListResponse> => {
  const res = await API.get(`/api/v1/follow/${memberId}/following`, authHeader());
  return res.data;
};
