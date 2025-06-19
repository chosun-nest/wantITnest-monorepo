import { API } from "..";

export const follow = async (followingId: string) => {
  const res = await API.post(
    `/api/v1/follow`,
    { followingId },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const unfollow = async (followingId: string) => {
  const res = await API.delete(`/api/v1/follow/${followingId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const checkOthersFollowings = async (memberId: string) => {
  const res = await API.get(`/api/v1/follow/following/${memberId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const checkMyFollowings = async () => {
  const res = await API.get(`/api/v1/follow/following`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const checkMyFollowers = async () => {
  const res = await API.get(`/api/v1/follow/followers`, {
    headers: { skipAuth: false },
  });
  return res.data;
};
