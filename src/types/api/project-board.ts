// ✅ types/project-board.ts

// ==================================
// 📘 GET /api/projects - 전체 목록 조회
// ==================================

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
  isRecruiting: boolean;
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
  projectMembers: {
    part: string;
    role: string;
    memberId: number;
    memberName: string;
  }[];
  isRecruiting: boolean;
}

// ==================================
// 🟢 POST /api/projects/new - 프로젝트 생성 (Swagger 기준)
// ==================================

export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription?: string;
  tags?: string[];
  partCounts: {
    [key: string]: number; // 예: FRONTEND: 2, BACKEND: 1
  };
  creatorPart: string;     // 예: "FRONTEND"
  creatorRole: string;     // 예: "LEADER"
  recruiting: boolean;
}

export interface CreateProjectPostResponse {
  projectId: number;
  message: string;
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
// 📬 지원서 제출 및 지원자 조회
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
