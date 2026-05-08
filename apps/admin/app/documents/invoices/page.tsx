"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Download,
  Send,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  Share2,
} from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  booking_id?: string;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  email_sent: boolean;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteInvoice(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;

      fetchInvoices();
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice");
    }
  }

  async function handleSendEmail(invoice: Invoice) {
    try {
      // TODO: Implement email sending
      alert(`Invoice ${invoice.invoice_number} sent to ${invoice.customer_email}`);
      setShowEmailModal(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  }

  async function handleShareDocument(invoice: Invoice) {
    try {
      const shareToken = `share_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const { error } = await supabase.from("document_shares").insert([{
        document_type: "invoice",
        document_id: invoice.id,
        share_token: shareToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }]);

      if (error) throw error;

      const shareUrl = `${window.location.origin}/documents/share/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard!\n\n${shareUrl}`);
      setShowShareModal(false);
    } catch (error: any) {
      console.error("Error creating share link:", error);
      alert("Failed to create share link");
    }
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "sent" || i.status === "draft").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    revenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.total || 0), 0),
  };

  const filtered = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || invoice.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invoices Management
          </h1>
          <p className="text-gray-600">
            Create, manage, and send professional invoices
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Paid</p>
          <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-1">Total Collected</p>
          <p className="text-3xl font-bold text-sky-600">
            ${stats.revenue.toLocaleString()}
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
              placeholder="Search by invoice number or customer..."
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
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchInvoices}
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
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
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
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {invoice.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.customer_email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : invoice.status === "sent" || invoice.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {invoice.status === "paid" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {invoice.status === "overdue" && (
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {(invoice.status === "sent" || invoice.status === "draft") && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewInvoice(invoice)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingInvoice(invoice)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setViewInvoice(invoice);
                          setShowEmailModal(true);
                        }}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setViewInvoice(invoice);
                          setShowShareModal(true);
                        }}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Share Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
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

      {/* View Invoice Modal */}
      {viewInvoice && !showEmailModal && !showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-xl">
                Invoice {viewInvoice.invoice_number}
              </h2>
              <button
                onClick={() => setViewInvoice(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold">VerTravels</h3>
                    <p className="text-sm text-gray-500">Kampala, Uganda</p>
                    <p className="text-sm text-gray-500">
                      Email: info@vertravels.com
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{viewInvoice.invoice_number}</p>
                    <p className="text-sm text-gray-500">
                      Issue Date: {new Date(viewInvoice.issue_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due Date: {new Date(viewInvoice.due_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium">{viewInvoice.status}</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bill To</p>
                    <p className="font-medium">{viewInvoice.customer_name}</p>
                    <p className="text-sm text-gray-600">{viewInvoice.customer_email}</p>
                  </div>
                  {viewInvoice.booking_id && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                      <p className="font-medium">{viewInvoice.booking_id}</p>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-sm font-medium text-gray-500">
                          Description
                        </th>
                        <th className="text-right text-sm font-medium text-gray-500">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 text-sm">Travel Services</td>
                        <td className="text-right text-sm font-medium">
                          ${viewInvoice.total.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t">
                      <tr>
                        <td className="py-3 font-bold">Total</td>
                        <td className="text-right font-bold text-lg">
                          ${viewInvoice.total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2 hover:bg-sky-700">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Send Invoice via Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="email"
                  defaultValue={viewInvoice.customer_email}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  defaultValue={`Invoice ${viewInvoice.invoice_number} from VerTravels`}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  defaultValue={`Dear ${viewInvoice.customer_name},\n\nPlease find attached invoice ${viewInvoice.invoice_number} for the amount of $${viewInvoice.total.toLocaleString()}.\n\nPayment is due by ${new Date(viewInvoice.due_date).toLocaleDateString()}.\n\nThank you for your business!\n\nBest regards,\nVerTravels Team`}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendEmail(viewInvoice)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2 hover:bg-sky-700"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Share Invoice Link</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Create a shareable link that allows anyone to view and download this invoice.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleShareDocument(viewInvoice)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2 hover:bg-sky-700"
              >
                <Share2 className="w-4 h-4" />
                Create Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
