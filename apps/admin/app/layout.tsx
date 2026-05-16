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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
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
