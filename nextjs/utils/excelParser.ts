import ExcelJS from "exceljs";

export async function parseExcel(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  const rows: any[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    rows.push({
      userId: row.getCell(1).value?.toString() || "",
      password: row.getCell(2).value?.toString() || "",
      extraData: row.getCell(3).value?.toString() || "",
    });
  });

  return rows;
}
