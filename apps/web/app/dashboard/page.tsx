"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  LogOut,
  Home,
  Calendar,
  Users,
  UserCheck,
  Settings,
  Key,
  Menu,
  X,
  DollarSign,
  BarChart3,
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
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
  { name: "API Settings", href: "/dashboard/api", icon: Key },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem] = useState("Dashboard");

  const user = {
    name: "Admin",
    email: "admin@vertravels.com",
    role: "Admin",
  };

  const stats = [
    {
      label: "Total Bookings",
      value: "156",
      icon: Calendar,
      color: "bg-sky-100 text-sky-600",
    },
    {
      label: "Hotels Booked",
      value: "89",
      icon: Hotel,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Flights",
      value: "67",
      icon: Plane,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Revenue",
      value: "$12,450",
      icon: DollarSign,
      color: "bg-violet-100 text-violet-600",
    },
  ];

  const recentBookings = [
    {
      id: "VT-001",
      type: "Flight",
      route: "EBB → LON",
      date: "May 15, 2026",
      status: "Confirmed",
      amount: "$1,234",
    },
    {
      id: "VT-002",
      type: "Hotel",
      route: "Dubai",
      date: "May 18, 2026",
      status: "Pending",
      amount: "$567",
    },
    {
      id: "VT-003",
      type: "Tour",
      route: "Safari",
      date: "May 20, 2026",
      status: "Confirmed",
      amount: "$890",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 fixed left-0 top-0 bottom-0 z-50 overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-sky-400" />
            {sidebarOpen && (
              <div>
                <span className="font-bold text-lg">VerTravels</span>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeItem === item.name
                  ? "bg-sky-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center">
              <span className="text-sm font-bold">{user.name[0]}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Dashboard Overview
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "New Booking", href: "/flights", icon: Plane },
              { name: "Add Hotel", href: "/hotels", icon: Hotel },
              { name: "View Tours", href: "/tours", icon: MapPin },
              { name: "Car Rental", href: "/cars", icon: Car },
            ].map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-center"
              >
                <action.icon className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {action.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                href="/dashboard/bookings"
                className="text-sm text-sky-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.route}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
