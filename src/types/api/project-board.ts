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
  projects: ProjectSummary[]; // ✅ Swagger 응답 필드 명세 반영
  totalCount: number;
  pageInfo: PageInfo;
}

// ==================================
// 🔍 GET /api/projects/{projectId} - 상세 조회
// ==================================

export interface ProjectMember {
  part: "FRONTEND" | "BACKEND" | "PM";
  role: "MEMBER" | "LEADER";
  memberId: number | null;
  memberName: string | null;
}

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
  projectMembers: ProjectMember[];
  isRecruiting: boolean;
  currentNumberOfMembers: number;
  maximumNumberOfMembers: number;
}

// ==================================
// 🟢 POST /api/v1/projects/new - 프로젝트 생성
// ==================================

export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription?: string;
  isRecruiting: boolean;
  tags?: string[];
  partCounts: {
    [key: string]: number; // 예: FRONTEND: 2, BACKEND: 1
  };
  creatorPart: string;     // 예: "FRONTEND"
  creatorRole: string;     // 예: "LEADER"
}

export interface CreateProjectPostResponse {
  projectId: number;
  message: string;
}

// ==================================
// 📝 PATCH /api/v1/projects/{projectId} - 프로젝트 수정
// ==================================

export interface UpdateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  isRecruiting: boolean;
  tags: string[];
  partCounts?: {
    [key: string]: number;
  }; 
}

// ==================================
// 📝 PATCH /api/v2/projects/{projectId} - 프로젝트 수정
// ==================================

export interface UpdateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  isRecruiting: boolean;
  tags: string[];
  partCounts?: {
    [key: string]: number;
  }; 
  imageUrls?: string[] | null;
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
  status: "accepted" | "rejected" | "pending";
}
