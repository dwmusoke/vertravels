"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Mail,
  Plane,
  User,
  Calendar,
  DollarSign,
  Save,
  X,
} from "lucide-react";

interface TicketRecord {
  id: string;
  ticket_number: string;
  booking_id?: string;
  pnr?: string;
  passenger_name: string;
  airline_code: string;
  issue_date: string;
  issued_by?: string;
  status: "issued" | "voided" | "refunded" | "exchanged";
  fare: number;
  tax: number;
  total: number;
  commission: number;
  net_amount: number;
  fare_basis?: string;
  endorsement?: string;
  voided_at?: string;
  void_reason?: string;
}

interface TicketStock {
  id: string;
  airline_code: string;
  airline_name?: string;
  ticket_prefix: string;
  start_number: string;
  end_number: string;
  current_number?: string;
  status: "active" | "depleted" | "suspended";
  received_date: string;
}

export default function TicketingPage() {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [ticketStock, setTicketStock] = useState<TicketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showVoidForm, setShowVoidForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [issueData, setIssueData] = useState({
    booking_id: "",
    pnr: "",
    passenger_name: "",
    airline_code: "",
    fare: "",
    tax: "",
    commission: "",
    fare_basis: "",
    endorsement: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await fetchTickets();
    await fetchTicketStock();
  }

  async function fetchTickets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("issue_date", { ascending: false })
        .limit(100);

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTicketStock() {
    try {
      const { data, error } = await supabase
        .from("ticket_stock")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      setTicketStock(data || []);
    } catch (error: any) {
      console.error("Error fetching ticket stock:", error);
    }
  }

  async function handleIssueTicket(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Get next ticket number from stock
      const stock = ticketStock.find(
        (s) => s.airline_code === issueData.airline_code
      );

      if (!stock) {
        alert("No ticket stock available for this airline");
        return;
      }

      // Generate ticket number (13 digits: 3 digit prefix + 10 digit number)
      const currentNum = parseInt(stock.current_number || stock.start_number);
      const ticketNumber = stock.ticket_prefix + String(currentNum).padStart(10, "0");

      const fare = parseFloat(issueData.fare) || 0;
      const tax = parseFloat(issueData.tax) || 0;
      const commission = parseFloat(issueData.commission) || 0;
      const total = fare + tax;
      const net = total - commission;

      // Create ticket
      const { error } = await supabase.from("tickets").insert([{
        ticket_number: ticketNumber,
        booking_id: issueData.booking_id || null,
        pnr: issueData.pnr,
        passenger_name: issueData.passenger_name,
        airline_code: issueData.airline_code,
        fare,
        tax,
        total,
        commission,
        net_amount: net,
        fare_basis: issueData.fare_basis,
        endorsement: issueData.endorsement,
        status: "issued",
      }]);

      if (error) throw error;

      // Update ticket stock
      const nextNumber = String(currentNum + 1).padStart(10, "0");
      await supabase
        .from("ticket_stock")
        .update({ current_number: nextNumber })
        .eq("id", stock.id);

      // Update booking workflow if booking exists
      if (issueData.booking_id) {
        await supabase
          .from("booking_workflow")
          .update({
            current_status: "ticketed",
            status_changed_at: new Date().toISOString(),
          })
          .eq("booking_id", issueData.booking_id);
      }

      setShowIssueForm(false);
      resetIssueForm();
      fetchData();
      alert(`Ticket issued: ${ticketNumber}`);
    } catch (error: any) {
      console.error("Error issuing ticket:", error);
      alert("Failed to issue ticket: " + error.message);
    }
  }

  async function handleVoidTicket(ticket: TicketRecord, reason: string) {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({
          status: "voided",
          voided_at: new Date().toISOString(),
          void_reason: reason,
        })
        .eq("id", ticket.id);

      if (error) throw error;

      fetchData();
      setShowVoidForm(false);
      setSelectedTicket(null);
      alert("Ticket voided successfully");
    } catch (error: any) {
      console.error("Error voiding ticket:", error);
      alert("Failed to void ticket: " + error.message);
    }
  }

  async function handleReprintTicket(ticket: TicketRecord) {
    // In production, generate PDF and download
    alert(`E-ticket receipt will be generated for ${ticket.ticket_number}`);
  }

  function resetIssueForm() {
    setIssueData({
      booking_id: "",
      pnr: "",
      passenger_name: "",
      airline_code: "",
      fare: "",
      tax: "",
      commission: "",
      fare_basis: "",
      endorsement: "",
    });
  }

  const stats = {
    totalTickets: tickets.length,
    issued: tickets.filter((t) => t.status === "issued").length,
    voided: tickets.filter((t) => t.status === "voided").length,
    refunded: tickets.filter((t) => t.status === "refunded").length,
    totalValue: tickets
      .filter((t) => t.status === "issued")
      .reduce((sum, t) => sum + t.total, 0),
    totalCommission: tickets
      .filter((t) => t.status === "issued")
      .reduce((sum, t) => sum + t.commission, 0),
  };

  const stockStatus = {
    totalStock: ticketStock.length,
    active: ticketStock.filter((s) => s.status === "active").length,
    lowStock: ticketStock.filter((s) => {
      const current = parseInt(s.current_number || s.start_number);
      const end = parseInt(s.end_number);
      return (end - current) < 100;
    }).length,
  };

  const filtered = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      ticket.passenger_name.toLowerCase().includes(search.toLowerCase()) ||
      ticket.pnr?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || ticket.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ticketing System
          </h1>
          <p className="text-gray-600">
            Issue, void, and manage e-tickets
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowIssueForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            Issue Ticket
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Tickets</p>
          <p className="text-2xl font-bold">{stats.totalTickets}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Issued</p>
          <p className="text-2xl font-bold text-green-600">{stats.issued}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Voided</p>
          <p className="text-2xl font-bold text-red-600">{stats.voided}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Refunded</p>
          <p className="text-2xl font-bold text-orange-600">{stats.refunded}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Commission</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.totalCommission.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Ticket Stock Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Ticket Stock Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ticketStock.map((stock) => {
            const current = parseInt(stock.current_number || stock.start_number);
            const end = parseInt(stock.end_number);
            const remaining = end - current;
            const percentage = (remaining / (end - parseInt(stock.start_number))) * 100;

            return (
              <div
                key={stock.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{stock.airline_name || stock.airline_code}</h3>
                    <p className="text-sm text-gray-500">
                      {stock.ticket_prefix} Series
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      stock.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stock.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Remaining: {remaining}</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        remaining < 100
                          ? "bg-red-500"
                          : remaining < 500
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {stock.start_number} - {stock.end_number}
                </p>
              </div>
            );
          })}
          {ticketStock.length === 0 && (
            <p className="text-center text-gray-500 col-span-3 py-4">
              No ticket stock configured. Add ticket stock in database.
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ticket number, passenger, or PNR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="issued">Issued</option>
            <option value="voided">Voided</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ticket Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PNR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium">
                    {ticket.ticket_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{ticket.passenger_name}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {ticket.pnr || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ticket.airline_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${ticket.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-medium">
                    ${ticket.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === "issued"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "voided"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {ticket.status === "issued" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {ticket.status === "voided" && (
                        <XCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReprintTicket(ticket)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Reprint"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {ticket.status === "issued" && (
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowVoidForm(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Void"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Ticket Modal */}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-xl">Issue E-Ticket</h2>
              <button
                onClick={() => {
                  setShowIssueForm(false);
                  resetIssueForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIssueTicket} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking ID (optional)
                  </label>
                  <input
                    type="text"
                    value={issueData.booking_id}
                    onChange={(e) =>
                      setIssueData({ ...issueData, booking_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Booking UUID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PNR *
                  </label>
                  <input
                    type="text"
                    value={issueData.pnr}
                    onChange={(e) =>
                      setIssueData({ ...issueData, pnr: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                    placeholder="6-character PNR"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Airline Code *
                  </label>
                  <select
                    value={issueData.airline_code}
                    onChange={(e) =>
                      setIssueData({ ...issueData, airline_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Airline</option>
                    {ticketStock.map((stock) => (
                      <option key={stock.id} value={stock.airline_code}>
                        {stock.airline_name || stock.airline_code} ({stock.airline_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passenger Name *
                  </label>
                  <input
                    type="text"
                    value={issueData.passenger_name}
                    onChange={(e) =>
                      setIssueData({ ...issueData, passenger_name: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                    placeholder="LASTNAME/FIRSTNAME"
                    required
                  />
                </div>

                <div className="col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Fare Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Fare *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={issueData.fare}
                    onChange={(e) =>
                      setIssueData({ ...issueData, fare: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={issueData.tax}
                    onChange={(e) =>
                      setIssueData({ ...issueData, tax: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={issueData.commission}
                    onChange={(e) =>
                      setIssueData({ ...issueData, commission: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fare Basis
                  </label>
                  <input
                    type="text"
                    value={issueData.fare_basis}
                    onChange={(e) =>
                      setIssueData({ ...issueData, fare_basis: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Y, K, L"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endorsements
                  </label>
                  <textarea
                    value={issueData.endorsement}
                    onChange={(e) =>
                      setIssueData({ ...issueData, endorsement: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Endorsements/restrictions..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Issue Ticket
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIssueForm(false);
                    resetIssueForm();
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Ticket Modal */}
      {showVoidForm && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Void Ticket</h2>
              <button
                onClick={() => {
                  setShowVoidForm(false);
                  setSelectedTicket(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Ticket:</strong> {selectedTicket.ticket_number}
                </p>
                <p className="text-sm">
                  <strong>Passenger:</strong> {selectedTicket.passenger_name}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> ${selectedTicket.total.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Void Reason *
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Reason for voiding..."
                  required
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleVoidTicket(selectedTicket, e.currentTarget.value);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Press Ctrl+Enter to submit
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && !showVoidForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl">E-Ticket Details</h2>
                <p className="text-sm text-gray-500 font-mono">
                  {selectedTicket.ticket_number}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Passenger</h3>
                  <p className="font-medium">{selectedTicket.passenger_name}</p>
                  {selectedTicket.pnr && (
                    <p className="text-sm text-gray-500">PNR: {selectedTicket.pnr}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Airline</h3>
                  <p className="font-medium">{selectedTicket.airline_code}</p>
                  <p className="text-sm text-gray-500">
                    Issued: {new Date(selectedTicket.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <h3 className="font-semibold mb-2">Fare Details</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Base Fare</p>
                      <p className="font-medium">${selectedTicket.fare.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tax</p>
                      <p className="font-medium">${selectedTicket.tax.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium">${selectedTicket.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Commission</p>
                      <p className="font-medium text-green-600">
                        ${selectedTicket.commission.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Net Amount</p>
                      <p className="font-medium">
                        ${selectedTicket.net_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedTicket.fare_basis && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Fare Basis</h3>
                    <p className="font-medium">{selectedTicket.fare_basis}</p>
                  </div>
                )}
                {selectedTicket.endorsement && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Endorsements</h3>
                    <p className="text-sm">{selectedTicket.endorsement}</p>
                  </div>
                )}
                {selectedTicket.void_reason && (
                  <div className="bg-red-50 p-4 rounded-lg col-span-2">
                    <h3 className="font-semibold mb-2 text-red-700">Void Information</h3>
                    <p className="text-sm text-red-600">{selectedTicket.void_reason}</p>
                    <p className="text-xs text-red-500 mt-1">
                      Voided: {new Date(selectedTicket.voided_at!).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
