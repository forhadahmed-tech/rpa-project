import React from "react";

interface TableSummaryProps {
  sheetName: string;
  totalRows: number;
  filteredRows: number;
  currentPage: number;
  totalPages: number;
  hasSearch: boolean;
  className?: string;
}

export const TableSummary: React.FC<TableSummaryProps> = ({
  sheetName,
  totalRows,
  filteredRows,
  currentPage,
  totalPages,
  hasSearch,
  className = ""
}) => {
  return (
    <div className={`bg-gray-50 px-4 py-3 border border-gray-200 rounded-lg ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
        <div>
          Sheet: <span className="font-medium text-gray-800">{sheetName}</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <span>Total rows: <span className="font-medium">{totalRows}</span></span>
          {hasSearch && (
            <span>
              Filtered: <span className="font-medium">{filteredRows}</span>
            </span>
          )}
          <span>
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
        </div>
      </div>
    </div>
  );
};