import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  maxWidth = "max-w-xs" 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-full"
      >
        {children}
      </div>
      {showTooltip && (
        <div className={`absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg wrap-break-word ${maxWidth}`}>
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};