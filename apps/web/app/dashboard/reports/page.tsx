"use client";

import { BarChart3, Download, Calendar } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$45,230", change: "+12%" },
  { label: "Total Bookings", value: "156", change: "+8%" },
  { label: "Active Customers", value: "89", change: "+5%" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.5%" },
];

const monthlyData = [
  { month: "Jan", revenue: "$3,200", bookings: 12 },
  { month: "Feb", revenue: "$4,100", bookings: 18 },
  { month: "Mar", revenue: "$3,800", bookings: 15 },
  { month: "Apr", revenue: "$5,200", bookings: 22 },
  { month: "May", revenue: "$4,500", bookings: 19 },
  { month: "Jun", revenue: "$6,100", bookings: 28 },
];

export default function ReportsPage() {
  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-green-600">
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="h-64 flex items-end gap-2">
            {monthlyData.map((d) => (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-sky-600 rounded-t"
                  style={{
                    height: `${(parseInt(d.revenue.replace("$", "")) / 6100) * 100}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
