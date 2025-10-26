"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Pagination, TableCell, TableControls, TableSummary } from "../table";
import { SelectedRowsPanel } from "../table/SelectedRowsPanel";

interface TableData {
  headers: string[];
  rows: any[][];
  sheetName: string;
}

interface ExcelTableProps {
  data: TableData;
  className?: string;
  onRowSelection?: (selectedRows: any[][]) => void;
  enableRowSelection?: boolean;
}

const ExcelTable: React.FC<ExcelTableProps> = ({
  data,
  className = "",
  // onRowSelection,
  enableRowSelection = false,
}) => {
  const { headers, rows } = data;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any>(new Set());

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      row.some((cell) =>
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, endIndex);

  // Get selected rows data
  // const selectedRowsData = useMemo(() => {
  //   return Array.from(selectedRows).map((index: number) => rows[index]);
  // }, [selectedRows, rows]);

  // Notify parent when selection changes
  // useEffect(() => {
  //   onRowSelection?.(selectedRowsData);
  // }, [selectedRowsData, onRowSelection]);

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

  // Row selection handlers
  const handleRowSelect = (rowIndex: number) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowIndex)) {
        newSelection.delete(rowIndex);
      } else {
        newSelection.add(rowIndex);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      // Deselect all
      setSelectedRows(new Set());
    } else {
      // Select all filtered rows
      const allFilteredIndices = filteredRows.map((_, index) =>
        rows.indexOf(filteredRows[index])
      );
      setSelectedRows(new Set(allFilteredIndices));
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  // Check if all rows on current page are selected
  const isAllPageRowsSelected = useMemo(() => {
    if (currentRows.length === 0) return false;
    return currentRows.every((row, index) =>
      selectedRows.has(rows.indexOf(row))
    );
  }, [currentRows, selectedRows, rows]);

  // Check if some rows on current page are selected
  const isSomePageRowsSelected = useMemo(() => {
    if (currentRows.length === 0) return false;
    return currentRows.some((row, index) =>
      selectedRows.has(rows.indexOf(row))
    );
  }, [currentRows, selectedRows, rows]);

  const handleExport = (selectedRows: any[][]) => {
    // Export selected rows to CSV/Excel
  };


  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Selection Info Bar */}
      {enableRowSelection && selectedRows.size > 0 && (
        <SelectedRowsPanel
          selectedRows={selectedRows}
          onClearSelection={clearSelection}
          onExport={handleExport}
          rowData={data}
        />
      )}

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
              {enableRowSelection && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-12">
                  <input
                    type="checkbox"
                    checked={isAllPageRowsSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate =
                          isSomePageRowsSelected && !isAllPageRowsSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
              )}
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
            {currentRows.map((row, rowIndex) => {
              const absoluteRowIndex = rows.indexOf(row);
              const isSelected = selectedRows.has(absoluteRowIndex);

              return (
                <tr
                  key={absoluteRowIndex}
                  className={`hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  {enableRowSelection && (
                    <td className="px-4 py-3 border-b border-gray-100">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(absoluteRowIndex)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                  )}
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
                    Array.from({ length: headers.length - row.length }).map(
                      (_, index) => (
                        <td
                          key={`empty-${index}`}
                          className="px-4 py-3 text-sm text-gray-400 border-b border-gray-100"
                        >
                          -
                        </td>
                      )
                    )}
                </tr>
              );
            })}
            {currentRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + (enableRowSelection ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  {searchTerm
                    ? "No matching records found"
                    : "No data available in this sheet"}
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
