// ✅ types/project-board.ts

// ==================================
// POST /api/projects/new - 프로젝트 게시글 생성
// ==================================
// 요청 타입

export interface Project {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  closed: boolean;
  projectLeaderId: number;
  projectStartDate: string;
}
export interface CreateProjectPostPayload {
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  tags: string[];
  recruiting: boolean;
}

// 응답 타입
export interface CreateProjectPostResponse {
  projectId: number;
  message: string;
}

// ==================================
// 📘 GET /api/projects - 전체 목록 조회
// ==================================

// export interface ProjectSummary {
//   projectId: number;
//   projectTitle: string;
//   previewContent: string;
//   authorName: string;
//   tags: string[];
//   viewCount: number;
//   createdAt: string;
// }
export interface ProjectSummary {
  projectId: number;
  projectTitle: string;
  previewContent: string;
  author: {
    id: number;
    name: string;
  };
  tags: string[];
  viewCount: number;
  createdAt: string;
  commentCount: number;
  imageUrl: string;
}


export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProjectListResponse {
  projects: ProjectSummary[];
  totalCount: number;
  pageInfo: PageInfo;
}

// ==================================
// 🔍 GET /api/projects/{projectId} - 상세 조회
// ==================================

export interface ProjectDetail {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  tags: string[];
  author: {
    id: number;
    name: string;
  };
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  //maxMember: number;
}

// ==================================
// 🟢 POST /api/projects/new - 프로젝트 생성
// ==================================

export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  tags: string[];
  recruiting: boolean;
}

// ==================================
// 📝 PATCH /api/projects/{projectId} - 프로젝트 수정
// ==================================

export interface UpdateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  maxMember: number;
  tags: string[];
  recruiting: boolean;
}

// ==================================
// ❌ DELETE /api/projects/{projectId} - 삭제 응답
// ==================================

export interface DeleteProjectResponse {
  projectId: number;
  message: string;
}

// ==================================
// 📬 지원서 제출 및 지원자 조회 (추가로 필요할 경우)
// ==================================

export interface ApplyProjectPayload {
  projectId: number;
  field: string;
  message: string;
}

export interface Applicant {
  id: number;
  name: string;
  major: string;
  message: string;
  role: string;
  status: string; // accepted | rejected | pending
}
