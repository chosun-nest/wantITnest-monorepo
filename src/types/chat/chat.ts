export type ChatMode = "following" | "chat" | "room";

export interface SimpleMemberProfile {
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  memberIntroduce: string;
  memberIsStudent: boolean;
}

export interface ChatRoomProfile {
  roomId: string;
  roomName: string;
  roomImageUrl?: string;
}
