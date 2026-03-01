import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../../services/fileService";
import { useRoomStore } from "../../store/roomStore";
import { useToast } from "../ui/Toast/ToastProvider";

const FileDropzone = () => {
  const { roomId } = useRoomStore();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!roomId) return;

    try {
      setUploading(true);

      for (const file of acceptedFiles) {
        await uploadFile(roomId, file);
      }

      addToast("success", "File uploaded successfully");
    } catch (error) {
      addToast("error", error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [roomId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transition-shadow duration-200
        ${isDragActive
          ? "border-primary-600 bg-secondary-200 scale-[1.02]"
          : "border-secondary-300 bg-white hover:bg-secondary-100"}
      `}
    >
      <input {...getInputProps()} />
      <p className="text-primary-800">
        {uploading ? "Uploading..." : "Drag & drop files here, or click to select"}
      </p>
    </div>
  );
};

export default FileDropzone;
