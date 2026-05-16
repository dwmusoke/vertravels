"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Clock,
  Plane,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";

interface PNRRecord {
  id: string;
  batch_id: string;
  record_number: number;
  pnr: string;
  ticket_number?: string;
  passenger_name: string;
  airline_code: string;
  flight_date: string;
  route: string;
  fare: number;
  tax: number;
  commission: number;
  total: number;
  status: "pending" | "success" | "error" | "duplicate";
  error_message?: string;
  booking_id?: string;
  processed_at?: string;
}

interface PNRBatch {
  id: string;
  batch_number: string;
  source_type: string;
  source_file?: string;
  airline_code?: string;
  total_records: number;
  processed_records: number;
  success_count: number;
  error_count: number;
  status: "pending" | "processing" | "completed" | "failed";
  uploaded_by?: string;
  uploaded_at: string;
  processed_at?: string;
}

export default function PNRIngestionPage() {
  const [batches, setBatches] = useState<PNRBatch[]>([]);
  const [records, setRecords] = useState<PNRRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<PNRBatch | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    fetchBatches();
  }, []);

  async function fetchBatches() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pnr_ingestion_batches")
        .select("*")
        .order("uploaded_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setBatches(data || []);
    } catch (error: any) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBatchRecords(batchId: string) {
    try {
      const { data, error } = await supabase
        .from("pnr_ingestion_records")
        .select("*")
        .eq("batch_id", batchId)
        .order("record_number");

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      console.error("Error fetching records:", error);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `pnr_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("pnr-ingestion")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("pnr-ingestion").getPublicUrl(fileName);

      // Parse file content (simplified - in production, parse based on format)
      const content = await file.text();
      const lines = content.split("\n").filter((line) => line.trim());

      // Create batch record
      const batchNumber = `PNR-${Date.now()}`;
      const { data: batch, error: batchError } = await supabase
        .from("pnr_ingestion_batches")
        .insert([
          {
            batch_number: batchNumber,
            source_type: "file_upload",
            source_file: publicUrl,
            airline_code: "AUTO",
            total_records: lines.length,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (batchError) throw batchError;
      if (!batch || !batch.id) throw new Error("Batch created without ID");

      // Parse and insert records (simplified parsing)
      const recordsToInsert = lines.map((line, index) => {
        // Simple CSV parsing - in production, use proper parser
        const parts = line.split(",").map((p) => p.trim());

        return {
          batch_id: batch.id,
          record_number: index + 1,
          pnr: parts[0] || null,
          ticket_number: parts[1] || null,
          passenger_name: parts[2] || null,
          airline_code: parts[3] || null,
          flight_date: parts[4] || null,
          route: parts[5] || null,
          fare: parseFloat(parts[6]) || null,
          tax: parseFloat(parts[7]) || null,
          commission: parseFloat(parts[8]) || null,
          total: parseFloat(parts[9]) || null,
          status: "pending" as const,
        };
      });

      const { data: insertedRecords, error: recordsError } = await supabase
        .from("pnr_ingestion_records")
        .insert(recordsToInsert)
        .select();

      if (recordsError) throw recordsError;
      if (!insertedRecords || insertedRecords.length === 0) {
        throw new Error("Insert returned success but 0 rows were created. Check table permissions.");
      }

      // Update batch status
      await supabase
        .from("pnr_ingestion_batches")
        .update({ status: "processing" })
        .eq("id", batch.id);

      setShowUploadModal(false);
      fetchBatches();

      alert(`Batch ${batchNumber} created with ${lines.length} records`);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Failed to upload file: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function processBatch(batch: PNRBatch) {
    try {
      // Update batch status
      await supabase
        .from("pnr_ingestion_batches")
        .update({ status: "processing" })
        .eq("id", batch.id);

      // Fetch records for this batch
      const { data: records } = await supabase
        .from("pnr_ingestion_records")
        .select("*")
        .eq("batch_id", batch.id)
        .eq("status", "pending");

      if (!records) return;

      let successCount = 0;
      let errorCount = 0;

      // Process each record
      for (const record of records) {
        try {
          // Check if PNR already exists
          const { data: existing } = await supabase
            .from("bookings")
            .select("id")
            .eq("pnr", record.pnr)
            .single();

          if (existing) {
            // Mark as duplicate
            await supabase
              .from("pnr_ingestion_records")
              .update({
                status: "duplicate",
                error_message: "PNR already exists",
                processed_at: new Date().toISOString(),
              })
              .eq("id", record.id);
            errorCount++;
            continue;
          }

          // Create booking
          const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert([
              {
                booking_ref: `PNR-${record.pnr}`,
                pnr: record.pnr,
                module_type: "flights",
                customer_name: record.passenger_name,
                passenger_name: record.passenger_name,
                destination: record.route,
                travel_date: record.flight_date,
                total_amount: record.total,
                currency: "USD",
                payment_status: "pending",
                status: "pending",
              },
            ])
            .select()
            .single();

          if (bookingError) throw bookingError;

          // Update record status
          await supabase
            .from("pnr_ingestion_records")
            .update({
              status: "success",
              booking_id: booking.id,
              processed_at: new Date().toISOString(),
            })
            .eq("id", record.id);

          successCount++;
        } catch (error: any) {
          await supabase
            .from("pnr_ingestion_records")
            .update({
              status: "error",
              error_message: error.message,
              processed_at: new Date().toISOString(),
            })
            .eq("id", record.id);

          errorCount++;
        }
      }

      // Update batch with final counts
      await supabase
        .from("pnr_ingestion_batches")
        .update({
          status: "completed",
          processed_records: records.length,
          success_count: successCount,
          error_count: errorCount,
          processed_at: new Date().toISOString(),
        })
        .eq("id", batch.id);

      fetchBatches();
      alert(`Batch processed: ${successCount} success, ${errorCount} errors`);
    } catch (error: any) {
      console.error("Processing error:", error);
      alert("Failed to process batch: " + error.message);
    }
  }

  const stats = {
    totalBatches: batches.length,
    pending: batches.filter((b) => b.status === "pending").length,
    completed: batches.filter((b) => b.status === "completed").length,
    totalRecords: batches.reduce((sum, b) => sum + b.total_records, 0),
    successRecords: batches.reduce((sum, b) => sum + b.success_count, 0),
    errorRecords: batches.reduce((sum, b) => sum + b.error_count, 0),
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            PNR Ingestion
          </h1>
          <p className="text-gray-600">
            Import PNR data from BSP, airlines, or GDS files
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Upload className="w-4 h-4" />
            Upload PNR File
          </button>
          <button
            onClick={fetchBatches}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Batches</p>
          <p className="text-2xl font-bold">{stats.totalBatches}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.completed}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold">{stats.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Success</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.successRecords}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Errors</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.errorRecords}
          </p>
        </div>
      </div>

      {/* Batches Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading batches...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Ingestion Batches</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Batch #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Success/Error
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {batch.batch_number}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {batch.source_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {batch.airline_code || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {batch.total_records}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-green-600">{batch.success_count}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-600">{batch.error_count}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        batch.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : batch.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : batch.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {batch.status === "processing" && (
                        <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                      )}
                      {batch.status === "completed" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {batch.status === "failed" && (
                        <XCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {batch.status === "pending" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {batch.status.charAt(0).toUpperCase() +
                        batch.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(batch.uploaded_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {batch.status === "pending" && (
                        <button
                          onClick={() => processBatch(batch)}
                          className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                        >
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          fetchBatchRecords(batch.id);
                        }}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      >
                        View Records
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Records Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl">
                  Batch: {selectedBatch.batch_number}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedBatch.total_records} records •{" "}
                  {selectedBatch.success_count} success •{" "}
                  {selectedBatch.error_count} errors
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        #
                      </th>
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
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{record.record_number}</td>
                        <td className="px-4 py-3 font-mono text-sm">{record.pnr}</td>
                        <td className="px-4 py-3 text-sm">{record.passenger_name}</td>
                        <td className="px-4 py-3 text-sm">{record.route}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${record.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              record.status === "success"
                                ? "bg-green-100 text-green-700"
                                : record.status === "error"
                                ? "bg-red-100 text-red-700"
                                : record.status === "duplicate"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600">
                          {record.error_message || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Upload PNR File</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Format
                </label>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-2">CSV Format:</p>
                  <code className="text-xs text-gray-600">
                    PNR,TicketNumber,PassengerName,AirlineCode,FlightDate,Route,Fare,Tax,Commission,Total
                  </code>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={uploading}
                />
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-sky-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading and processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
