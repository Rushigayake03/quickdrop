import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../../services/fileService";
import { useRoomStore } from "../../store/roomStore";
import { useToast } from "../ui/Toast/ToastProvider";

const FileDropzone = () => {
  const { roomId } = useRoomStore();
  const { addToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!roomId) return;

    try {
      for (const file of acceptedFiles) {
        await uploadFile(roomId, file);
      }
      addToast("success", "File uploaded successfully");
    } catch (error) {
      addToast("error", error.response?.data?.message || "Upload failed");
    }
  }, [roomId]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-10 text-center rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition"
    >
      <input {...getInputProps()} />
      <p>Drag & drop files here, or click to select</p>
    </div>
  );
};

export default FileDropzone;