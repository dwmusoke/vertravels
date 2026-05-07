"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Plane,
  Search,
} from "lucide-react";

interface FareRecord {
  id: string;
  route: string;
  airline: string;
  currentFare: number;
  marketFare: number;
  optimalFare: number;
  availableSeats: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  recommendation: "book" | "hold" | "wait";
  savings: number;
}

const fareData: FareRecord[] = [
  {
    id: "FR001",
    route: "EBB → LHR",
    airline: "Uganda Airlines",
    currentFare: 1250,
    marketFare: 1100,
    optimalFare: 950,
    availableSeats: 8,
    trend: "up",
    lastUpdated: "2 mins ago",
    recommendation: "hold",
    savings: 300,
  },
  {
    id: "FR002",
    route: "NBO → DXB",
    airline: "Kenya Airways",
    currentFare: 580,
    marketFare: 620,
    optimalFare: 520,
    availableSeats: 15,
    trend: "down",
    lastUpdated: "5 mins ago",
    recommendation: "wait",
    savings: 60,
  },
  {
    id: "FR003",
    route: "KGL → CDG",
    airline: "Ethiopian",
    currentFare: 890,
    marketFare: 850,
    optimalFare: 780,
    availableSeats: 3,
    trend: "stable",
    lastUpdated: "10 mins ago",
    recommendation: "book",
    savings: 110,
  },
  {
    id: "FR004",
    route: "EBB → JNB",
    airline: "Rwanda Air",
    currentFare: 450,
    marketFare: 520,
    optimalFare: 480,
    availableSeats: 22,
    trend: "up",
    lastUpdated: "1 min ago",
    recommendation: "wait",
    savings: 0,
  },
  {
    id: "FR005",
    route: "ADD → LHR",
    airline: "Emirates",
    currentFare: 1450,
    marketFare: 1380,
    optimalFare: 1200,
    availableSeats: 5,
    trend: "up",
    lastUpdated: "3 mins ago",
    recommendation: "hold",
    savings: 250,
  },
];

interface UnusedTicket {
  id: string;
  pnr: string;
  passenger: string;
  route: string;
  travelDate: string;
  expiryDate: string;
  status: "valid" | "expired" | "partially_used";
  refundable: number;
  seatLoss: number;
}

const unusedTickets: UnusedTicket[] = [
  {
    id: "UT001",
    pnr: "ABC123",
    passenger: "Jane Doe",
    route: "EBB → NBO",
    travelDate: "Apr 10, 2026",
    expiryDate: "Apr 10, 2026",
    status: "expired",
    refundable: 0,
    seatLoss: 350,
  },
  {
    id: "UT002",
    pnr: "DEF456",
    passenger: "Robert Smith",
    route: "NBO → JNB",
    travelDate: "May 15, 2026",
    expiryDate: "May 15, 2026",
    status: "valid",
    refundable: 280,
    seatLoss: 0,
  },
  {
    id: "UT003",
    pnr: "GHI789",
    passenger: "Alice Johnson",
    route: "EBB → LHR",
    travelDate: "Unused",
    expiryDate: "Jun 01, 2026",
    status: "valid",
    refundable: 890,
    seatLoss: 0,
  },
];

export default function FareOptimizationPage() {
  const [tab, setTab] = useState<"fares" | "unused">("fares");
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSyncing(false);
  };

  const totalPotentialSavings = fareData.reduce((sum, f) => sum + f.savings, 0);
  const totalRefundable = unusedTickets.reduce(
    (sum, t) => sum + t.refundable,
    0,
  );
  const totalSeatLoss = unusedTickets.reduce((sum, t) => sum + t.seatLoss, 0);

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Fare Optimization
            </h1>
            <p className="text-sm text-gray-500">
              Market fares, unused tickets & PNR management
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Market Data"}
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-medium">Potential Savings</span>
            </div>
            <p className="text-2xl font-bold">${totalPotentialSavings}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Pending Decisions</span>
            </div>
            <p className="text-2xl font-bold">
              {fareData.filter((f) => f.recommendation === "hold").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Refundable</span>
            </div>
            <p className="text-2xl font-bold">${totalRefundable}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Revenue Lost</span>
            </div>
            <p className="text-2xl font-bold">${totalSeatLoss}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b flex">
            <button
              onClick={() => setTab("fares")}
              className={`px-6 py-3 font-medium ${tab === "fares" ? "border-b-2 border-sky-600 text-sky-600" : "text-gray-500"}`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Fare Recommendations
            </button>
            <button
              onClick={() => setTab("unused")}
              className={`px-6 py-3 font-medium ${tab === "unused" ? "border-b-2 border-sky-600 text-sky-600" : "text-gray-500"}`}
            >
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Unused Tickets
            </button>
          </div>

          {tab === "fares" && (
            <div className="p-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Current
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Market
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Optimal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Trend
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {fareData.map((fare) => (
                    <tr key={fare.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{fare.route}</p>
                        <p className="text-xs text-gray-500">{fare.airline}</p>
                      </td>
                      <td className="px-4 py-3">${fare.currentFare}</td>
                      <td className="px-4 py-3">${fare.marketFare}</td>
                      <td className="px-4 py-3">${fare.optimalFare}</td>
                      <td className="px-4 py-3">
                        {fare.trend === "up" && (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        )}
                        {fare.trend === "down" && (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        {fare.trend === "stable" && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            fare.availableSeats < 5
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {fare.availableSeats}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            fare.recommendation === "book"
                              ? "bg-green-100 text-green-700"
                              : fare.recommendation === "hold"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {fare.recommendation === "book" && (
                            <CheckCircle className="w-3 h-3 inline" />
                          )}
                          {fare.recommendation === "hold" && (
                            <Clock className="w-3 h-3 inline" />
                          )}
                          {fare.recommendation === "wait" && (
                            <Search className="w-3 h-3 inline" />
                          )}
                          {fare.recommendation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        {fare.savings > 0 ? `$${fare.savings}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "unused" && (
            <div className="p-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      PNR
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Passenger
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Travel Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Refundable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Seat Loss
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {unusedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium">
                        {ticket.pnr}
                      </td>
                      <td className="px-4 py-3">{ticket.passenger}</td>
                      <td className="px-4 py-3">{ticket.route}</td>
                      <td className="px-4 py-3">{ticket.travelDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === "valid"
                              ? "bg-green-100 text-green-700"
                              : ticket.status === "expired"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {ticket.refundable > 0 ? (
                          <span className="text-green-600 font-medium">
                            ${ticket.refundable}
                          </span>
                        ) : (
                          <span className="text-gray-400">$0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {ticket.seatLoss > 0 ? (
                          <span className="text-red-600 font-medium">
                            ${ticket.seatLoss}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
