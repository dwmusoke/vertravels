"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Download,
  Plane,
} from "lucide-react";

interface BSPTransaction {
  id: string;
  ticketNumber: string;
  pnr: string;
  passenger: string;
  airline: string;
  segment: string;
  fare: number;
  commission: number;
  tax: number;
  netAmount: number;
  billingDate: string;
  status: "matched" | "pending" | "discrepancy" | "paid";
}

const bspData: BSPTransaction[] = [
  {
    id: "BSP001",
    ticketNumber: "618-2345678901",
    pnr: "ABC123",
    passenger: "John Smith",
    airline: "Uganda Airlines",
    segment: "EBB-LHR",
    fare: 1200,
    commission: 144,
    tax: 90,
    netAmount: 966,
    billingDate: "May 10, 2026",
    status: "matched",
  },
  {
    id: "BSP002",
    ticketNumber: "618-2345678902",
    pnr: "DEF456",
    passenger: "Sarah Johnson",
    airline: "Kenya Airways",
    segment: "NBO-DXB",
    fare: 580,
    commission: 69.6,
    tax: 45,
    netAmount: 465.4,
    billingDate: "May 11, 2026",
    status: "pending",
  },
  {
    id: "BSP003",
    ticketNumber: "618-2345678903",
    pnr: "GHI789",
    passenger: "Michael Brown",
    airline: "Emirates",
    segment: "EBB-DXB",
    fare: 1450,
    commission: 174,
    tax: 115,
    netAmount: 1161,
    billingDate: "May 12, 2026",
    status: "discrepancy",
  },
  {
    id: "BSP004",
    ticketNumber: "618-2345678904",
    pnr: "JKL012",
    passenger: "Emily Davis",
    airline: "Rwanda Air",
    segment: "KGL-CDG",
    fare: 890,
    commission: 106.8,
    tax: 70,
    netAmount: 713.2,
    billingDate: "May 13, 2026",
    status: "paid",
  },
  {
    id: "BSP005",
    ticketNumber: "618-2345678905",
    pnr: "MNO345",
    passenger: "David Wilson",
    airline: "Ethiopian",
    segment: "ADD-LHR",
    fare: 1100,
    commission: 132,
    tax: 85,
    netAmount: 883,
    billingDate: "May 14, 2026",
    status: "matched",
  },
];

export default function BSPPage() {
  const [filter, setFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);

  const stats = {
    total: bspData.length,
    matched: bspData.filter((b) => b.status === "matched").length,
    pending: bspData.filter((b) => b.status === "pending").length,
    discrepancy: bspData.filter((b) => b.status === "discrepancy").length,
    totalAmount: bspData.reduce((s, b) => s + b.netAmount, 0),
  };

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSyncing(false);
  };

  const filtered = bspData.filter(
    (b) => filter === "all" || b.status === filter,
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              BSP Reconciliation
            </h1>
            <p className="text-sm text-gray-500">
              Billing & Settlement Plan reconciliation
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync BSP"}
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Matched</p>
            <p className="text-2xl font-bold text-green-600">{stats.matched}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Discrepancies</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.discrepancy}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-sky-600">
              ${stats.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b flex gap-4 p-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="pending">Pending</option>
              <option value="discrepancy">Discrepancy</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Ticket
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  PNR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Passenger
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Airline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Fare
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Net
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">
                    {record.ticketNumber}
                  </td>
                  <td className="px-4 py-3 font-medium">{record.pnr}</td>
                  <td className="px-4 py-3">{record.passenger}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-gray-400" />
                    {record.airline}
                  </td>
                  <td className="px-4 py-3">${record.fare}</td>
                  <td className="px-4 py-3 text-green-600">
                    +${record.commission}
                  </td>
                  <td className="px-4 py-3 font-medium">${record.netAmount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        record.status === "matched"
                          ? "bg-green-100 text-green-700"
                          : record.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : record.status === "discrepancy"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {record.status === "matched" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status === "pending" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status === "discrepancy" && (
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status === "paid" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {record.status}
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
