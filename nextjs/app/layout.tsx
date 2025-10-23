import Sidebar from "../components/Sidebar";
import "./globals.css";

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
      <body className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
