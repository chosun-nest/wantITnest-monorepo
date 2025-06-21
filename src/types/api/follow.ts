// 팔로우 관련 API 타입들
export interface FollowUser {
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  memberIntroduce: string;
  memberIsStudent: boolean;
  followedAt: string;
}

export interface FollowUserListResponse {
  users: FollowUser[];
  totalCount: number;
  message: string;
}

export interface FollowRequestPayload {
  followingId: number;
}
