import React from "react";

interface FileInputProps {
  ref: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ 
  ref, 
  onChange, 
  className = "" 
}) => {
  return (
    <input
      type="file"
      ref={ref}
      onChange={onChange}
      className={`hidden ${className}`}
      accept=".xlsx,.xls,.csv,.xlsm,.xlsb,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
    />
  );
};