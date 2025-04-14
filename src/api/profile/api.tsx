import API from "../index";

export const getMemberProfile = async () => {
  const token = localStorage.getItem("accesstoken");
  const res = await API.get("/api/v1/members/me", {
    headers: { Authorization: `Bearer ${token}` },
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

// 프로필 수정 요청 (patch)
export const updateMemberProfile = async ({
  memberImage,
  departmentId,
  bio,
  interestIdList,
  techStackIdList,
  memberSnsUrl1,
  memberSnsUrl2,
}: {
  memberImage?: string; // base64나 URL 가능
  departmentId?: number;
  bio: string;
  interestIdList: number[];
  techStackIdList: number[];
  memberSnsUrl1: string;
  memberSnsUrl2: string;
}) => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.patch(
    "/api/v1/members/me",
    {
      memberImage, // 전송
      departmentId,
      bio,
      interestIdList,
      techStackIdList,
      memberSnsUrl1,
      memberSnsUrl2,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

// 회원 탈퇴 요청 (delete)
export const withdrawMember = async () => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.delete("/api/v1/members/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
