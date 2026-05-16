'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-provider';
import { redirect } from 'next/navigation';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';
import type { User } from '@supabase/supabase-js';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 rounded-lg bg-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAuthPage) {
    redirect('/login');
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="transition-all duration-300 ease-in-out" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <AdminHeader />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
