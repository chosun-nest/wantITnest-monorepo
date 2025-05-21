// profile/api.tsx
import { API } from "..";
import { getAccessToken } from "../../utils/auth";

// 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (file: File): Promise<string> => {
  const token = getAccessToken();

  if (!token) {
    console.error("No access token");
    throw new Error("No access token");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/api/v1/members/me/image", formData, {
    // Axios 요청
    headers: {
      Authorization: `Bearer ${token}`, // Authorization 헤더, 토큰 검증
      // Content-Type 생략: Axios가 자동 설정
    },
  });

  return res.data.imageUrl; // 업로드된 imageUrl 추출
};

// 비밀번호 확인 (POST)
export interface CheckPasswordPayload {
  password: string;
}

export const checkPassword = async (payload: CheckPasswordPayload) => {
  return API.post("/api/v1/members/check-password", payload, {
    validateStatus: (status) => status < 500,
  });
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
  const imagePath = res.data.memberImageUrl;

  return {
    ...res.data,
    memberImageUrl:
      imagePath && !imagePath.startsWith("http")
        ? `${BASE_URL}${imagePath}`
        : imagePath || "",
  };
};

// 회원 탈퇴 (DELETE)
export const withdrawMember = async (): Promise<{ message: string }> => {
  const token = getAccessToken();

  const res = await API.delete("/api/v1/members/me", {
    headers: { Authorization: `Bearer ${token}` },
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
  const token = getAccessToken();

  return await API.patch("/api/v1/members/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
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
  const token = getAccessToken();

  const res = await API.patch("/api/v1/members/me/password", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// =============
// 인증 관련 API
// 토큰 유효성 검사 (GET)
export const checkTokenValidity = async (): Promise<{ memberId: number }> => {
  const res = await API.get("/api/v1/auth/me");
  return res.data;
};

// =============

// 인증이 필요 없는 API 호출들
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
    headers: { skipAuth: true },
  });
  return res.data;
};

// 학과 전체 조회 (GET)
export const getDepartments = async () => {
  const res = await API.get("/api/v1/departments", {
    headers: { skipAuth: true },
  });
  return res.data;
};
