"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

import ExcelTable from "./ExcelTable";
import { LoaderIcon, UploadCloudIcon, XCircleIcon, XIcon } from "lucide-react";

// Types
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
  const [showSheetSelector, setShowSheetSelector] = useState<boolean>(false);
  const [isXLSXLoaded, setIsXLSXLoaded] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load XLSX library dynamically
  useEffect(() => {
    const loadXLSX = async () => {
      try {
        const XLSX = await import('xlsx');
        (window as any).XLSX = XLSX;
        setIsXLSXLoaded(true);
      } catch (err) {
        console.error("Failed to load XLSX library:", err);
        setError("Failed to load spreadsheet parser. Please refresh the page.");
      }
    };

    loadXLSX();
  }, []);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
      ];
      
      const isAllowedExtension = /\.(xlsx|xls|csv|xlsm|xlsb)$/i.test(selectedFile.name);

      if (allowedTypes.includes(selectedFile.type) || isAllowedExtension) {
        setFile(selectedFile);
        setStatus("idle");
        setError(null);
        setTableData(null);
        setAllSheets([]);
        setSelectedSheetIndex(0);
        setShowSheetSelector(false);
      } else {
        setError("Invalid file type. Please upload an Excel file (.xlsx, .xls, .csv)");
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
    setShowSheetSelector(false);
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
        cellDates: true 
      });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No worksheets found in the file.");
      }

      const sheets: SheetInfo[] = [];
      
      workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName];
        
        const range = worksheet['!ref'];
        if (!range) {
          console.warn(`Sheet "${sheetName}" is empty`);
          return;
        }

        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false
        });

        if (json && json.length > 0) {
          const nonEmptyRows = json.filter(row => 
            row.some(cell => cell !== null && cell !== "" && cell !== undefined)
          );

          if (nonEmptyRows.length > 0) {
            const headers = nonEmptyRows[0].map((h) => 
              h === null || h === undefined ? "" : String(h)
            );
            const rows = nonEmptyRows.slice(1);
            sheets.push({
              name: sheetName,
              data: { headers, rows, sheetName }
            });
          }
        }
      });

      if (sheets.length > 0) {
        setAllSheets(sheets);
        setTableData(sheets[0].data);
        setSelectedSheetIndex(0);
        setShowSheetSelector(sheets.length > 1);
        setStatus("success");
      } else {
        throw new Error("No readable data found in any worksheet.");
      }
    } catch (err) {
      console.error("File processing error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
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

  const getBorderColor = () => {
    if (isDragging) return "border-blue-500";
    switch (status) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  const getBackgroundColor = () => {
    if (isDragging) return "bg-blue-50";
    switch (status) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-white";
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const renderDropzoneContent = () => {
    if (!isXLSXLoaded) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-gray-600">
          <LoaderIcon className="w-16 h-16 animate-spin text-blue-500" />
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
          <p className="text-sm">Initializing spreadsheet parser</p>
        </div>
      );
    }

    if (status === "uploading") {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-gray-600">
          <LoaderIcon className="w-16 h-16 animate-spin text-blue-500" />
          <p className="text-xl font-semibold text-gray-700">Processing...</p>
          <p className="text-sm">Reading your spreadsheet, please wait.</p>
        </div>
      );
    }

    if (file) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-800 p-4">
          <div className="flex items-center w-full">
            <div className="shrink-0">
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
            </div>
            <div className="grow min-w-0 ml-4 text-left">
              <p className="text-base font-semibold truncate text-gray-800" title={file.name}>
                {file.name}
              </p>
              <p className="text-sm text-gray-600">
                {formatBytes(file.size)}
                {allSheets.length > 0 && ` • ${allSheets.length} sheet${allSheets.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="ml-4 shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="Remove file"
            >
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-gray-600">
        <div
          className={`transition-transform duration-300 ${
            isDragging ? "scale-110" : "scale-100"
          }`}
        >
          <UploadCloudIcon className="w-16 h-16 text-gray-500" />
        </div>
        <p className="text-xl font-semibold text-gray-700">
          <span className="text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm">XLSX, XLS, CSV, XLSM, XLSB files</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={triggerFileSelect}
        className={`relative w-full h-60 rounded-2xl border-2 border-dashed ${getBorderColor()} ${getBackgroundColor()} backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out ${
          !file && status !== "uploading" && isXLSXLoaded
            ? "cursor-pointer group hover:border-blue-500 hover:bg-blue-50"
            : "cursor-default"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          accept=".xlsx,.xls,.csv,.xlsm,.xlsb,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
        />
        {renderDropzoneContent()}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in text-center">
          <div className="flex items-center justify-center">
            <XCircleIcon className="w-5 h-5 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {showSheetSelector && allSheets.length > 1 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sheet:
          </label>
          <div className="flex flex-wrap gap-2">
            {allSheets.map((sheet, index) => (
              <button
                key={sheet.name}
                onClick={() => handleSheetChange(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer duration-200 ${
                  selectedSheetIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {file && !tableData && isXLSXLoaded && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleProcessFile}
            disabled={status === "uploading"}
            className="relative flex items-center justify-center px-8 py-3 rounded-full text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-lg shadow-blue-600/30 w-full sm:w-auto"
          >
            {status === "uploading" && (
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            )}
            {status === "uploading" ? "Processing..." : "Process File"}
          </button>
        </div>
      )}

      {tableData && (
        <div className="mt-6">
          {showSheetSelector && (
            <div className="mb-4 text-sm text-gray-600">
              Currently viewing: <span className="font-medium text-gray-800">{tableData.sheetName}</span>
            </div>
          )}
          <ExcelTable data={tableData} />
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;