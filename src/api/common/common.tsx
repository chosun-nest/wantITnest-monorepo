import API from "../index";

export const getTech = async () => {
  const res = API.get("/api/v1/tech-stacks");
  return (await res).data;
};

export const getInterests = async () => {
  const res = API.get("/api/v1/interests");
  return (await res).data;
};
