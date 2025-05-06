import { API } from "../index_c";

// 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (file: File): Promise<string> => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const formData = new FormData();
  formData.append("file", file);    // key = "file"

  const res = await API.post("/api/v1/members/me/image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.imageUrl;
};

// 비밀번호 확인 (POST)
export interface CheckPasswordPayload { password: string; }

export const checkPassword = async (payload: CheckPasswordPayload) => {
  return API.post(
    "/api/v1/members/check-password",
    payload,
    { validateStatus: status => status < 500 }
  );
};

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
  memberPasswordLength: number;

  memberDepartmentResponseDtoList: {
    memberDepartmentId: number;
    memberId: number;
    departmentId: number;
    departmentName: string;
  }[];

  memberInterestResponseDtoList: {
    memberInterestId: number;
    memberId: number;
    interestId: number;
    interestName: string;
  }[];

  memberTechStackResponseDtoList: {
    memberTechStackId: number;
    memberId: number;
    techStackId: number;
    techStackName: string;
  }[];
}

// 회원 정보 조회 (GET)
export const getMemberProfile = async (): Promise<MemberProfile> => {
  const res = await API.get("/api/v1/members/me");
  const BASE_URL = "http://119.219.30.209:6030";

  return {
    ...res.data,
    memberImageUrl: res.data.memberImageUrl
      ? `${BASE_URL}${res.data.memberImageUrl}`
      : "",
  };
};
// export const getMemberProfile = async (): Promise<MemberProfile> => {
//   const token = localStorage.getItem("accesstoken");
//   if (!token) {
//     console.error("❌ 토큰 없음! 로그인 상태 확인 필요");
//     throw new Error("No access token");
//   }

//   try {
//     const res = await API.get("/api/v1/members/me");
//     const BASE_URL = "http://119.219.30.209:6030";

//     return {
//       ...res.data,
//       memberImageUrl: res.data.memberImageUrl
//         ? `${BASE_URL}${res.data.memberImageUrl}`
//         : "",
//     };
//   } catch (err) {
//     console.error("❌ 프로필 정보 조회 실패", err);
//     throw err;
//   }
//};


// 회원 탈퇴 (DELETE)
export const withdrawMember = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.delete("/api/v1/members/me", {
    headers: { Authorization: `Bearer ${token}` }, // 인증이 필요하므로 skipAuth: true 사용 x
  });

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

  // const res = await API.patch("/api/v1/members/me", payload, {
  //   headers: { Authorization: `Bearer ${token}` }, // 인증이 필요하므로 skipAuth: true 사용 x
  // });
  
  return await API.patch("/api/v1/members/me", payload, {
    headers: { Authorization: `Bearer ${token}` }, // 인증이 필요하므로 skipAuth: true 사용 x
  }); // 전체 AxiosResponse<T> 반환
};

// 비밀번호 변경 (PATCH)
export interface UpdateMemberPasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

export const updateMemberPassword = async (
  payload: UpdateMemberPasswordPayload
): Promise<{ message: string }> => {
  // Promise<{ message: string }> 단순 메시지 리턴
  const token = localStorage.getItem("accesstoken");
  if (!token) throw new Error("No access token");

  const res = await API.patch("/api/v1/members/me/password", payload, {
    headers: { Authorization: `Bearer ${token}` }, // 인증이 필요하므로 skipAuth: true 사용 x
  });

  return res.data;
};

// =============
// 인증 관련 API
// 토큰 유효성 검사 (GET)
export const checkTokenValidity = async (): Promise<{ memberId: number }> => {
  const res = await API.get("/api/v1/auth/me");
  return res.data; // 토큰이 유효하면 memberId를 반환. DB 접근 없이 토큰 기반으로 동작함.
};

// =============

// =============
// email-verification

// 이메일 인증 코드 전송 (POST)
export const sendcode = async (email: string) => {
  const res = await API.post("/api/v1/auth/send-code", { email });
  return res.data;
}

// 인증 코드 검증 (POST)
export const verifycode = async (email: string, code: string) => {
  const res = await API.post("api/v1/auth/verify-code", {
    email,
    code,
  });
  return res.data;
}

// =============

// 인증이 필요 없는 API 호출들
// 기술 스택 목록 조회 (GET)
export const getTech = async () => {
  const res = API.get("/api/v1/tech-stacks", { headers: { skipAuth: true } });
  return (await res).data;
};

// 관심 기술 전체 조회 (GET)
export const getInterests = async () => {
  const res = API.get("/api/v1/interests", { headers: { skipAuth: true } });
  return (await res).data;
};

// 학과 전체 조회 (GET)
export const getDepartments = async () => {
  const res = API.get("/api/v1/departments", { headers: { skipAuth: true } });
  return (await res).data;
};
