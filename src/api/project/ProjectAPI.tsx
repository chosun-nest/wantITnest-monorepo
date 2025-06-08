import { API } from "..";
import { getAccessToken } from "../../utils/auth";

// ✅ 타입 분리 후 import
import {
  CreateProjectPostPayload,
  CreateProjectPostResponse,
  ProjectListResponse,
  ProjectDetail,
  CreateProjectPayload,
  UpdateProjectPayload,
  DeleteProjectResponse,
  ApplyProjectPayload,
  Applicant,
} from "../types/project-board";

// ✅ 공통 인증 헤더
const authHeader = () => ({
  headers: { Authorization: `Bearer ${getAccessToken()}` },
});

//
// ✅ 프로젝트 관련 API
//

// POST /api/projects/new - 프로젝트 게시글 생성
export const createProjectPost = async (
  payload: CreateProjectPostPayload
): Promise<CreateProjectPostResponse> => {
  const token = getAccessToken();
  const response = await API.post<CreateProjectPostResponse>(
    "/api/projects/new",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// 전체 프로젝트 목록 가져오기
export const getProjects = async (): Promise<ProjectListResponse> => {
  const res = await API.get("/api/v1/projects", authHeader());
  return res.data;
};

// 특정 프로젝트 상세 조회
export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const res = await API.get(`/api/v1/projects/${projectId}`, authHeader());
  return res.data;
};

// 프로젝트 생성
export const createProject = async (
  payload: CreateProjectPayload
): Promise<number> => {
  const res = await API.post("/api/v1/projects", payload, authHeader());
  return res.data;
};

// 프로젝트 수정
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload, authHeader());
};

// 프로젝트 삭제
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const res = await API.delete(`/api/v1/projects/${projectId}`, authHeader());
  return res.data;
};

//
// ✅ 지원서 관련 API
//

// 프로젝트 지원서 제출
export const applyToProject = async (
  payload: ApplyProjectPayload
): Promise<void> => {
  await API.post("/api/v1/applications", payload, authHeader());
};

// 특정 프로젝트의 지원자 목록 조회
export const getApplicationsByProjectId = async (
  projectId: number
): Promise<Applicant[]> => {
  const res = await API.get(
    `/api/v1/projects/${projectId}/applications`,
    authHeader()
  );
  return res.data;
};

// 지원서 상태 변경 (수락 / 거절)
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