"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Clock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  User,
  Plane,
  Calendar,
  Mail,
  Phone,
  Eye,
  Play,
  Pause,
  Settings,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface QueueItem {
  id: string;
  queue_id: string;
  queue_name?: string;
  pnr: string;
  passenger_name?: string;
  airline_code?: string;
  queue_date: string;
  received_date: string;
  status: "pending" | "processing" | "completed" | "escalated";
  priority: "low" | "normal" | "high" | "urgent";
  assigned_to?: string;
  processed_at?: string;
  processed_by?: string;
  processing_notes?: string;
  booking_id?: string;
}

interface QueueDefinition {
  id: string;
  queue_name: string;
  queue_number?: string;
  office_id?: string;
  source?: string;
  description?: string;
  priority: number;
  auto_process: boolean;
  sla_hours: number;
  status: "active" | "inactive";
}

interface QueueStats {
  totalItems: number;
  pending: number;
  processing: number;
  completed: number;
  escalated: number;
  overdue: number;
  avgProcessingTime: number;
  slaBreaches: number;
}

export default function QueueManagementPage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [queueDefinitions, setQueueDefinitions] = useState<QueueDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [processing, setProcessing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    await fetchQueueDefinitions();
    await fetchQueueItems();
  }

  async function fetchQueueDefinitions() {
    try {
      const { data, error } = await supabase
        .from("queue_definitions")
        .select("*")
        .eq("status", "active")
        .order("priority");

      if (error) throw error;
      setQueueDefinitions(data || []);
    } catch (error: any) {
      console.error("Error fetching queues:", error);
    }
  }

  async function fetchQueueItems() {
    try {
      setLoading(true);
      let query = supabase
        .from("queue_items")
        .select(`
          *,
          queue_definitions(queue_name)
        `)
        .order("received_date", { ascending: false });

      if (selectedQueue !== "all") {
        query = query.eq("queue_id", selectedQueue);
      }

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQueueItems(data || []);
    } catch (error: any) {
      console.error("Error fetching queue items:", error);
    } finally {
      setLoading(false);
    }
  }

  async function processQueueItem(item: QueueItem, action: string, notes: string = "") {
    try {
      setProcessing(true);

      // Update queue item
      const { error } = await supabase
        .from("queue_items")
        .update({
          status: action === "complete" ? "completed" : "processing",
          processed_at: action === "complete" ? new Date().toISOString() : null,
          processed_by: action === "complete" ? (await supabase.auth.getUser()).data.user?.id : null,
          processing_notes: notes || item.processing_notes,
        })
        .eq("id", item.id);

      if (error) throw error;

      // Log to history
      await supabase.from("queue_processing_history").insert([{
        queue_item_id: item.id,
        action: action,
        action_by: (await supabase.auth.getUser()).data.user?.id,
        notes: notes,
        old_status: item.status,
        new_status: action === "complete" ? "completed" : "processing",
      }]);

      // If completing, try to create booking
      if (action === "complete" && item.pnr) {
        await createBookingFromQueue(item);
      }

      fetchData();
      setSelectedItem(null);
    } catch (error: any) {
      console.error("Error processing queue item:", error);
      alert("Failed to process: " + error.message);
    } finally {
      setProcessing(false);
    }
  }

  async function createBookingFromQueue(item: QueueItem) {
    try {
      // Check if booking already exists
      const { data: existing } = await supabase
        .from("bookings")
        .select("id")
        .eq("pnr", item.pnr)
        .single();

      if (existing) {
        // Link queue item to existing booking
        await supabase
          .from("queue_items")
          .update({ booking_id: existing.id })
          .eq("id", item.id);
        return;
      }

      // Create new booking
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([{
          booking_ref: `QUEUE-${item.pnr}`,
          pnr: item.pnr,
          module_type: "flights",
          customer_name: item.passenger_name || "Unknown",
          passenger_name: item.passenger_name || "Unknown",
          destination: item.airline_code || "",
          status: "pending",
          payment_status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;

      // Link queue item to booking
      await supabase
        .from("queue_items")
        .update({ booking_id: booking.id })
        .eq("id", item.id);

      // Create workflow entry
      await supabase
        .from("booking_workflow")
        .insert([{
          booking_id: booking.id,
          current_status: "booked",
          assigned_agent: (await supabase.auth.getUser()).data.user?.id,
        }]);

    } catch (error: any) {
      console.error("Error creating booking:", error);
    }
  }

  async function assignToUser(itemId: string, userId: string) {
    try {
      const { error } = await supabase
        .from("queue_items")
        .update({
          assigned_to: userId,
          status: "processing",
        })
        .eq("id", itemId);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      console.error("Error assigning:", error);
    }
  }

  async function escalateItem(itemId: string) {
    try {
      const { error } = await supabase
        .from("queue_items")
        .update({
          status: "escalated",
          priority: "urgent",
        })
        .eq("id", itemId);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      console.error("Error escalating:", error);
    }
  }

  const stats: QueueStats = {
    totalItems: queueItems.length,
    pending: queueItems.filter((i) => i.status === "pending").length,
    processing: queueItems.filter((i) => i.status === "processing").length,
    completed: queueItems.filter((i) => i.status === "completed").length,
    escalated: queueItems.filter((i) => i.status === "escalated").length,
    overdue: queueItems.filter((i) => {
      const received = new Date(i.received_date);
      const now = new Date();
      const hoursDiff = (now.getTime() - received.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24 && i.status !== "completed";
    }).length,
    avgProcessingTime: 0, // Calculate from history
    slaBreaches: queueItems.filter((i) => {
      const received = new Date(i.received_date);
      const now = new Date();
      const hoursDiff = (now.getTime() - received.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24;
    }).length,
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    normal: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    escalated: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Queue Management
          </h1>
          <p className="text-gray-600">
            Monitor and process GDS queues, PNRs, and time limits
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            Queue Settings
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Escalated</p>
          <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">SLA Breaches</p>
          <p className="text-2xl font-bold text-orange-600">{stats.slaBreaches}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Avg Time</p>
          <p className="text-2xl font-bold text-sky-600">{stats.avgProcessingTime}m</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search PNR or passenger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Queues</option>
            {queueDefinitions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.queue_name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Auto-refresh: 30s</span>
          </div>
        </div>
      </div>

      {/* Queue Items Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading queue items...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PNR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Queue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
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
              {queueItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${
                    item.priority === "urgent" ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-mono font-medium">
                    {item.pnr}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{item.passenger_name || "-"}</p>
                      {item.booking_id && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Booking linked
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.queue_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.airline_code || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.received_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs">
                      {new Date(item.received_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        priorityColors[item.priority]
                      }`}
                    >
                      {item.priority === "urgent" && (
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                      )}
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statusColors[item.status]
                      }`}
                    >
                      {item.status === "processing" && (
                        <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                      )}
                      {item.status === "completed" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      >
                        View
                      </button>
                      {item.status === "pending" && (
                        <button
                          onClick={() =>
                            processQueueItem(item, "process", "Started processing")
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Process
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

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl">Queue Item Details</h2>
                <p className="text-sm text-gray-500 font-mono">
                  PNR: {selectedItem.pnr}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Queue Information</h3>
                  <p className="text-sm">
                    <strong>Queue:</strong> {selectedItem.queue_name}
                  </p>
                  <p className="text-sm">
                    <strong>Received:</strong>{" "}
                    {new Date(selectedItem.received_date).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Priority:</strong>{" "}
                    <span className={priorityColors[selectedItem.priority]}>
                      {selectedItem.priority}
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong>{" "}
                    <span className={statusColors[selectedItem.status]}>
                      {selectedItem.status}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking Details</h3>
                  <p className="text-sm">
                    <strong>Passenger:</strong> {selectedItem.passenger_name || "-"}
                  </p>
                  <p className="text-sm">
                    <strong>Airline:</strong> {selectedItem.airline_code || "-"}
                  </p>
                  <p className="text-sm">
                    <strong>Assigned:</strong>{" "}
                    {selectedItem.assigned_to ? "Yes" : "No"}
                  </p>
                  {selectedItem.booking_id && (
                    <p className="text-sm text-green-600">
                      <strong>Booking:</strong> Linked ✓
                    </p>
                  )}
                </div>
              </div>

              {selectedItem.processing_notes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Processing Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedItem.processing_notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {selectedItem.status === "pending" && (
                  <button
                    onClick={() =>
                      processQueueItem(selectedItem, "process", "Started processing from detail view")
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    disabled={processing}
                  >
                    <Play className="w-4 h-4" />
                    Start Processing
                  </button>
                )}
                {selectedItem.status === "processing" && (
                  <button
                    onClick={() =>
                      processQueueItem(selectedItem, "complete", "Completed processing")
                    }
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    disabled={processing}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => escalateItem(selectedItem.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  disabled={processing}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-xl">Queue Definitions</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {queueDefinitions.map((queue) => (
                  <div
                    key={queue.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{queue.queue_name}</h3>
                        <p className="text-sm text-gray-500">
                          {queue.description}
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <strong>Queue #:</strong> {queue.queue_number || "-"}
                      </div>
                      <div>
                        <strong>Office:</strong> {queue.office_id || "-"}
                      </div>
                      <div>
                        <strong>SLA:</strong> {queue.sla_hours}h
                      </div>
                      <div>
                        <strong>Auto Process:</strong>{" "}
                        {queue.auto_process ? "Yes" : "No"}
                      </div>
                      <div>
                        <strong>Priority:</strong> {queue.priority}
                      </div>
                    </div>
                  </div>
                ))}
                {queueDefinitions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No queues configured. Add queue definitions in database.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
