import { useRoomStore } from "../../store/roomStore";
import { downloadFile } from "../../services/fileService";
import formatBytes from "../../utils/formatBytes";
import { FaFilePdf, FaFileImage, FaFileAlt } from "react-icons/fa";

export default function FileList() {
  const { files } = useRoomStore();
  const getFileIcon = (mime) => {
    if (mime.includes("pdf")) return <FaFilePdf className="text-red-500" />;
    if (mime.includes("image")) return <FaFileImage className="text-green-600" />;
    return <FaFileAlt className="text-primary-600" />;
  };

  if (!files.length) {
    return (
      <div className="bg-white p-10 rounded shadow border border-secondary-200 text-center">
        <p className="text-primary-700 font-medium mb-2">
          No files uploaded yet
        </p>
        <p className="text-secondary-400 text-sm">
          Drag and drop files above to start sharing
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow duration-200 border border-secondary-200 space-y-3">
      {files.map((file) => (
        <div
          key={file._id}
          className="
            flex justify-between items-center
            bg-secondary-100
            px-4 py-3
            rounded
            hover:bg-secondary-200
            transition
          "
        >
          <div className="flex items-center gap-3">
            {getFileIcon(file.mimeType)}
            <div>
              <p className="font-medium text-primary-900">
                {file.originalName}
              </p>
              <p className="text-sm text-secondary-400">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          <button
            onClick={() => downloadFile(file._id)}
            className="px-4 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition"
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
