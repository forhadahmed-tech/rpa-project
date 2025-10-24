import React from "react";

interface SheetInfo {
  name: string;
  data: any;
}

interface SheetSelectorProps {
  sheets: SheetInfo[];
  selectedIndex: number;
  onSheetChange: (index: number) => void;
  className?: string;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({
  sheets,
  selectedIndex,
  onSheetChange,
  className = ""
}) => {
  if (sheets.length <= 1) return null;

  return (
    <div className={`mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Sheet:
      </label>
      <div className="flex flex-wrap gap-2">
        {sheets.map((sheet, index) => (
          <button
            key={sheet.name}
            onClick={() => onSheetChange(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedIndex === index
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {sheet.name}
          </button>
        ))}
      </div>
    </div>
  );
};