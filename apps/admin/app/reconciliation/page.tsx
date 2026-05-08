"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@vertravels/ui';
import { createClient } from "@/lib/supabase/client";
import {
  RefreshCcw,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  Upload,
  Eye,
  Plane,
  Building2,
} from "lucide-react";

interface ReconciliationItem {
  id: string;
  booking_ref: string;
  pnr: string;
  airline_code: string;
  type: "IATA" | "NON_IATA";
  our_amount: number;
  bsp_amount: number;
  difference: number;
  commission_our: number;
  commission_bsp: number;
  commission_diff: number;
  status: "matched" | "mismatch" | "pending" | "missing_bsp" | "missing_ours";
  booking_date: string;
  travel_date: string;
}

interface BSPReport {
  report_id: string;
  period: string;
  airline_code: string;
  total_sales: number;
  total_commission: number;
  booking_count: number;
  uploaded_date: string;
  status: "pending" | "reconciled" | "discrepancy";
}

interface ReconciliationStats {
  totalBookings: number;
  matchedCount: number;
  mismatchCount: number;
  pendingCount: number;
  totalDiscrepancy: number;
  bspSales: number;
  ourSales: number;
  commissionEarned: number;
  commissionPending: number;
}

export default function ReconciliationPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [items, setItems] = useState<ReconciliationItem[]>([]);
  const [bspReports, setBspReports] = useState<BSPReport[]>([]);
  const [stats, setStats] = useState<ReconciliationStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAirline, setFilterAirline] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      await fetchBookings();
      await fetchBSPReports();
      calculateStats();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select(
        `
        *,
        iata_tracking (
          pnr,
          airline_code,
          iata_booking,
          commission_amount,
          base_fare,
          taxes,
          total_amount
        )
      `,
      )
      .eq("module_type", "flights")
      .order("booking_date", { ascending: false });

    const formattedItems: ReconciliationItem[] = (bookingsData || []).map(
      (booking: any) => {
        const iata = booking.iata_tracking;
        const bspAmount = iata ? iata.total_amount : 0;
        const ourAmount = booking.total_amount;
        const bspCommission = iata ? iata.commission_amount : 0;
        const ourCommission = iata ? iata.commission_amount : 0;

        return {
          id: booking.id,
          booking_ref: booking.booking_ref,
          pnr: iata?.pnr || booking.pnr || "N/A",
          airline_code: iata?.airline_code || "N/A",
          type: iata?.iata_booking ? "IATA" : "NON_IATA",
          our_amount: ourAmount,
          bsp_amount: bspAmount,
          difference: ourAmount - bspAmount,
          commission_our: ourCommission,
          commission_bsp: bspCommission,
          commission_diff: ourCommission - bspCommission,
          status: determineStatus(booking, iata),
          booking_date: booking.booking_date,
          travel_date: booking.travel_date,
        };
      },
    );

    setItems(formattedItems);
  }

  function determineStatus(
    booking: any,
    iata: any,
  ): ReconciliationItem["status"] {
    if (!iata) return "missing_bsp";
    if (Math.abs(booking.total_amount - iata.total_amount) > 1)
      return "mismatch";
    if (Math.abs(booking.total_amount - iata.total_amount) <= 1)
      return "matched";
    return "pending";
  }

  async function fetchBSPReports() {
    const { data } = await supabase
      .from("bsp_reports")
      .select("*")
      .order("uploaded_date", { ascending: false });

    setBspReports(data || []);
  }

  function calculateStats() {
    const totalBookings = items.length;
    const matchedCount = items.filter((i) => i.status === "matched").length;
    const mismatchCount = items.filter((i) => i.status === "mismatch").length;
    const pendingCount = items.filter(
      (i) => i.status === "pending" || i.status === "missing_bsp",
    ).length;
    const totalDiscrepancy = items.reduce(
      (sum, i) => sum + Math.abs(i.difference),
      0,
    );
    const bspSales = items.reduce((sum, i) => sum + i.bsp_amount, 0);
    const ourSales = items.reduce((sum, i) => sum + i.our_amount, 0);
    const commissionEarned = items.reduce(
      (sum, i) => sum + i.commission_our,
      0,
    );

    setStats({
      totalBookings,
      matchedCount,
      mismatchCount,
      pendingCount,
      totalDiscrepancy,
      bspSales,
      ourSales,
      commissionEarned,
      commissionPending: items
        .filter((i) => i.status !== "matched")
        .reduce((sum, i) => sum + i.commission_our, 0),
    });
  }

  async function runReconciliation() {
    try {
      setReconciling(true);

      const { data: bookings } = await supabase
        .from("bookings")
        .select(
          `
          *,
          iata_tracking (
            pnr,
            airline_code,
            total_amount,
            commission_amount
          )
        `,
        )
        .eq("module_type", "flights")
        .gte("booking_date", dateFrom || "2020-01-01")
        .lte("booking_date", dateTo || new Date().toISOString());

      const { data: bspData } = await supabase
        .from("bsp_line_items")
        .select("*")
        .gte("document_date", dateFrom || "2020-01-01")
        .lte("document_date", dateTo || new Date().toISOString());

      const matched = [];
      const mismatches = [];

      for (const booking of bookings || []) {
        const iata = booking.iata_tracking;
        if (!iata?.pnr) continue;

        const bspMatch = (bspData || []).find(
          (bsp: any) =>
            bsp.pnr === iata.pnr || bsp.ticket_number === iata.ticket_number,
        );

        if (bspMatch) {
          const amountDiff = Math.abs(
            booking.total_amount - bspMatch.total_fare,
          );
          const commissionDiff = Math.abs(
            (iata.commission_amount || 0) - (bspMatch.commission || 0),
          );

          if (amountDiff > 1 || commissionDiff > 0.5) {
            mismatches.push({
              booking_id: booking.id,
              pnr: iata.pnr,
              our_amount: booking.total_amount,
              bsp_amount: bspMatch.total_fare,
              difference: amountDiff,
              commission_diff: commissionDiff,
            });
          } else {
            matched.push(booking.id);
          }

          await supabase.from("bsp_reconciliation").insert({
            booking_id: booking.id,
            bsp_line_item_id: bspMatch.id,
            status: amountDiff > 1 ? "mismatch" : "matched",
            our_amount: booking.total_amount,
            bsp_amount: bspMatch.total_fare,
            difference: amountDiff,
            reconciled_at: new Date().toISOString(),
            reconciled_by: (await supabase.auth.getUser()).data.user?.id,
          });
        }
      }

      alert(
        `Reconciliation complete!\nMatched: ${matched.length}\nMismatches: ${mismatches.length}`,
      );
      fetchData();
    } catch (error) {
      console.error("Reconciliation error:", error);
      alert("Reconciliation failed. Please try again.");
    } finally {
      setReconciling(false);
    }
  }

  async function exportReport() {
    const report = {
      generated_at: new Date().toISOString(),
      period: `${dateFrom || "Start"} to ${dateTo || "Now"}`,
      stats,
      mismatches: items.filter((i) => i.status === "mismatch"),
      pending: items.filter(
        (i) => i.status === "pending" || i.status === "missing_bsp",
      ),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bsp-reconciliation-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  }

  async function handleBSPUpload(file: File) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `bsp-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("bsp-reports")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      alert("BSP report uploaded successfully! Processing will begin shortly.");
      setShowUploadModal(false);

      // In production, trigger edge function to parse BSP file
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload BSP report");
    }
  }

  const filteredItems = items.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterAirline !== "all" && item.airline_code !== filterAirline)
      return false;
    if (
      searchQuery &&
      !item.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.pnr.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const airlines = Array.from(new Set(items.map((i) => i.airline_code))).filter(
    (a) => a !== "N/A",
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            BSP Reconciliation
          </h1>
          <p className="text-gray-600 mt-1">
            Match bookings with BSP reports and track discrepancies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload BSP Report
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={runReconciliation} disabled={reconciling}>
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${reconciling ? "animate-spin" : ""}`}
            />
            {reconciling ? "Reconciling..." : "Run Reconciliation"}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalBookings}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Matched</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.matchedCount}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Mismatches</div>
            <div className="text-2xl font-bold text-red-600">
              {stats.mismatchCount}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingCount}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Discrepancy</div>
            <div className="text-xl font-bold text-orange-600">
              ${stats.totalDiscrepancy.toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">BSP Sales</div>
            <div className="text-xl font-bold text-gray-900">
              ${stats.bspSales.toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Our Sales</div>
            <div className="text-xl font-bold text-gray-900">
              ${stats.ourSales.toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Commission</div>
            <div className="text-xl font-bold text-green-600">
              ${stats.commissionEarned.toFixed(2)}
            </div>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Booking ref or PNR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="w-[150px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="mismatch">Mismatch</option>
              <option value="pending">Pending</option>
              <option value="missing_bsp">Missing in BSP</option>
            </select>
          </div>

          <div className="w-[150px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Airline
            </label>
            <select
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Airlines</option>
              {airlines.map((airline) => (
                <option key={airline} value={airline}>
                  {airline}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="w-[140px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking Ref
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PNR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Airline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Our Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  BSP Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Difference
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sky-600">
                    #{item.booking_ref}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{item.pnr}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-gray-400" />
                      <span>{item.airline_code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.type === "IATA" ? "default" : "info"}>
                      {item.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${item.our_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">${item.bsp_amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div
                      className={`font-medium ${item.difference !== 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {item.difference !== 0
                        ? `$${item.difference.toFixed(2)}`
                        : "$0.00"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-green-600 font-medium">
                      ${item.commission_our.toFixed(2)}
                    </div>
                    {item.commission_diff !== 0 && (
                      <div className="text-xs text-red-500">
                        Diff: ${item.commission_diff.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        item.status === "matched"
                          ? "success"
                          : item.status === "mismatch"
                            ? "destructive"
                            : item.status === "missing_bsp"
                              ? "warning"
                              : "default"
                      }
                    >
                      {item.status === "matched" && (
                        <CheckCircle className="w-3 h-3 mr-1 inline" />
                      )}
                      {item.status === "mismatch" && (
                        <XCircle className="w-3 h-3 mr-1 inline" />
                      )}
                      {item.status === "missing_bsp" && (
                        <AlertTriangle className="w-3 h-3 mr-1 inline" />
                      )}
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/bookings/${item.id}`, "_blank")
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {item.status === "mismatch" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-600"
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No reconciliation items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Upload BSP Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Reporting Period
                </label>
                <input
                  type="month"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  BSP Report File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.txt"
                  onChange={(e) =>
                    e.target.files?.[0] && handleBSPUpload(e.target.files[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload BSP sales report (CSV, Excel, or TXT format)
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => {}}>Upload & Process</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
