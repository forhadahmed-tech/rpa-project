import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

export const metadata = {
  title: "RPA Project",
  description: "Excel upload and RPA dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="bg-gray-50 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}