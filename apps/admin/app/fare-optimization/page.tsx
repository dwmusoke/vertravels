"use client";

import { useState } from "react";
import { Sliders, TrendingUp, DollarSign, Clock } from "lucide-react";

export default function FareOptimizationPage() {
  const [origin, setOrigin] = useState("EBB");
  const [destination, setDestination] = useState("NBO");
  const [date, setDate] = useState("");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sliders className="w-6 h-6" /> Fare Optimization</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze and optimize flight fares across routes and airlines</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Origin</label>
            <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Travel Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Lowest Available", value: "$380", icon: TrendingUp, color: "text-green-600" },
            { label: "Average Fare", value: "$520", icon: DollarSign, color: "text-blue-600" },
            { label: "Best Time to Book", value: "21 days before", icon: Clock, color: "text-purple-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold">Fare Comparison by Airline</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Economy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { airline: "Uganda Airlines", economy: "$450", business: "$850", duration: "5h 30m", stops: 0, rec: "Best Value" },
              { airline: "Kenya Airways", economy: "$380", business: "$720", duration: "7h 15m", stops: 0, rec: "Lowest Price" },
              { airline: "Emirates", economy: "$650", business: "$1,200", duration: "8h 45m", stops: 1, rec: "Premium Choice" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{row.airline}</td>
                <td className="px-6 py-4">${row.economy}</td>
                <td className="px-6 py-4">${row.business}</td>
                <td className="px-6 py-4">{row.duration}</td>
                <td className="px-6 py-4">{row.stops === 0 ? "Non-stop" : `${row.stops} Stop`}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{row.rec}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
