import { CheckCircleIcon, XIcon } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  progress: number;
  status: UploadStatus;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  progress,
  status,
}) => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const getProgressColor = () => {
    if (status === "success") return "bg-green-500";
    if (status === "error") return "bg-red-500";
    return "bg-blue-500";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 bg-gray-800/60 rounded-lg animate-fade-in">
      <div className="flex items-center w-full">
        <div className="shrink-0">
          {status === "success" ? (
            <CheckCircleIcon className="w-12 h-12 text-green-400" />
          ) : (
            <svg
              className="w-12 h-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
            >
              <path
                fill="#4CAF50"
                d="M29,2H11C9.895,2,9,2.895,9,4v42c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V13L29,2z"
              />
              <path fill="#AED581" d="M29,2v11h11L29,2z" />
              <path
                fill="#DCEDC8"
                d="M15.422,23.387c-0.344-0.613-0.959-1.041-1.723-1.041c-1.12,0-1.805,0.812-1.805,1.932c0,1.164,0.781,1.82,1.867,1.82c0.758,0,1.312-0.348,1.684-0.898l-1.09-0.656c-0.184,0.344-0.465,0.527-0.66,0.527c-0.5,0-0.793-0.355-0.793-0.902c0-0.531,0.301-0.84,0.832-0.84c0.23,0,0.477,0.141,0.688,0.441L15.422,23.387z M20.354,26.105c-0.211,0.355-0.5,0.539-0.852,0.539c-0.598,0-0.941-0.395-0.941-1.23c0-1.586,1.008-2.227,1.965-2.227c0.418,0,0.762,0.109,1.012,0.316l-0.5,0.828c-0.168-0.121-0.375-0.187-0.543-0.187c-0.531,0-0.82,0.355-0.82,1.078c0,0.676,0.25,1.031,0.852,1.031c0.293,0,0.535-0.133,0.715-0.422L20.354,26.105z M24.363,24.16c0,1.539-0.887,2.402-2.219,2.402c-1.332,0-2.215-0.887-2.215-2.434c0-1.547,0.867-2.371,2.215-2.371C23.496,21.758,24.363,22.621,24.363,24.16z M22.992,24.18c0-0.852-0.309-1.328-0.848-1.328c-0.535,0-0.848,0.48-0.848,1.34c0,0.855,0.312,1.328,0.848,1.328C22.684,25.52,22.992,25.035,22.992,24.18z M26.652,23.336h-0.984l-0.215,0.801h-1.219l1.328-4.949h1.363l1.348,4.949h-1.246L26.652,23.336z M26.43,22.629l-0.41-1.574l-0.41,1.574H26.43z M29.18,22.844c-0.211-0.141-0.48-0.215-0.789-0.215c-0.512,0-0.801,0.301-0.801,0.742c0,0.363,0.23,0.598,0.66,0.742l0.57,0.187c0.609,0.199,1.02,0.473,1.02,1.109c0,0.82-0.66,1.312-1.637,1.312c-0.82,0-1.422-0.348-1.742-0.656l0.688-0.855c0.32,0.25,0.715,0.43,1.074,0.43c0.5,0,0.852-0.281,0.852-0.758c0-0.418-0.25-0.66-0.723-0.801l-0.504-0.152c-0.547-0.168-0.961-0.457-0.961-1.074c0-0.68,0.543-1.18,1.453-1.18c0.66,0,1.156,0.223,1.48,0.48L29.18,22.844z"
              />
            </svg>
          )}
        </div>
        <div className="grow min-w-0 ml-4 text-left">
          <p className="text-base font-semibold truncate">{file.name}</p>
          <p className="text-sm text-gray-400">{formatBytes(file.size)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-4 shrink-0 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Remove file"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {(status === "uploading" || status === "success") && (
        <div className="w-full mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor()} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-400 mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
