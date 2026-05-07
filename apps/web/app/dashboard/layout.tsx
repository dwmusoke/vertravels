"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  Home,
  Calendar,
  Users,
  UserCheck,
  Settings,
  Key,
  DollarSign,
  BarChart3,
  Mail,
  FileText,
  CreditCard,
  Map,
  Receipt,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Building2,
  Globe,
  Wallet,
  UsersRound,
  UserCircle,
  PlaneTakeoff,
  Ticket,
} from "lucide-react";

interface MenuGroup {
  title: string;
  icon: any;
  items: { name: string; href: string; icon: any }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Operations",
    icon: PlaneTakeoff,
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
      { name: "Itinerary", href: "/dashboard/itinerary", icon: Map },
    ],
  },
  {
    title: "Inventory",
    icon: Plane,
    items: [
      { name: "Flights", href: "/dashboard/flights", icon: Plane },
      { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
      { name: "Tours", href: "/dashboard/tours", icon: MapPin },
      { name: "Cars", href: "/dashboard/cars", icon: Car },
    ],
  },
  {
    title: "Customers",
    icon: UsersRound,
    items: [
      { name: "Contacts", href: "/dashboard/contacts", icon: Mail },
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Agents", href: "/dashboard/agents", icon: UserCheck },
      { name: "CRM", href: "/dashboard/crm", icon: UserCircle },
    ],
  },
  {
    title: "Partners",
    icon: Globe,
    items: [
      {
        name: "IATA Agents",
        href: "/dashboard/partners/iata",
        icon: Building2,
      },
      { name: "Non-IATA", href: "/dashboard/partners/non-iata", icon: Users },
      { name: "Suppliers", href: "/dashboard/partners/suppliers", icon: Key },
      { name: "APIs", href: "/dashboard/api", icon: Globe },
    ],
  },
  {
    title: "Sales",
    icon: DollarSign,
    items: [
      { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
      { name: "Quotations", href: "/dashboard/quotations", icon: FileText },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    items: [
      { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Credit Control", href: "/dashboard/credit", icon: CreditCard },
      { name: "BSP Reconciliation", href: "/dashboard/bsp", icon: Ticket },
    ],
  },
  {
    title: "Control",
    icon: Briefcase,
    items: [
      { name: "Mid-Office", href: "/dashboard/midoffice", icon: Briefcase },
      {
        name: "Fare Optimization",
        href: "/dashboard/fare-optimization",
        icon: TrendingUp,
      },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white fixed left-0 top-0 bottom-0 z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-sky-400" />
            <div>
              <span className="font-bold text-lg">VerTravels</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100vh-140px)]">
          {menuGroups.map((group) => {
            const isExpanded = expandedGroups[group.title] !== false;

            return (
              <div key={group.title} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-400 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {group.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-2 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                            isActive
                              ? "bg-sky-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">admin@vertravels.com</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="ml-64 flex-1">{children}</div>
    </div>
  );
}
