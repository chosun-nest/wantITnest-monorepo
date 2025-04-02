import API from "../index";

export const login = async (email: string, password: string) => {
  const res = await API.post("/api/v1/auth/login", { email, password }); // 첫 번째 인자는 base url에서 파생된 요청할 주소임
  return res.data;
};

// 🔄 email, password만 받던 함수 → payload 전체를 받도록 변경
export const signup = async (payload: {
  email: string;
  password: string;
  name: string;
  userType: "재학생" | "일반";
  interest: string;
  skills: string;
  department?: string; // 재학생일 경우만 전달
}) => {
  const { email, password } = payload;
  const res = await API.post("/api/v1/auth/signup", { email, password });
  return res.data;
};
