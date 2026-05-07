"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Flights", href: "/dashboard/flights", icon: Plane },
  { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { name: "Tours", href: "/dashboard/tours", icon: MapPin },
  { name: "Cars", href: "/dashboard/cars", icon: Car },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Agents", href: "/dashboard/agents", icon: UserCheck },
  { name: "Contacts", href: "/dashboard/contacts", icon: Mail },
  { name: "CRM", href: "/dashboard/crm", icon: Users },
  { name: "Mid-Office", href: "/dashboard/midoffice", icon: Briefcase },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { name: "Quotations", href: "/dashboard/quotations", icon: FileText },
  { name: "Itinerary", href: "/dashboard/itinerary", icon: Map },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
  {
    name: "Fare Optimization",
    href: "/dashboard/fare-optimization",
    icon: TrendingUp,
  },
  { name: "API Settings", href: "/dashboard/api", icon: Key },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  isActive
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
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
