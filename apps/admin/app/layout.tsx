import type { Metadata } from "next";
import "./globals.css";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata: Metadata = {
  title: "VerTravels Admin",
  description: "VerTravels Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
