import { API } from "..";

//
// ✅ 1. 타입 정의
//

// 백엔드에서 받은 Project 타입 (Swagger 기준)
export interface Project {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  projectLeaderId: number;
  projectStartDate: string;
  projectEndDate: string;
  closed: boolean;
}

// 프로젝트 생성 시 필요한 데이터
export interface CreateProjectPayload {
  projectLeaderId: number;
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  projectStartDate: string;
  projectEndDate: string;
}

// 프로젝트 수정 시 필요한 데이터
export interface UpdateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  projectStartDate: string;
  projectEndDate: string;
}

// 프로젝트 지원서 제출 시 필요한 데이터
export interface ApplyProjectPayload {
  projectId: number;
  field: string;
  message: string;
}

// 지원자 타입
export interface Applicant {
  id: number;
  name: string;
  major: string;
  message: string;
  role: string;
  status: string;
}

//
// ✅ 2. 프로젝트 관련 API
//

// 프로젝트 전체 목록 가져오기 (GET)
export const getProjects = async (): Promise<Project[]> => {
  const res = await API.get("/api/v1/projects");
  return res.data;
};

// 특정 프로젝트 상세 조회 (GET)
export const getProjectById = async (id: number): Promise<Project> => {
  const res = await API.get(`/api/v1/projects/${id}`);
  return res.data;
};

// 프로젝트 생성 (POST)
export const createProject = async (
  payload: CreateProjectPayload
): Promise<number> => {
  const res = await API.post("/api/v1/projects", payload);
  return res.data; // 프로젝트 ID 반환
};

// 프로젝트 수정 (PATCH)
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload);
};

// 프로젝트 삭제 (DELETE)
export const deleteProject = async (projectId: number): Promise<void> => {
  await API.delete(`/api/v1/projects/${projectId}`);
};

//
// ✅ 3. 지원서 관련 API
//

// 프로젝트 지원서 제출 (POST)
export const applyToProject = async (
  payload: ApplyProjectPayload
): Promise<void> => {
  await API.post("/api/v1/applications", payload);
};

// 특정 프로젝트의 지원자 목록 조회 (GET)
export const getApplicationsByProjectId = async (
  projectId: number
): Promise<Applicant[]> => {
  const res = await API.get(`/api/v1/projects/${projectId}/applications`);
  return res.data;
};

// 지원서 상태 변경 (수락 / 거절)
export const updateApplicationStatus = async (
  applicationId: number,
  status: "accepted" | "rejected"
): Promise<void> => {
  await API.patch(`/api/v1/applications/${applicationId}/status`, { status });
};
