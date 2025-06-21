import { API } from "..";

// ✅ 타입 import
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

//
// ✅ 프로젝트 관련 API
//

// 📘 프로젝트 게시글 생성 (POST) - 인증 필요
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post("/api/v1/projects/new", payload);
  return response.data;
};

// 📘 프로젝트 목록 조회 (GET) - 인증 불필요
export const getProjects = async (
  params: {
    "pageable.page": number;
    "pageable.size": number;
    "pageable.sort": string;
  }
): Promise<ProjectListResponse> => {
  const res = await API.get("/api/v1/projects", { params });
  return res.data;
};

// 📘 프로젝트 상세 조회 (GET) - 인증 필요
export const getProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const res = await API.get(`/api/v1/projects/${projectId}`);
  return res.data;
};

// 📝 프로젝트 수정 (PATCH) - 인증 필요
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload);
};

// ❌ 프로젝트 삭제 (DELETE) - 인증 필요
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const res = await API.delete(`/api/v1/projects/${projectId}`);
  return res.data;
};

//
// ✅ 지원서 관련 API
//

// 📬 프로젝트 지원서 제출 (POST) - 인증 필요
export const applyToProject = async (
  payload: ApplyProjectPayload
): Promise<void> => {
  await API.post("/api/v1/applications", payload);
};

// 📋 프로젝트 지원자 목록 조회 (GET) - 인증 필요
export const getApplicationsByProjectId = async (
  projectId: number
): Promise<Applicant[]> => {
  const res = await API.get(`/api/v1/projects/${projectId}/applications`);
  return res.data;
};

// 🟢 지원서 상태 변경 (PATCH) - 인증 필요
export const updateApplicationStatus = async (
  applicationId: number,
  status: "accepted" | "rejected"
): Promise<void> => {
  await API.patch(`/api/v1/applications/${applicationId}/status`, { status });
};
