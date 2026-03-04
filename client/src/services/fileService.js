import api from "./api";

const API_BASE = import.meta.env.VITE_API_URL;

/*
UPLOAD FILE
*/
export const uploadFile = async (roomId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomId", roomId);

  const { data } = await api.post("/files/upload", formData);

  return data;
};

/*
GET ROOM FILES
*/
export const getRoomFiles = async (roomId) => {
  const { data } = await api.get(`/files/${roomId}`);

  return data;
};

/*
DOWNLOAD FILE
*/
export const downloadFile = (fileId) => {
  window.open(`${API_BASE}/api/files/download/${fileId}`, "_blank");
};

/*
DELETE FILE
*/
export const deleteFileById = async (fileId) => {
  const { data } = await api.delete(`/files/${fileId}`);
  return data;
};