import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerTravels - Modern Travel ERP",
  description: "Enterprise travel booking management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased overflow-x-hidden">
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
