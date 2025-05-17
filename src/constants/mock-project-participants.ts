// constants/mock-project-participants.ts

import { Participant } from "../types/participant";

export const mockParticipants: Participant[] = [
  {
    id: 1,
    name: "김영은",
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
    id: 4,
    name: "김채호",
    role: "Backend",
    imageUrl: "/assets/images/profile4.png",
    followers: 18,
  },
];