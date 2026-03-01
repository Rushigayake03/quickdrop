import api from "./api";

export const createRoom = async () => {
  const { data } = await api.post("/rooms/create");
  return data;
};

export const getRoomSize = async (roomId) => {
  const { data } = await api.get(`/rooms/${roomId}/size`);
  return data;
};