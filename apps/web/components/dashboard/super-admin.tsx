"use client";

import {
  KpiCard,
  DashboardGrid,
  ChartWidget,
  ActivityItem,
  QuickActions,
} from "@/components/dashboard/widgets";
import {
  Plane,
  Hotel,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export function SuperAdminDashboard() {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$1,234,567",
      change: 12.5,
      icon: CreditCard,
      trend: "up" as const,
    },
    {
      title: "Active Bookings",
      value: "3,456",
      change: 8.2,
      icon: Plane,
      trend: "up" as const,
    },
    {
      title: "New Customers",
      value: "1,234",
      change: -2.1,
      icon: Users,
      trend: "down" as const,
    },
    {
      title: "GDS Transactions",
      value: "12,345",
      change: 15.3,
      icon: TrendingUp,
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <DashboardGrid>
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </DashboardGrid>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <ChartWidget title="Revenue Analytics" subtitle="Last 30 days">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Revenue chart will appear here
                </p>
              </div>
            </div>
          </ChartWidget>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Pending Invoices */}
          <ChartWidget title="Pending Invoices" subtitle="3 invoices overdue">
            <div className="space-y-3">
              {[1, 2, 3].map((inv) => (
                <div
                  key={inv}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">INV-2024-00{inv}</p>
                    <p className="text-xs text-muted-foreground">
                      Due 5 days ago
                    </p>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}
            </div>
          </ChartWidget>

          {/* System Alerts */}
          <ChartWidget title="System Alerts" subtitle="2 unresolved">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-xs">GDS sync delay detected</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs">New agent registration pending</span>
              </div>
            </div>
          </ChartWidget>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <ChartWidget title="Recent Bookings" subtitle="Last 5 transactions">
          <div className="space-y-1">
            {[
              {
                ref: "VT-001",
                customer: "John Doe",
                amount: "$1,234",
                status: "confirmed",
              },
              {
                ref: "VT-002",
                customer: "Jane Smith",
                amount: "$2,567",
                status: "pending",
              },
              {
                ref: "VT-003",
                customer: "Bob Wilson",
                amount: "$890",
                status: "confirmed",
              },
              {
                ref: "VT-004",
                customer: "Alice Brown",
                amount: "$3,456",
                status: "cancelled",
              },
              {
                ref: "VT-005",
                customer: "Charlie Davis",
                amount: "$1,100",
                status: "confirmed",
              },
            ].map((booking) => (
              <ActivityItem
                key={booking.ref}
                title={`${booking.ref} - ${booking.customer}`}
                description={`Amount: ${booking.amount}`}
                time="2 hours ago"
                icon={CheckCircle}
              />
            ))}
          </div>
        </ChartWidget>

        {/* Top Destinations */}
        <ChartWidget title="Top Destinations" subtitle="By booking volume">
          <div className="space-y-3">
            {[
              { dest: "Dubai (DXB)", bookings: 456, percentage: 85 },
              { dest: "London (LHR)", bookings: 389, percentage: 72 },
              { dest: "New York (JFK)", bookings: 345, percentage: 64 },
              { dest: "Paris (CDG)", bookings: 298, percentage: 55 },
            ].map((item) => (
              <div key={item.dest}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.dest}</span>
                  <span className="text-muted-foreground">
                    {item.bookings} bookings
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </ChartWidget>
      </div>

      {/* Quick Actions */}
      <QuickActions>
        <Button className="h-auto py-3 flex-col gap-2" variant="outline">
          <Plane className="h-5 w-5" />
          <span className="text-xs">New Booking</span>
        </Button>
        <Button className="h-auto py-3 flex-col gap-2" variant="outline">
          <FileText className="h-5 w-5" />
          <span className="text-xs">Create Invoice</span>
        </Button>
        <Button className="h-auto py-3 flex-col gap-2" variant="outline">
          <Users className="h-5 w-5" />
          <span className="text-xs">Add Agent</span>
        </Button>
        <Button className="h-auto py-3 flex-col gap-2" variant="outline">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">View Reports</span>
        </Button>
      </QuickActions>
    </div>
  );
}
