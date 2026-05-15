"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from '@vertravels/ui';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BookOpen,
  RefreshCcw,
  Building2,
  MapPin,
  Compass,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Upload,
  Clock,
  Ticket,
  Zap,
  CreditCard,
  Sliders,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Bookings", href: "/bookings", icon: FileText },
  {
    name: "Operations",
    href: "#",
    icon: RefreshCcw,
    children: [
      { name: "PNR Ingestion", href: "/pnr-ingestion", icon: Upload },
      { name: "Manual Postings", href: "/manual-postings", icon: FileText },
      { name: "Queue Management", href: "/queue", icon: Clock },
      { name: "Ticketing", href: "/ticketing", icon: Ticket },
      { name: "Automation", href: "/automation", icon: Zap },
      { name: "Vouchers & Manifests", href: "/vouchers-manifests", icon: FileText },
    ],
  },
  {
    name: "Documents",
    href: "#",
    icon: FileCheck,
    children: [
      { name: "Invoices", href: "/documents/invoices", icon: FileText },
      { name: "Quotations", href: "/documents/quotations", icon: FileCheck },
      { name: "Receipts", href: "/documents/receipts", icon: CreditCard },
      { name: "Payments", href: "/documents/payments", icon: CreditCard },
      { name: "Statements", href: "/documents/statements", icon: FileText },
      { name: "Daily Sales Reports", href: "/documents/daily-sales", icon: Upload },
    ],
  },
  { name: "Suppliers", href: "/suppliers", icon: Building2 },
  { name: "Partnerships", href: "/partnerships", icon: Users },
  { name: "Agencies", href: "/agencies", icon: Building2 },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Reconciliation", href: "/reconciliation", icon: RefreshCcw },
  { name: "Unused Tickets", href: "/unused-tickets", icon: Ticket },
  { name: "Fare Optimization", href: "/fare-optimization", icon: Sliders },
  { name: "Agency Insights", href: "/agency-insights", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Modules", href: "/modules", icon: Sliders },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 border-r bg-card min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">V</span>
          </div>
          <div>
            <p className="font-bold">VerTravels</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.name);
          const hasChildren = item.children && item.children.length > 0;

          if (hasChildren) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive =
                        pathname === child.href ||
                        pathname.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isChildActive
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <child.icon className="mr-3 h-3 w-3" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Module Status */}
      <div className="p-3 border-t mt-auto">
        <div className="text-xs font-medium text-muted-foreground px-3 py-2">
          Active Modules
        </div>
        <div className="space-y-2 px-3">
          {["Flights", "Hotels", "Tours", "Cars"].map((module) => (
            <div key={module} className="flex items-center justify-between">
              <span className="text-xs">{module}</span>
              <span className="h-2 w-2 rounded-full bg-green-600" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
