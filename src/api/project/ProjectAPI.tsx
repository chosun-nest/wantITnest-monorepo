import { API } from "..";

// ✅ 백엔드에서 온 순수 Project 타입 (Swagger 기준)
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

// ✅ 프로젝트 리스트 가져오기 (GET)
export const getProjects = async (): Promise<Project[]> => {
  const res = await API.get("/api/v1/projects");
  return res.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await API.get(`/api/v1/projects/${id}`);
  return res.data;
};

// ✅ 프로젝트 생성 (POST)
export interface CreateProjectPayload {
  projectLeaderId: number;
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  projectStartDate: string;
  projectEndDate: string;
}

export const createProject = async (
  payload: CreateProjectPayload
): Promise<number> => {
  // return 값은 projectId 하나
  const res = await API.post("/api/v1/projects", payload);
  return res.data;
};

export interface ApplyProjectPayload {
  projectId: number;
  field: string;
  message: string;
}

export const applyToProject = async (payload: ApplyProjectPayload): Promise<void> => {
  await API.post("/api/v1/applications", payload); // 엔드포인트는 백엔드 명세에 맞게 수정 가능
};
