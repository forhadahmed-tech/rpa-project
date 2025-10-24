import React from "react";
import { Download, Copy, Trash2 } from "lucide-react";

interface SelectedRowsPanelProps {
  selectedRows: any[][];
  onClearSelection: () => void;
  onExport?: (rows: any[][]) => void;
  onCopy?: (rows: any[][]) => void;
  className?: string;
}

export const SelectedRowsPanel: React.FC<SelectedRowsPanelProps> = ({
  selectedRows,
  onClearSelection,
  onExport,
  onCopy,
  className = ""
}) => {
  if (selectedRows.length === 0) return null;

  return (
    <div className={`flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-sm text-blue-700">
          <strong>{selectedRows.length}</strong> row{selectedRows.length !== 1 ? 's' : ''} selected
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={() => onExport(selectedRows)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          {onCopy && (
            <button
              onClick={() => onCopy(selectedRows)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelection}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Selection
        </button>
      </div>
    </div>
  );
};