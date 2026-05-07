import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/Toaster";

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
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[260px] transition-all duration-300">
            <Navbar sidebarCollapsed={false} />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
