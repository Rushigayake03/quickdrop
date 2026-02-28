import api from "./api";

export const uploadFile = async (roomId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomId", roomId);

  const { data } = await api.post("/files/upload", formData);
  return data;
};

export const getRoomFiles = async (roomId) => {
  const { data } = await api.get(`/files/${roomId}`);
  return data;
};

export const downloadFile = (fileId) => {
  window.open(`http://localhost:5000/api/files/download/${fileId}`, "_blank");
};