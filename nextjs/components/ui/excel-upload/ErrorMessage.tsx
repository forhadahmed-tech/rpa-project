import React from "react";
import { XCircleIcon } from "lucide-react";

interface ErrorMessageProps {
  error: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  className = "" 
}) => {
  if (!error) return null;

  return (
    <div className={`mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in text-center ${className}`}>
      <div className="flex items-center justify-center">
        <XCircleIcon className="w-5 h-5 mr-2 shrink-0" />
        <span>{error}</span>
      </div>
    </div>
  );
};