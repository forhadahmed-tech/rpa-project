import React from "react";
import { Tooltip } from "../tooltip/Tooltip";

interface TableCellProps {
  content: string;
  truncateLength?: number;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ 
  content, 
  truncateLength = 80,
  className = ""
}) => {
  const displayContent = content || "";
  const shouldTruncate = displayContent.length > truncateLength;
  const displayText = shouldTruncate 
    ? displayContent.substring(0, truncateLength) + "..." 
    : displayContent;

  if (shouldTruncate) {
    return (
      <Tooltip content={displayContent}>
        <div className={`truncate ${className}`} title={displayContent}>
          {displayText}
        </div>
      </Tooltip>
    );
  }

  return (
    <div className={`truncate ${className}`} title={displayContent}>
      {displayText}
    </div>
  );
};