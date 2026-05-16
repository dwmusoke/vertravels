"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  User,
  Trash2,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: string;
  assigned_to: string;
  reply_message: string;
  replied_at: string;
  replied_by: string;
  created_at: string;
}

export default function ContactsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error: any) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(inquiry: Inquiry) {
    if (!replyText.trim()) return;
    try {
      setSending(true);
      const { error } = await supabase
        .from("contact_inquiries")
        .update({
          status: "replied",
          reply_message: replyText,
          replied_at: new Date().toISOString(),
        })
        .eq("id", inquiry.id);

      if (error) throw error;

      setReplyText("");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error: any) {
      alert("Failed to send reply: " + error.message);
    } finally {
      setSending(false);
    }
  }

  async function handleMarkRead(inquiry: Inquiry) {
    try {
      await supabase
        .from("contact_inquiries")
        .update({ status: "read" })
        .eq("id", inquiry.id);
      fetchInquiries();
    } catch (error: any) {
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await supabase.from("contact_inquiries").delete().eq("id", id);
      setInquiries(inquiries.filter((i) => i.id !== id));
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    }
  }

  const filtered = inquiries.filter((i) => {
    const q = search.toLowerCase();
    if (filter === "all" && !q) return true;
    return (
      (!q ||
        i.name?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.subject?.toLowerCase().includes(q)) &&
      (filter === "all" || i.status === filter)
    );
  });

  const statusIcon: Record<string, any> = {
    new: AlertCircle,
    read: Clock,
    replied: CheckCircle,
  };

  const statusColor: Record<string, string> = {
    new: "badge-danger",
    read: "badge-warning",
    replied: "badge-success",
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Contact Inquiries
          </h1>
          <p className="text-gray-600">
            Manage website contact form submissions
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2">
          <div className="table-container">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-sky-500" />
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No inquiries found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((inquiry) => {
                  const StatusIcon = statusIcon[inquiry.status] || Clock;
                  return (
                    <div
                      key={inquiry.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedInquiry?.id === inquiry.id
                          ? "bg-sky-50 border-l-4 border-sky-500"
                          : inquiry.status === "new"
                          ? "bg-amber-50/50"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        if (inquiry.status === "new") handleMarkRead(inquiry);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
                            {inquiry.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {inquiry.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {inquiry.subject || "No subject"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {inquiry.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={statusColor[inquiry.status] || "badge-neutral"}>
                            <StatusIcon className="w-3 h-3" />
                            {inquiry.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(inquiry.id);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(inquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Reply Panel */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="card">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">Inquiry Details</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">
                    {selectedInquiry.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm text-sky-600 hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedInquiry.phone}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedInquiry.subject || "No subject"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Message
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
                {selectedInquiry.reply_message && (
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">
                      Your Reply
                    </p>
                    <p className="text-sm text-gray-600 bg-green-50 rounded-lg p-3">
                      {selectedInquiry.reply_message}
                    </p>
                  </div>
                )}
                {selectedInquiry.status !== "replied" && (
                  <div className="pt-3 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="input-field mb-3"
                      rows={4}
                      placeholder="Type your reply..."
                    />
                    <button
                      onClick={() => handleReply(selectedInquiry)}
                      disabled={sending || !replyText.trim()}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
