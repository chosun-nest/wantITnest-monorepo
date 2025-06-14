import { API } from "..";
import { getAccessToken } from "../../utils/auth";

// ✅ 타입 import (중복 제거 및 정리)
import {
  CreateProjectPayload,
  CreateProjectPostResponse,
  ProjectListResponse,
  ProjectDetail,
  UpdateProjectPayload,
  DeleteProjectResponse,
  ApplyProjectPayload,
  Applicant,
} from "../../types/api/project-board";

// ✅ 공통 인증 헤더
const authHeader = () => ({
  headers: { Authorization: `Bearer ${getAccessToken()}` },
});

//
// ✅ 프로젝트 관련 API
//

// 📌 프로젝트 게시글 생성 (POST)
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post<CreateProjectPostResponse>(
    "/api/v1/projects/new",  // ✅ Swagger에 맞춰 경로 "/new"
    payload,
    authHeader()
  );
  return response.data;
};

// 📌 프로젝트 목록 조회 (GET) - 인증 불필요
export const getProjects = async (
  params: {
    "pageable.page": number;
    "pageable.size": number;
    "pageable.sort": string;
  }
): Promise<ProjectListResponse> => {
  const res = await API.get("/api/v1/projects", {
    params, // ✅ 인증 없이 params만 전달
  });
  return res.data;
};

// 📌 프로젝트 상세 조회 (GET)
export const getProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const res = await API.get(`/api/v1/projects/${projectId}`, authHeader());
  return res.data;
};

// 📌 프로젝트 수정 (PATCH)
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload, authHeader());
};

// 📌 프로젝트 삭제 (DELETE)
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const res = await API.delete(`/api/v1/projects/${projectId}`, authHeader());
  return res.data;
};

//
// ✅ 지원서 관련 API
//

// 📨 프로젝트 지원서 제출 (POST)
export const applyToProject = async (
  payload: ApplyProjectPayload
): Promise<void> => {
  await API.post("/api/v1/applications", payload, authHeader());
};

// 📥 프로젝트 지원자 목록 조회 (GET)
export const getApplicationsByProjectId = async (
  projectId: number
): Promise<Applicant[]> => {
  const res = await API.get(
    `/api/v1/projects/${projectId}/applications`,
    authHeader()
  );
  return res.data;
};

// 🔁 지원서 상태 변경 (PATCH)
export const updateApplicationStatus = async (
  applicationId: number,
  status: "accepted" | "rejected"
): Promise<void> => {
  await API.patch(
    `/api/v1/applications/${applicationId}/status`,
    { status },
    authHeader()
  );
};
