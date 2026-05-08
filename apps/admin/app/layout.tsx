import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { AdminLayout } from "@/components/layout/admin-layout";

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
        <SupabaseProvider>
          <AdminLayout>{children}</AdminLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
}
