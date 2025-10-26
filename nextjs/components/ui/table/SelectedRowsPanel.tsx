import React from "react";
import { Download, Copy, Trash2 } from "lucide-react";
import RobotButton from "../button/RobotButton";
import toast from "react-hot-toast";

interface SelectedRowsPanelProps {
  selectedRows: Set<number>;
  rowData: any;
  onClearSelection: () => void;
  onExport?: (rows: any[][]) => void;
  onCopy?: (rows: any[][]) => void;
  onSave?: (rows: any[][]) => void;
  className?: string;
}

export const SelectedRowsPanel: React.FC<SelectedRowsPanelProps> = ({
  selectedRows,
  rowData,
  onClearSelection,
  onExport,
  className = "",
}) => {
  if (selectedRows.size === 0) return null;

  // Get the actual selected row data
  const getSelectedRowData = (): any[][] => {
    return Array.from(selectedRows).map((index) => rowData[index]);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(getSelectedRowData());
    }
  };

  // const handleCopy = () => {
  //   if (onCopy) {
  //     onCopy(getSelectedRowData());
  //   }
  // };

  const handleSaveSelectedRows = async () => {
    if (!selectedRows || selectedRows.size === 0) {
      toast.dismiss("Please select at least one row first.!");
      return;
    }

    try {
      const headers = rowData?.headers;
      if (!headers) return;

      // Convert selected row indices to actual row data
      const selectedRowData = Array.from(selectedRows).map(
        (index) => rowData?.rows[index]
      );

      const dataRows = selectedRowData.map((rowArray: any[]) => {
        const rowObject: Record<string, any> = {};
        headers.forEach((header, index) => {
          rowObject[header] = rowArray[index];
        });
        return rowObject;
      });

      const response = await fetch("/api/excel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRows),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`${result.count} record(s) saved successfully!`);
      } else {
        toast.error(`Failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      toast.error(`Error: ${err || "Error saving data"}`);
    }
  };

  const handleProceedForProcessing = async () => {
    if (!selectedRows || selectedRows.size === 0) {
      toast.dismiss("Please select at least one row first.!");
      
      return;
    }

    try {
      const headers = rowData?.headers;
      if (!headers) return;

      // Convert selected row indices to actual row data
      const selectedRowData = Array.from(selectedRows).map(
        (index) => rowData?.rows[index]
      );

      const dataRows = selectedRowData.map((rowArray: any[]) => {
        const rowObject: Record<string, any> = {};
        headers.forEach((header, index) => {
          rowObject[header] = rowArray[index];
        });
        return rowObject;
      });

      const response = await fetch("/api/excel/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRows),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Selected rows queued for processing!");
        onClearSelection();
      } else {
        toast.error(`Failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      toast.error(`Error: ${err || "Error while queuing data for processing"}`);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="text-sm text-blue-700">
          <strong>{selectedRows.size}</strong> row
          {selectedRows.size !== 1 ? "s" : ""} selected
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={handleExport}
              className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          {/* {onCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center cursor-pointer gap-1 px-3 py-1 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )} */}
          <button
            onClick={handleSaveSelectedRows}
            className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
          >
            Save Selected Rows
          </button>
          <RobotButton onClick={handleProceedForProcessing} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelection}
          className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Selection
        </button>
      </div>
    </div>
  );
};
