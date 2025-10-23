"use client";

import { useState } from "react";
import { parseExcel } from "../../utils/excelParser";

export default function ExcelPage() {
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    try {
      const parsed = await parseExcel(file);
      setData(parsed);
    } catch (err) {
      console.error("Error parsing Excel:", err);
      alert("Failed to parse Excel file");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Excel</h1>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="mb-6 border border-gray-300 rounded p-2"
      />

      {data.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Password</th>
              <th className="border border-gray-300 px-4 py-2">Extra Data</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{row.userId}</td>
                <td className="border border-gray-300 px-4 py-2">{row.password}</td>
                <td className="border border-gray-300 px-4 py-2">{row.extraData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
