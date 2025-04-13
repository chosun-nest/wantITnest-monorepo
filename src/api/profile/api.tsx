import { API } from "../index";

export const getMemberProfile = async () => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await API.get("/api/v1/members/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getTech = async () => {
  const res = API.get("/api/v1/tech-stacks");
  return (await res).data;
};

export const getInterests = async () => {
  const res = API.get("/api/v1/interests");
  return (await res).data;
};
