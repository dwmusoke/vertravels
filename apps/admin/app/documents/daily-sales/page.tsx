"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DollarSign,
  Upload,
  Search,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  FileText,
  Trash2,
} from "lucide-react";
import { exportToExcel } from "@/lib/excel-utils";

interface SalesRecord {
  date: string;
  customer: string;
  amount: number;
  payment_method: string;
  reference: string;
  notes: string;
}

interface UploadedReport {
  id: string;
  file_name: string;
  file_path: string;
  record_count: number;
  total_sales: number;
  uploaded_at: string;
}

export default function DailySalesPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [uploadedReports, setUploadedReports] = useState<UploadedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchUploadedReports();
  }, []);

  async function fetchUploadedReports() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("daily_sales_reports")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setUploadedReports(data || []);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }

  function parseCSV(text: string): SalesRecord[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const dateIdx = headers.indexOf("date");
    const customerIdx = headers.indexOf("customer");
    const amountIdx = headers.indexOf("amount");
    const methodIdx = headers.indexOf("payment_method");
    const refIdx = headers.indexOf("reference");
    const notesIdx = headers.indexOf("notes");

    if (dateIdx === -1 || customerIdx === -1 || amountIdx === -1) {
      throw new Error("CSV must contain at minimum: date, customer, amount columns");
    }

    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        date: cols[dateIdx] || "",
        customer: cols[customerIdx] || "",
        amount: parseFloat(cols[amountIdx]) || 0,
        payment_method: methodIdx >= 0 ? cols[methodIdx] || "" : "",
        reference: refIdx >= 0 ? cols[refIdx] || "" : "",
        notes: notesIdx >= 0 ? cols[notesIdx] || "" : "",
      };
    });
  }

  async function handleFileUpload(file: File) {
    try {
      setUploading(true);
      const text = await file.text();
      const parsed = parseCSV(text);
      setRecords(parsed);

      const filePath = `daily-sales/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const totalSales = parsed.reduce((sum, r) => sum + r.amount, 0);

      const { error: dbError } = await supabase.from("daily_sales_reports").insert([
        {
          file_name: file.name,
          file_path: filePath,
          record_count: parsed.length,
          total_sales: totalSales,
        },
      ]);

      if (dbError) throw dbError;

      await fetchUploadedReports();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert("Failed to upload: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFileUpload(file);
    } else {
      alert("Please upload a CSV file");
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  }

  async function handleExport() {
    const data = filteredRecords.length > 0 ? filteredRecords : records;
    const columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Payment Method", key: "payment_method", width: 20 },
      { header: "Reference", key: "reference", width: 20 },
      { header: "Notes", key: "notes", width: 25 },
    ];

    await exportToExcel(data, "daily-sales-export", {
      columns,
      branded: true,
    });
  }

  async function handleDeleteReport(id: string) {
    if (!confirm("Delete this report?")) return;

    try {
      const { error } = await supabase.from("daily_sales_reports").delete().eq("id", id);
      if (error) throw error;
      fetchUploadedReports();
    } catch (error: any) {
      console.error("Error deleting report:", error);
    }
  }

  const filteredRecords = records.filter((r) => {
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });

  const summary = {
    totalSales: filteredRecords.reduce((sum, r) => sum + r.amount, 0),
    count: filteredRecords.length,
    avgSale: filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.amount, 0) / filteredRecords.length
      : 0,
  };

  const methodBreakdown = filteredRecords.reduce<Record<string, number>>((acc, r) => {
    const method = r.payment_method || "Unknown";
    acc[method] = (acc[method] || 0) + r.amount;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Daily Sales Reports
          </h1>
          <p className="text-gray-600">
            Upload CSV files and track daily sales performance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={records.length === 0}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-colors cursor-pointer ${
          dragOver
            ? "border-sky-500 bg-sky-50"
            : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-1">
          Drop your CSV file here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          CSV must include columns: date, customer, amount, payment_method, reference, notes
        </p>
      </div>

      {/* Date Range Filter */}
      {records.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-green-600">
              ${summary.totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold">{summary.count}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Avg Sale</p>
            <p className="text-2xl font-bold text-sky-600">
              ${summary.avgSale.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Records Loaded</p>
            <p className="text-2xl font-bold">{records.length}</p>
          </div>
        </div>
      )}

      {/* Method Breakdown */}
      {records.length > 0 && Object.keys(methodBreakdown).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Payment Method Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(methodBreakdown).map(([method, total]) => (
              <div key={method} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{method}</p>
                <p className="text-lg font-bold">${total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parsed Data Table */}
      {records.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold">Parsed Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{record.date}</td>
                    <td className="px-6 py-3 font-medium">{record.customer}</td>
                    <td className="px-6 py-3 font-medium text-green-600">
                      ${record.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                        {record.payment_method || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-mono">
                      {record.reference || "—"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {record.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Upload a CSV file to see data</p>
          </div>
        )
      )}

      {/* Previously Uploaded Reports */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold">Previously Uploaded Reports</h3>
          <button
            onClick={fetchUploadedReports}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-sky-500" />
            <p className="text-sm text-gray-500">Loading reports...</p>
          </div>
        ) : uploadedReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No reports uploaded yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Uploaded At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {uploadedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-sm">{report.file_name}</td>
                  <td className="px-6 py-4 text-sm">{report.record_count}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    ${report.total_sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(report.uploaded_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
