import { API } from "..";

export const createRoom = async (name: string) => {
  const res = await API.post(
    "/api/v1/chatting-room",
    { chattingRoomName: name },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const deleteRoom = async (roomId: string) => {
  const res = await API.delete(`/api/v1/chatting-room/${roomId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const enterRoom = async ({
  roomId,
  memberId,
}: {
  roomId: string;
  memberId: string;
}) => {
  const res = await API.post(
    `/api/v1/chatting-room-member/`,
    {
      chattingRoomId: roomId,
      memberId: memberId,
    },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const quitRoom = async ({
  roomId,
  memberId,
}: {
  roomId: string;
  memberId: string;
}) => {
  const res = await API.delete(`/api/v1/chatting-room-member`, {
    data: {
      chattingRoomId: roomId,
      memberId: memberId,
    },
    headers: { skipAuth: false },
  });
  return res.data;
};
