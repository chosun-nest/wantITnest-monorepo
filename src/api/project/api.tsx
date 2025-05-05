import { API } from "../index_c";

// 프로젝트 타입 (Swagger 기준)
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

// 프로젝트 리스트 가져오기 (GET) 
export const getProjects = async (): Promise<Project[]> => {
  const res = await API.get("/api/v1/projects");
  return res.data;
};

// 프로젝트 생성 (POST)
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
  // return 값이 projectId 넘버 하나임
  const res = await API.post("/api/v1/projects", payload);
  return res.data;
};