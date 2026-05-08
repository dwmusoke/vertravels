"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plane,
  User,
  Calendar,
  DollarSign,
  Save,
} from "lucide-react";

interface ManualPosting {
  id: string;
  posting_number: string;
  booking_id?: string;
  posting_type: string;
  source: string;
  pnr?: string;
  ticket_number?: string;
  passenger_name: string;
  route_description: string;
  travel_date: string;
  fare: number;
  tax: number;
  commission: number;
  net_amount: number;
  total_amount: number;
  currency: string;
  airline_code?: string;
  payment_status: string;
  ticketing_status: string;
  entered_by?: string;
  entered_at: string;
  verified_by?: string;
  verified_at?: string;
  status: "draft" | "pending" | "verified" | "posted";
  notes?: string;
}

export default function ManualPostingsPage() {
  const [postings, setPostings] = useState<ManualPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPosting, setEditingPosting] = useState<ManualPosting | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    posting_type: "flight",
    pnr: "",
    ticket_number: "",
    passenger_name: "",
    route_description: "",
    travel_date: "",
    fare: "",
    tax: "",
    commission: "",
    airline_code: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPostings();
  }, []);

  async function fetchPostings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("manual_postings")
        .select("*")
        .order("entered_at", { ascending: false });

      if (error) throw error;
      setPostings(data || []);
    } catch (error: any) {
      console.error("Error fetching postings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const fare = parseFloat(formData.fare) || 0;
      const tax = parseFloat(formData.tax) || 0;
      const commission = parseFloat(formData.commission) || 0;
      const total = fare + tax;
      const net = total - commission;

      if (editingPosting) {
        // Update existing
        const { error } = await supabase
          .from("manual_postings")
          .update({
            posting_type: formData.posting_type,
            pnr: formData.pnr,
            ticket_number: formData.ticket_number,
            passenger_name: formData.passenger_name,
            route_description: formData.route_description,
            travel_date: formData.travel_date,
            fare,
            tax,
            commission,
            net_amount: net,
            total_amount: total,
            airline_code: formData.airline_code,
            notes: formData.notes,
            status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPosting.id);

        if (error) throw error;
      } else {
        // Create new
        const postingNumber = `MAN-${Date.now()}`;

        const { error } = await supabase.from("manual_postings").insert([
          {
            posting_number: postingNumber,
            posting_type: formData.posting_type,
            pnr: formData.pnr,
            ticket_number: formData.ticket_number,
            passenger_name: formData.passenger_name,
            route_description: formData.route_description,
            travel_date: formData.travel_date,
            fare,
            tax,
            commission,
            net_amount: net,
            total_amount: total,
            airline_code: formData.airline_code,
            notes: formData.notes,
            source: "manual",
            payment_status: "pending",
            ticketing_status: "pending",
            status: "draft",
          },
        ]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingPosting(null);
      resetForm();
      fetchPostings();
    } catch (error: any) {
      console.error("Error saving posting:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleVerify(id: string) {
    try {
      const { error } = await supabase
        .from("manual_postings")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      fetchPostings();
    } catch (error: any) {
      console.error("Error verifying:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this posting?")) return;

    try {
      const { error } = await supabase.from("manual_postings").delete().eq("id", id);
      if (error) throw error;
      fetchPostings();
    } catch (error: any) {
      console.error("Error deleting:", error);
    }
  }

  function resetForm() {
    setFormData({
      posting_type: "flight",
      pnr: "",
      ticket_number: "",
      passenger_name: "",
      route_description: "",
      travel_date: "",
      fare: "",
      tax: "",
      commission: "",
      airline_code: "",
      notes: "",
    });
  }

  function handleEdit(posting: ManualPosting) {
    setEditingPosting(posting);
    setFormData({
      posting_type: posting.posting_type,
      pnr: posting.pnr || "",
      ticket_number: posting.ticket_number || "",
      passenger_name: posting.passenger_name,
      route_description: posting.route_description,
      travel_date: posting.travel_date,
      fare: posting.fare.toString(),
      tax: posting.tax.toString(),
      commission: posting.commission.toString(),
      airline_code: posting.airline_code || "",
      notes: posting.notes || "",
    });
    setShowForm(true);
  }

  const stats = {
    total: postings.length,
    draft: postings.filter((p) => p.status === "draft").length,
    pending: postings.filter((p) => p.status === "pending").length,
    verified: postings.filter((p) => p.status === "verified").length,
    totalAmount: postings.reduce((sum, p) => sum + p.total_amount, 0),
    totalCommission: postings.reduce((sum, p) => sum + p.commission, 0),
  };

  const filtered = postings.filter((posting) => {
    const matchesSearch =
      posting.passenger_name.toLowerCase().includes(search.toLowerCase()) ||
      posting.pnr?.toLowerCase().includes(search.toLowerCase()) ||
      posting.posting_number.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || posting.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Manual Postings
          </h1>
          <p className="text-gray-600">
            Manually enter bookings from phone, email, or walk-in customers
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPosting(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          New Posting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Postings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.verified}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Commission</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.totalCommission.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by passenger, PNR, or posting number..."
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
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="posted">Posted</option>
          </select>
          <button
            onClick={fetchPostings}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading postings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Posting #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PNR / Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Travel Date
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
              {filtered.map((posting) => (
                <tr key={posting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {posting.posting_number}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{posting.passenger_name}</p>
                      <p className="text-xs text-gray-500">
                        {posting.posting_type}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {posting.pnr && (
                      <div className="font-mono">{posting.pnr}</div>
                    )}
                    {posting.ticket_number && (
                      <div className="font-mono text-xs text-gray-500">
                        {posting.ticket_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{posting.route_description}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(posting.travel_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${posting.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-medium">
                    ${posting.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        posting.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : posting.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : posting.status === "posted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {posting.status === "verified" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {posting.status === "pending" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {posting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(posting)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {posting.status === "pending" && (
                        <button
                          onClick={() => handleVerify(posting.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(posting.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-xl">
                {editingPosting ? "Edit Posting" : "New Manual Posting"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPosting(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posting Type *
                  </label>
                  <select
                    value={formData.posting_type}
                    onChange={(e) =>
                      setFormData({ ...formData, posting_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="flight">Flight</option>
                    <option value="hotel">Hotel</option>
                    <option value="tour">Tour</option>
                    <option value="car">Car</option>
                    <option value="visa">Visa</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Airline Code
                  </label>
                  <input
                    type="text"
                    value={formData.airline_code}
                    onChange={(e) =>
                      setFormData({ ...formData, airline_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                    placeholder="e.g., AA, EK, QR"
                    maxLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PNR
                  </label>
                  <input
                    type="text"
                    value={formData.pnr}
                    onChange={(e) =>
                      setFormData({ ...formData, pnr: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg uppercase"
                    placeholder="6-character PNR"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Number
                  </label>
                  <input
                    type="text"
                    value={formData.ticket_number}
                    onChange={(e) =>
                      setFormData({ ...formData, ticket_number: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="13-digit ticket number"
                    maxLength={15}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passenger Name *
                  </label>
                  <input
                    type="text"
                    value={formData.passenger_name}
                    onChange={(e) =>
                      setFormData({ ...formData, passenger_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Lastname/Firstname"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Description *
                  </label>
                  <input
                    type="text"
                    value={formData.route_description}
                    onChange={(e) =>
                      setFormData({ ...formData, route_description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., EBB → LHR → JFK"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    value={formData.travel_date}
                    onChange={(e) =>
                      setFormData({ ...formData, travel_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Financial Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Fare *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fare}
                    onChange={(e) =>
                      setFormData({ ...formData, fare: e.target.value })
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
                    value={formData.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: e.target.value })
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
                    value={formData.commission}
                    onChange={(e) =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total (Fare + Tax)
                  </label>
                  <input
                    type="text"
                    value={(
                      parseFloat(formData.fare) || 0
                    ).toLocaleString()}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Additional notes or special requests..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingPosting ? "Update" : "Create"} Posting
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPosting(null);
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
    </div>
  );
}
