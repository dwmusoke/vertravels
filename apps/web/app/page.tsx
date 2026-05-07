"use client";

import { SuperAdminDashboard } from "@/components/dashboard/super-admin";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-[260px] transition-all duration-300">
        <Navbar sidebarCollapsed={false} />
        <main className="p-6">
          <SuperAdminDashboard />
        </main>
      </div>
    </div>
  );
}
