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

// =============================================
// ✅ 공통 인증: 프로젝트 게시판은 일부 비공개, 일부 공개
// 검색용 API는 공개 접근 허용됨 (skipAuth 사용)
// =============================================

// 📘 프로젝트 게시글 생성 (POST)
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post("/api/v1/projects/new", payload);
  return response.data;
};

// 📘 프로젝트 목록 조회 (GET)
export const getProjects = async (params: {
  "pageable.page": number;
  "pageable.size": number;
  "pageable.sort": string;
  tags?: string[];
  keyword?: string;
  isRecruiting?: boolean;
}): Promise<ProjectListResponse> => {
  const response = await API.get("/api/v1/projects", {
    params,
    headers: { skipAuth: true },
  });
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

// 🔍 프로젝트 검색 (GET /projects/search) - 인증 없이 접근 가능
export const searchProjects = async (params: {
  keyword: string;
  searchType?: "ALL" | "TITLE" | "CONTENT";
  tags?: string[];
  "pageable.page": number;
  "pageable.size": number;
  "pageable.sort": string;
}): Promise<ProjectListResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append("keyword", params.keyword);
  if (params.searchType) queryParams.append("searchType", params.searchType);
  queryParams.append("pageable.page", String(params["pageable.page"]));
  queryParams.append("pageable.size", String(params["pageable.size"]));
  queryParams.append("pageable.sort", params["pageable.sort"]);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  const response = await API.get(`/api/v1/projects/search?${queryParams.toString()}`, {
    headers: { skipAuth: true },
  });

  return response.data;
};
