"use client";

import { ActivityDashboard } from "@/components/ui/activity-dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to VerTravels Admin
        </h1>
        <p className="text-gray-600">
          Manage your travel agency operations from one place
        </p>
      </div>
      <ActivityDashboard />
    </div>
  );
}
