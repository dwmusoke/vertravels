'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-provider';
import { cn } from '@vertravels/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@vertravels/ui';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Wallet, 
  Settings, 
  LogOut,
  Plane,
  Hotel,
  Map,
  Car,
  FileText
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/account/dashboard', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/account/bookings', icon: Calendar },
  { name: 'Flights', href: '/account/bookings?module=flights', icon: Plane },
  { name: 'Hotels', href: '/account/bookings?module=hotels', icon: Hotel },
  { name: 'Tours', href: '/account/bookings?module=tours', icon: Map },
  { name: 'Cars', href: '/account/bookings?module=cars', icon: Car },
  { name: 'Visa', href: '/account/bookings?module=visa', icon: FileText },
  { name: 'Profile', href: '/account/profile', icon: User },
  { name: 'Wallet', href: '/account/wallet', icon: Wallet },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useSupabase();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.user_metadata?.fname || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 px-3 py-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href.split('?')[0]);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-3 border-t">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
