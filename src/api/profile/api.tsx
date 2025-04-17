import { API } from "../index_c";

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
  memberDepartmentResponseDtoList: {
    departmentId: number;
    departmentName: string;
  }[];
  memberInterestResponseDtoList: {
    interestId: number;
    interestName: string;
  }[];
  memberTechStackResponseDtoList: {
    techStackId: number;
    techStackName: string;
  }[];
}

export const getMemberProfile = async (): Promise<MemberProfile> => {
  const res = await API.get("/api/v1/members/me");
  return res.data;
};

// 회원 정보 수정 (PATCH)
export interface UpdateMemberProfilePayload {
  memberName?: string;
  memberImageUrl?: string;
  memberIsStudent?: boolean;
  memberIntroduce?: string;
  memberSnsUrl1?: string;
  memberSnsUrl2?: string;
  memberSnsUrl3?: string;
  memberSnsUrl4?: string;
  memberDepartmentUpdateRequestIdList?: number[];
  memberInterestUpdateRequestIdList?: number[];
  memberTechStackUpdateRequestIdList?: number[];
}

export const updateMemberProfile = async (
  payload: UpdateMemberProfilePayload
) => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.patch (
    "/api/v1/members/me", payload, { 
    headers: { Authorization: `Bearer ${token}` },  // 인증이 필요하므로 skipAuth: true 사용 x
  });

  return res.data;
}

// 비밀번호 변경 (PATCH)
export interface UpdateMemberPasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

export const updateMemberPassword = async (
  payload: UpdateMemberPasswordPayload  
): Promise<{ message: string }> => {                // Promise<{ message: string }> 단순 메시지 리턴
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.patch (
    "/api/v1/members/me/password", payload, {
    headers: { Authorization: `Bearer ${token}` },  // 인증이 필요하므로 skipAuth: true 사용 x
  });

  return res.data;
}

// 회원 탈퇴 (DELETE)
export const withdrawMember = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.delete("/api/v1/members/me", {
    headers: { Authorization: `Bearer ${token}` },  // 인증이 필요하므로 skipAuth: true 사용 x
  });

  return res.data;
}

// 기술 스택 목록 조회 (GET)
export const getTech = async () => {
  const res = await API.get("/api/v1/tech-stacks", {
    headers: { skipAuth: true },
  });
  return res.data;
};

// 관심 기술 전체 조회 (GET)
export const getInterests = async () => {
  const res = await API.get("/api/v1/interests", {
    headers: {skipAuth: true},
  });
  return res.data;
};

