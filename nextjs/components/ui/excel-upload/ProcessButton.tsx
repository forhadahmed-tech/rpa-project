import React from "react";
import { LoaderIcon } from "lucide-react";

interface ProcessButtonProps {
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
  isXLSXLoaded: boolean;
  tableData: any;
  onProcess: () => void;
  className?: string;
}

export const ProcessButton: React.FC<ProcessButtonProps> = ({
  file,
  status,
  isXLSXLoaded,
  tableData,
  onProcess,
  className = "",
}) => {
  if (!file || tableData || !isXLSXLoaded) return null;

  return (
    <div className={`mt-6 flex justify-center ${className}`}>
      <button
        onClick={onProcess}
        disabled={status === "uploading"}
        className="relative flex items-center cursor-pointer justify-center px-8 py-3 rounded-full text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-lg shadow-blue-600/30 w-full sm:w-auto"
      >
        {status === "uploading" && (
          <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        )}
        {status === "uploading" ? "Processing..." : "Process File"}
      </button>
    </div>
  );
};
