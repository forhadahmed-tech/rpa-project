import "./globals.css";
import ToasterProvider from "./providers/ToasterProvider";

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
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
