export interface Item {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
}

export interface TechStackResponse {
  techStackId: number;
  techStackName: string;
}

export interface ProfileType {
  memberId: number;
  name: string;
  email: string;
  major: string;
  introduce: string;
  //interests: string[];
  sns: string[];
  image: string;
  uploadedImagePath?: string;
  techStacks: string[];
}

export interface ProfileCardProps {
  profile: ProfileType;
  isOwnProfile: boolean;
  //targetUserId: number; // 다른 사용자 id 가져옴.
}
