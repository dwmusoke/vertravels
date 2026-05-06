import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { AccountLayout } from '@/components/layout/account-layout';
import { DashboardStats } from '@/components/account/dashboard-stats';
import { RecentBookings } from '@/components/account/recent-bookings';
import { QuickActions } from '@/components/account/quick-actions';

export default async function AccountDashboardPage() {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.user_metadata?.fname || user.email}!
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Recent Bookings & Quick Actions */}
        <div className="grid gap-4 md:grid-cols-7">
          <RecentBookings />
          <QuickActions />
        </div>
      </div>
    </AccountLayout>
  );
}
