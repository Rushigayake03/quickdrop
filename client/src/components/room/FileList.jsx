import { useRoomStore } from "../../store/roomStore";
import { downloadFile } from "../../services/fileService";
import formatBytes from "../../utils/formatBytes";

export default function FileList() {
  const { files } = useRoomStore();

  if (!files.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-3">
      {files.map((file) => (
        <div
          key={file._id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p className="font-medium">{file.originalName}</p>
            <p className="text-sm text-gray-500">
              {formatBytes(file.size)}
            </p>
          </div>

          <button
            onClick={() => downloadFile(file._id)}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded"
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
}