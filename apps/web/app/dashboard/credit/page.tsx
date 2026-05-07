"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  CreditCard,
  DollarSign,
  User,
} from "lucide-react";

interface CreditAccount {
  id: string;
  customer: string;
  company: string;
  email: string;
  phone: string;
  creditLimit: number;
  used: number;
  available: number;
  status: "active" | "suspended" | "blocked";
  paymentDays: number;
  lastPayment: string;
  overdue: number;
}

const creditAccounts: CreditAccount[] = [
  {
    id: "CR001",
    customer: "John Smith",
    company: "Kampala Corp Ltd",
    email: "john@kampalacorp.com",
    phone: "+256 701 111111",
    creditLimit: 10000,
    used: 4500,
    available: 5500,
    status: "active",
    paymentDays: 30,
    lastPayment: "May 15, 2026",
    overdue: 0,
  },
  {
    id: "CR002",
    customer: "Sarah Johnson",
    company: "Safari Tours Uganda",
    email: "sarah@safaritours.co.ug",
    phone: "+256 702 222222",
    creditLimit: 5000,
    used: 4800,
    available: 200,
    status: "suspended",
    paymentDays: 30,
    lastPayment: "Apr 01, 2026",
    overdue: 45,
  },
  {
    id: "CR003",
    customer: "Michael Brown",
    company: "Export Uganda Ltd",
    email: "michael@exportug.com",
    phone: "+256 703 333333",
    creditLimit: 15000,
    used: 12000,
    available: 3000,
    status: "active",
    paymentDays: 45,
    lastPayment: "May 10, 2026",
    overdue: 0,
  },
  {
    id: "CR004",
    customer: "Emily Davis",
    company: "Hotel Services",
    email: "emily@hotelservices.ug",
    phone: "+256 704 444444",
    creditLimit: 3000,
    used: 2800,
    available: 200,
    status: "blocked",
    paymentDays: 15,
    lastPayment: "Feb 15, 2026",
    overdue: 120,
  },
];

export default function CreditControlPage() {
  const [filter, setFilter] = useState("all");

  const stats = {
    totalLimit: creditAccounts.reduce((s, c) => s + c.creditLimit, 0),
    totalUsed: creditAccounts.reduce((s, c) => s + c.used, 0),
    totalAvailable: creditAccounts.reduce((s, c) => s + c.available, 0),
    overdueAmount: creditAccounts.reduce((s, c) => s + c.overdue, 0),
  };

  const filtered = creditAccounts.filter(
    (c) => filter === "all" || c.status === filter,
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Credit Control</h1>
            <p className="text-sm text-gray-500">
              Manage credit limits and collections
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Credit Account
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Credit Limit</p>
            <p className="text-2xl font-bold">
              ${stats.totalLimit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">In Use</p>
            <p className="text-2xl font-bold text-amber-600">
              ${stats.totalUsed.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Available</p>
            <p className="text-2xl font-bold text-green-600">
              ${stats.totalAvailable.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">
              ${stats.overdueAmount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b flex gap-4 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Credit Limit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Used
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Overdue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Last Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-medium">{account.customer}</p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{account.company}</td>
                  <td className="px-4 py-3 font-medium">
                    ${account.creditLimit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-amber-600">
                    ${account.used.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p
                        className={
                          account.available < 500
                            ? "text-red-600 font-medium"
                            : "text-green-600"
                        }
                      >
                        ${account.available.toLocaleString()}
                      </p>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className={`h-1.5 rounded-full ${account.available / account.creditLimit < 0.2 ? "bg-red-500" : account.available / account.creditLimit < 0.5 ? "bg-amber-500" : "bg-green-500"}`}
                          style={{
                            width: `${(account.available / account.creditLimit) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {account.overdue > 0 ? (
                      <span className="text-red-600 font-medium">
                        ${account.overdue}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{account.lastPayment}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        account.status === "active"
                          ? "bg-green-100 text-green-700"
                          : account.status === "suspended"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {account.status === "active" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {account.status === "suspended" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {account.status === "blocked" && (
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
