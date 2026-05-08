"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Clock,
  User,
  FileText,
  ChevronRight,
  ChevronDown,
  Download,
  Filter,
  X,
  History,
  ArrowLeftRight,
  Plus,
  Trash2,
} from "lucide-react";

interface AuditTrailProps {
  recordId: string;
  tableName: string;
  onClose?: () => void;
}

interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  user_id: string;
  user_email?: string;
  changes?: Record<string, { old: any; new: any }>;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  created_at: string;
}

export function AuditTrail({ recordId, tableName, onClose }: AuditTrailProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "INSERT" | "UPDATE" | "DELETE">("all");

  useEffect(() => {
    fetchLogs();
  }, [recordId, tableName]);

  async function fetchLogs() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("record_id", recordId)
        .eq("table_name", tableName)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const filteredLogs = logs.filter((log) => filter === "all" || log.action === filter);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "INSERT":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "UPDATE":
        return <ArrowLeftRight className="w-4 h-4 text-blue-600" />;
      case "DELETE":
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT":
        return "bg-green-100 text-green-700 border-green-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium">Audit Trail</h3>
          <span className="text-sm text-gray-500">({logs.length} entries)</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="all">All Actions</option>
            <option value="INSERT">Created</option>
            <option value="UPDATE">Updated</option>
            <option value="DELETE">Deleted</option>
          </select>
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-sm text-gray-600">Loading audit trail...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No audit entries found</p>
        </div>
      ) : (
        <div className="divide-y max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => toggleExpand(log.id)}
              >
                <div className="mt-0.5">
                  {expandedLogs.has(log.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div className="flex-shrink-0">
                  {getActionIcon(log.action)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-600">
                      by {log.user_email || log.user_id}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>

                  {log.action === "UPDATE" && log.changes && (
                    <p className="text-sm text-gray-600">
                      {Object.keys(log.changes).length} field(s) changed
                    </p>
                  )}
                </div>
              </div>

              {expandedLogs.has(log.id) && (
                <div className="mt-3 ml-7 space-y-3">
                  {log.action === "INSERT" && log.new_values && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-900 mb-2">
                        Initial Values
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(log.new_values).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-gray-600 font-mono text-xs">
                              {key}:
                            </span>
                            <span className="text-gray-900">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.action === "UPDATE" && log.changes && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Changes Made
                      </h4>
                      {Object.entries(log.changes).map(([key, change]) => (
                        <div
                          key={key}
                          className="bg-white border rounded-lg p-2 text-sm"
                        >
                          <div className="font-mono text-xs text-gray-600 mb-1">
                            {key}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-red-50 border border-red-200 rounded px-2 py-1">
                              <span className="text-xs text-red-600">From:</span>{" "}
                              <span className="text-red-900">
                                {String(change.old ?? "null")}
                              </span>
                            </div>
                            <ArrowLeftRight className="w-3 h-3 text-gray-400" />
                            <div className="flex-1 bg-green-50 border border-green-200 rounded px-2 py-1">
                              <span className="text-xs text-green-600">To:</span>{" "}
                              <span className="text-green-900">
                                {String(change.new ?? "null")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {log.action === "DELETE" && log.old_values && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-red-900 mb-2">
                        Deleted Values
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(log.old_values).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-gray-600 font-mono text-xs">
                              {key}:
                            </span>
                            <span className="text-gray-900">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AuditTrailInlineProps {
  recordId: string;
  tableName: string;
}

export function AuditTrailInline({ recordId, tableName }: AuditTrailInlineProps) {
  return (
    <div className="mt-6">
      <AuditTrail recordId={recordId} tableName={tableName} />
    </div>
  );
}
