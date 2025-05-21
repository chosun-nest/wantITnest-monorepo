import { API } from "..";

export const getUsersAllHistory = async () => {
  const res = await API.get("/api/v1/histories", {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const postAHistory = async (payload: {
  content: string;
  startdate: string;
  enddate: string;
  important: boolean;
}) => {
  const res = await API.post("/api/v1/histories", payload, {
    headers: { skipAuth: false },
  });
  return res.data;
};
