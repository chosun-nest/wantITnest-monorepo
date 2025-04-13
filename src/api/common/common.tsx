// 팀장님꺼니 건들지 마라
import { API } from "../index";

export const getTech = async () => {
  const res = API.get("/api/v1/tech-stacks", { headers: { skipAuth: true } });
  return (await res).data;
};

export const getInterests = async () => {
  const res = API.get("/api/v1/interests", { headers: { skipAuth: true } });
  return (await res).data;
};

export const getDepartments = async () => {
  const res = API.get("/api/v1/departments", { headers: { skipAuth: true } });
  return (await res).data;
};
