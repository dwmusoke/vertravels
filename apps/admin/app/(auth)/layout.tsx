import { SupabaseProvider } from "@/components/providers/supabase-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}
