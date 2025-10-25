import React, { forwardRef } from "react";

interface FileInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onChange, className = "" }, ref) => {
    return (
      <input
        type="file"
        ref={ref}
        onChange={onChange}
        className={`hidden ${className}`}
        accept=".xlsx,.xls,.csv,.xlsm,.xlsb,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
      />
    );
  }
);

FileInput.displayName = "FileInput";