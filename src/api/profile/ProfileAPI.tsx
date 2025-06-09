import {
  MemberProfile,
  UpdateMemberProfilePayload,
  CheckPasswordPayload,
  UpdateMemberPasswordPayload,
} from "../../types/api/profile";

// 프로필 API
import { API } from "..";

// 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/api/v1/members/me/image", formData, {
    headers: { skipAuth: false },
  });
  return res.data.imageUrl;
};

// 비밀번호 확인 (POST)
export const checkPassword = async (payload: CheckPasswordPayload) => {
  return API.post("/api/v1/members/check-password", payload, {
    headers: { skipAuth: false },
    validateStatus: (status) => status < 500,
  });
};

// 회원 정보 조회 (GET)
export const getMemberProfile = async (): Promise<MemberProfile> => {
  const res = await API.get("/api/v1/members/me", {
    headers: { skipAuth: false },
  });
  const BASE_URL = "http://49.246.71.236:6030";

  return {
    ...res.data,
    memberImageUrl: res.data.memberImageUrl
      ? `${BASE_URL}${res.data.memberImageUrl}`
      : "",
  };
};

// 회원 탈퇴 (DELETE)
export const withdrawMember = async (): Promise<{ message: string }> => {
  const res = await API.delete("/api/v1/members/me", {
    headers: { skipAuth: false },
  });
  return res.data;
};

// 회원 정보 수정 (PATCH)
export const updateMemberProfile = async (
  payload: UpdateMemberProfilePayload
) => {
  return await API.patch("/api/v1/members/me", payload, {
    headers: { skipAuth: false },
  });
};

// 비밀번호 변경 (PATCH)
export const updateMemberPassword = async (
  payload: UpdateMemberPasswordPayload
): Promise<{ message: string }> => {
  const res = await API.patch("/api/v1/members/me/password", payload, {
    headers: { skipAuth: false },
  });
  return res.data;
};

// =============
// 인증 관련 API
// 토큰 유효성 검사 (GET)
export const checkTokenValidity = async (): Promise<{ memberId: number }> => {
  const res = await API.get("/api/v1/auth/me", {
    headers: { skipAuth: false },
  });
  return res.data;
};

// =============

// 기술 스택 목록 조회 (GET)
export const getTech = async () => {
  const res = await API.get("/api/v1/tech-stacks", {
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

// =============

// 관심 태그 목록 조회 (GET)
export const getFavoriteTags = async (): Promise<
  { tagId: number; tagName: string }[]
> => {
  const res = await API.get("/api/v1/favorites/tags", {
    headers: { skipAuth: false },
  });
  return res.data.favoriteTags;
};

// 관심 태그 추가
export const addFavoriteTag = async (tagName: string): Promise<void> => {
  await API.post(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    null,
    {
      headers: { skipAuth: false },
    }
  );
};

// 관심 태그 삭제
export const deleteFavoriteTag = async (tagName: string): Promise<void> => {
  await API.delete(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    {
      headers: { skipAuth: false },
    }
  );
};
