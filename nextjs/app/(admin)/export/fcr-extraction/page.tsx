import ExcelUploader from "../../../../components/ui/excel-upload/ExcelUploader";

export default function FcrExtractionPage() {
  return (
    <div className="min-h-screen w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] text-gray-900 flex flex-col items-center justify-center p-4 antialiased">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-green-600 via-blue-600 to-purple-600">
          Excel File Uploader
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Drag and drop your spreadsheet below. We support .xlsx, .xls, and .csv
          files.
        </p>
      </div>
      <ExcelUploader />
    </div>
  );
}