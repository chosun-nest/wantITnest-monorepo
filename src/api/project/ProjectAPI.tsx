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

// 📘 프로젝트 게시글 생성 (POST)
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post("/api/v1/projects/new", payload);
  return response.data;
};

// 📘 프로젝트 목록 조회 (GET) - 태그, 키워드, 모집상태, 페이징, 정렬 포함
export const getProjects = async (params: {
  "pageable.page": number;
  "pageable.size": number;
  "pageable.sort": string;
  tags?: string[];             // 🔍 태그 필터링 (다중 허용)
  keyword?: string;            // 🔍 제목/내용 검색
  isRecruiting?: boolean;      // ✅ 모집중 필터
}): Promise<ProjectListResponse> => {
  const response = await API.get("/api/v1/projects", { params });
  return response.data;
};

// 📘 프로젝트 상세 조회 (GET)
export const getProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const response = await API.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

// 📝 프로젝트 수정 (PATCH)
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload);
};

// ❌ 프로젝트 삭제 (DELETE)
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const response = await API.delete(`/api/v1/projects/${projectId}`);
  return response.data;
};

//
// ✅ 지원서 관련 API
//

// 📬 프로젝트 지원서 제출 (POST)
export const applyToProject = async (
  payload: ApplyProjectPayload
): Promise<void> => {
  await API.post("/api/v1/applications", payload);
};

// 📋 지원자 목록 조회 (GET)
export const getApplicationsByProjectId = async (
  projectId: number
): Promise<Applicant[]> => {
  const response = await API.get(`/api/v1/projects/${projectId}/applications`);
  return response.data;
};

// 🟢 지원서 상태 변경 (PATCH)
export const updateApplicationStatus = async (
  applicationId: number,
  status: "accepted" | "rejected"
): Promise<void> => {
  await API.patch(`/api/v1/applications/${applicationId}/status`, { status });
};
