export interface Participant {
  id: number;
  name: string;
  role: "PM" | "Frontend" | "Backend";
  imageUrl?: string;
  followers?: number;
}

export const mockParticipants: Participant[] = [
  {
    id: 1,
    name: "이지혁",
    role: "PM",
    imageUrl: "/assets/images/profile1.png",
    followers: 22,
  },
  {
    id: 2,
    name: "윤금상",
    role: "Frontend",
    imageUrl: "/assets/images/profile2.png",
    followers: 19,
  },
  {
    id: 3,
    name: "김영은",
    role: "Frontend",
    followers: 20, // imageUrl 생략 → 기본 이미지 사용됨
  },
  {
    id: 4,
    name: "송채선",
    role: "Backend",
    imageUrl: "/assets/images/profile4.png",
    followers: 18,
  },
  {
    id: 5,
    name: "김채호",
    role: "Backend",
    imageUrl: "/assets/images/profile5.png",
    followers: 18,
  },
];