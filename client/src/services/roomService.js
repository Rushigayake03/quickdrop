import api from "./api";

export const createRoom = async () => {
  const { data } = await api.post("/rooms/create");
  return data;
};