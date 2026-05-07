"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Package,
  Car,
  FileText,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Globe,
  CreditCard,
  Shield,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Flights", href: "/flights", icon: Plane, badge: "12" },
      { name: "Hotels", href: "/hotels", icon: Hotel },
      { name: "Tours", href: "/tours", icon: Package },
      { name: "Cars", href: "/cars", icon: Car },
    ],
  },
  {
    section: "Business",
    items: [
      { name: "Bookings", href: "/bookings", icon: FileText, badge: "3" },
      { name: "Invoices", href: "/invoices", icon: CreditCard },
      { name: "Customers", href: "/crm", icon: Users },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-sidebar-foreground" />
            <span className="font-bold text-lg text-sidebar-foreground">
              VerTravels
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {menuItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium sidebar-active"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Agent
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
