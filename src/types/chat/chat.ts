export type ChatMode = "following" | "chat" | "room";

export interface SimpleMemberProfile {
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  memberIntroduce: string;
  memberIsStudent: boolean;
}

export interface ChatRoomProfile {
  roomType: unknown;
  roomId: string;
  roomName: string;
  roomImageUrl?: string;
  lastActivity: string;
}
