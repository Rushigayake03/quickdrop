import { useRoomStore } from "../../store/roomStore";
import { downloadFile } from "../../services/fileService";
import formatBytes from "../../utils/formatBytes";

export default function FileList() {
  const { files } = useRoomStore();

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
    <div className="bg-white p-6 rounded shadow border border-secondary-200 space-y-3">
      {files.map((file) => (
        <div
          key={file._id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p className="font-medium text-primary-900">{file.originalName}</p>
            <p className="text-sm text-secondary-400">
              {formatBytes(file.size)}
            </p>
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
