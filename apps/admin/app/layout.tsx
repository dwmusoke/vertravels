import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdminLayout } from "@/components/layout/admin-layout";

export const metadata: Metadata = {
  title: "VerTravels Operations",
  description: "Travel Operations Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body>
        <SupabaseProvider>
          <ThemeProvider>
            <AdminLayout>
              {children}
            </AdminLayout>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
