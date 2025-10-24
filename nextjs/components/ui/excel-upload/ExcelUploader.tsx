"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { FileDropzone } from "./FileDropzone";
import { SheetSelector } from "./SheetSelector";
import { ProcessButton } from "./ProcessButton";
import { ErrorMessage } from "./ErrorMessage";
import { FileInput } from "./FileInput";
import ExcelTable from "./ExcelTable";
import { SelectedRowsPanel } from "../table/SelectedRowsPanel";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface TableData {
  headers: string[];
  rows: any[][];
  sheetName: string;
}

interface SheetInfo {
  name: string;
  data: TableData;
}

const ExcelUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [allSheets, setAllSheets] = useState<SheetInfo[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  const [isXLSXLoaded, setIsXLSXLoaded] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load XLSX library dynamically
  useEffect(() => {
    const loadXLSX = async () => {
      try {
        const XLSX = await import("xlsx");
        (window as any).XLSX = XLSX;
        setIsXLSXLoaded(true);
      } catch (err) {
        console.error("Failed to load XLSX library:", err);
        setError("Failed to load spreadsheet parser. Please refresh the page.");
      }
    };

    loadXLSX();
  }, []);

  // Add this handler function
  const handleRowSelection = (selectedRows: any[][]) => {
    setSelectedRows(selectedRows);
    console.log("Selected rows:", selectedRows);
    // You can perform further operations with selectedRows here
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      ];

      const isAllowedExtension = /\.(xlsx|xls|csv|xlsm|xlsb)$/i.test(
        selectedFile.name
      );

      if (allowedTypes.includes(selectedFile.type) || isAllowedExtension) {
        setFile(selectedFile);
        setStatus("idle");
        setError(null);
        setTableData(null);
        setAllSheets([]);
        setSelectedSheetIndex(0);
      } else {
        setError(
          "Invalid file type. Please upload an Excel file (.xlsx, .xls, .csv)"
        );
        setFile(null);
        setStatus("error");
      }
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setError(null);
    setTableData(null);
    setAllSheets([]);
    setSelectedSheetIndex(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleProcessFile = async () => {
    if (!file || !isXLSXLoaded) return;

    setStatus("uploading");
    setError(null);
    setTableData(null);
    setAllSheets([]);
    setSelectedSheetIndex(0);

    try {
      const XLSX = (window as any).XLSX;

      const data = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(data, {
        type: "array",
        cellText: false,
        cellDates: true,
      });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No worksheets found in the file.");
      }

      const sheets: SheetInfo[] = [];

      workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName];

        const range = worksheet["!ref"];
        if (!range) {
          console.warn(`Sheet "${sheetName}" is empty`);
          return;
        }

        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
        });

        if (json && json.length > 0) {
          const nonEmptyRows = json.filter((row) =>
            row.some(
              (cell) => cell !== null && cell !== "" && cell !== undefined
            )
          );

          if (nonEmptyRows.length > 0) {
            const headers = nonEmptyRows[0].map((h) =>
              h === null || h === undefined ? "" : String(h)
            );
            const rows = nonEmptyRows.slice(1);
            sheets.push({
              name: sheetName,
              data: { headers, rows, sheetName },
            });
          }
        }
      });

      if (sheets.length > 0) {
        setAllSheets(sheets);
        setTableData(sheets[0].data);
        setSelectedSheetIndex(0);
        setStatus("success");
      } else {
        throw new Error("No readable data found in any worksheet.");
      }
    } catch (err) {
      console.error("File processing error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(
        `Failed to process file: ${errorMessage}. Please ensure it's a valid Excel file.`
      );
      setStatus("error");
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSheetChange = (index: number) => {
    setSelectedSheetIndex(index);
    setTableData(allSheets[index].data);
  };

  const triggerFileSelect = () => {
    if (status !== "uploading" && isXLSXLoaded) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <FileInput ref={fileInputRef} onChange={onFileChange} />

      <FileDropzone
        file={file}
        isDragging={isDragging}
        status={status}
        isXLSXLoaded={isXLSXLoaded}
        allSheets={allSheets}
        onFileSelect={triggerFileSelect}
        onRemoveFile={handleRemoveFile}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />

      <ErrorMessage error={error} />

      <SheetSelector
        sheets={allSheets}
        selectedIndex={selectedSheetIndex}
        onSheetChange={handleSheetChange}
      />

      <ProcessButton
        file={file}
        status={status}
        isXLSXLoaded={isXLSXLoaded}
        tableData={tableData}
        onProcess={handleProcessFile}
      />

      {tableData && (
        <div className="mt-6">
          {allSheets.length > 1 && (
            <div className="mb-4 text-sm text-gray-600">
              Currently viewing:{" "}
              <span className="font-medium text-gray-800">
                {tableData.sheetName}
              </span>
            </div>
          )}
          <ExcelTable
            data={tableData}
            enableRowSelection={true}
            onRowSelection={handleRowSelection}
          />
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
