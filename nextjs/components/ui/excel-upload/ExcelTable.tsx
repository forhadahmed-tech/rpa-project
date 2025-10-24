
import React, { useState, useMemo } from "react";
import { Pagination, TableCell, TableControls, TableSummary } from "../table";

interface TableData {
  headers: string[];
  rows: any[][];
  sheetName: string;
}

interface ExcelTableProps {
  data: TableData;
  className?: string;
}

const ExcelTable: React.FC<ExcelTableProps> = ({ data, className = "" }) => {
  const { headers, rows } = data;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    
    return rows.filter(row => 
      row.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Search and Controls */}
      <TableControls
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Table */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap"
                >
                  <TableCell 
                    content={header || `Column ${index + 1}`}
                    className="max-w-[200px] font-medium"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100 max-w-[300px]"
                  >
                    <TableCell content={String(cell || "")} />
                  </td>
                ))}
                {/* Fill empty cells if row has fewer columns than headers */}
                {row.length < headers.length &&
                  Array.from({ length: headers.length - row.length }).map((_, index) => (
                    <td
                      key={`empty-${index}`}
                      className="px-4 py-3 text-sm text-gray-400 border-b border-gray-100"
                    >
                      -
                    </td>
                  ))
                }
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  {searchTerm ? "No matching records found" : "No data available in this sheet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredRows.length}
        itemsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Summary */}
      <TableSummary
        sheetName={data.sheetName}
        totalRows={rows.length}
        filteredRows={filteredRows.length}
        currentPage={currentPage}
        totalPages={totalPages}
        hasSearch={!!searchTerm}
      />
    </div>
  );
};

export default ExcelTable;