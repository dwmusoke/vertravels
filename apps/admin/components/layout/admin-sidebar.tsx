"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@vertravels/ui";
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Map,
  Car,
  Users,
  CreditCard,
  Settings,
  Key,
  FileText,
  Globe,
  Mail,
  BookOpen,
  Shield,
  RefreshCcw,
  TrendingUp,
  Building2,
  MapPin,
  Compass,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Upload,
  Clock,
  Ticket,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: FileText },
  {
    name: "Operations",
    href: "/admin/operations",
    icon: RefreshCcw,
    children: [
      { name: "PNR Ingestion", href: "/admin/pnr-ingestion", icon: Upload },
      { name: "Manual Postings", href: "/admin/manual-postings", icon: FileText },
      { name: "Queue Management", href: "/admin/queue", icon: Clock },
      { name: "Ticketing", href: "/admin/ticketing", icon: Ticket },
    ],
  },
  {
    name: "Documents",
    href: "/admin/documents",
    icon: FileCheck,
    children: [
      { name: "Invoices", href: "/admin/documents/invoices", icon: FileText },
      { name: "Quotations", href: "/admin/documents/quotations", icon: FileCheck },
      { name: "Receipts", href: "/admin/documents/receipts", icon: CreditCard },
      { name: "Statements", href: "/admin/documents/statements", icon: FileText },
    ],
  },
  { name: "Reconciliation", href: "/admin/reconciliation", icon: RefreshCcw },
  { name: "IATA Tracking", href: "/admin/iata-tracking", icon: Building2 },
  { name: "Daily Sales", href: "/admin/daily-sales", icon: TrendingUp },
  { name: "Agency Insights", href: "/admin/agency-insights", icon: TrendingUp },
  { name: "Partnerships", href: "/admin/partnerships", icon: Users },
  {
    name: "Content",
    href: "/admin/content",
    icon: BookOpen,
    children: [
      { name: "Destinations", href: "/admin/destinations", icon: MapPin },
      {
        name: "Tour Categories",
        href: "/admin/tour-categories",
        icon: Compass,
      },
    ],
  },
  { name: "Flights", href: "/admin/modules/flights", icon: Plane },
  { name: "Hotels", href: "/admin/modules/hotels", icon: Hotel },
  { name: "Tours", href: "/admin/modules/tours", icon: Map },
  { name: "Cars", href: "/admin/modules/cars", icon: Car },
  { name: "Visa", href: "/admin/modules/visa", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "API Management", href: "/admin/api-management", icon: Key },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Languages", href: "/admin/languages", icon: Globe },
  { name: "Email Templates", href: "/admin/email", icon: Mail },
  { name: "CMS Pages", href: "/admin/cms", icon: BookOpen },
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
        <Link href="/admin" className="flex items-center space-x-2">
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
