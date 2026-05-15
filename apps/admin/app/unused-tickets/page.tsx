"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Ticket, RefreshCw, FileText } from "lucide-react";

interface UnusedTicket {
  id: string;
  ticket_number: string;
  passenger_name: string;
  airline: string;
  route: string;
  issue_date: string;
  expiry_date: string;
  fare: number;
  status: string;
  remarks?: string;
}

export default function UnusedTicketsPage() {
  const [tickets, setTickets] = useState<UnusedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => { fetchTickets(); }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      const { data } = await supabase.from("unused_tickets").select("*").order("issue_date", { ascending: false });
      setTickets(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const filtered = tickets.filter(t =>
    t.ticket_number?.toLowerCase().includes(search.toLowerCase()) ||
    t.passenger_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.airline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Ticket className="w-6 h-6" /> Unused Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage unused/non-refundable tickets</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by ticket, passenger, airline..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full border rounded-lg" />
        </div>
        <button onClick={fetchTickets} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      {loading ? (
        <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" /><p>Loading...</p></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{t.ticket_number}</td>
                  <td className="px-6 py-4 font-medium">{t.passenger_name}</td>
                  <td className="px-6 py-4">{t.airline}</td>
                  <td className="px-6 py-4 text-sm">{t.route}</td>
                  <td className="px-6 py-4 font-medium">${t.fare}</td>
                  <td className="px-6 py-4 text-sm">{t.expiry_date ? new Date(t.expiry_date).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.status === "expired" ? "bg-red-100 text-red-700" :
                      t.status === "used" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No unused tickets found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
