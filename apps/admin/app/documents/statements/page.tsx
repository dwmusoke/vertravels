"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  Download,
  Mail,
  RefreshCw,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { exportToExcel } from "@/lib/excel-utils";

interface CustomerStatement {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  statement_date: string;
  period_start: string;
  period_end: string;
  opening_balance: number;
  closing_balance: number;
  total_invoices: number;
  total_payments: number;
  aging_current: number;
  aging_30: number;
  aging_60: number;
  aging_90: number;
  status: "pending" | "sent" | "viewed";
  created_at: string;
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<CustomerStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const supabase = createClient();

  useEffect(() => {
    fetchStatements();
  }, []);

  async function fetchStatements() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customer_statements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStatements(data || []);
    } catch (error: any) {
      console.error("Error fetching statements:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateStatement() {
    try {
      // Get all customers with outstanding balances
      const { data: customers, error: customerError } = await supabase
        .from("invoices")
        .select("customer_id, customer_name, customer_email")
        .eq("status", "overdue")
        .or("status.eq.sent,status.eq.draft");

      if (customerError) throw customerError;

      let generated = 0;

      for (const customer of customers) {
        const { data: invoices } = await supabase
          .from("invoices")
          .select("total, status, issue_date, paid_date")
          .eq("customer_id", customer.customer_id)
          .gte("issue_date", dateRange.start)
          .lte("issue_date", dateRange.end);

        const { data: payments } = await supabase
          .from("payment_receipts")
          .select("amount, payment_date")
          .eq("customer_id", customer.customer_id)
          .gte("payment_date", dateRange.start)
          .lte("payment_date", dateRange.end);

        const totalInvoices = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
        const totalPayments = payments?.reduce((sum, pay) => sum + (pay.amount || 0), 0) || 0;
        const closingBalance = totalInvoices - totalPayments;

        const statementNumber = `STMT-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const { error } = await supabase.from("customer_statements").insert([
          {
            customer_id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_email: customer.customer_email,
            statement_date: new Date().toISOString(),
            period_start: dateRange.start,
            period_end: dateRange.end,
            opening_balance: 0,
            closing_balance: closingBalance,
            total_invoices: totalInvoices,
            total_payments: totalPayments,
            aging_current: closingBalance > 0 ? closingBalance : 0,
            aging_30: 0,
            aging_60: 0,
            aging_90: 0,
            status: "pending",
          },
        ]);

        if (!error) generated++;
      }

      alert(`Generated ${generated} customer statements`);
      fetchStatements();
    } catch (error: any) {
      console.error("Error generating statements:", error);
      alert("Failed to generate statements: " + error.message);
    }
  }

  async function handleSendEmail(statement: CustomerStatement) {
    try {
      await supabase
        .from("customer_statements")
        .update({ status: "sent" })
        .eq("id", statement.id);

      alert(`Statement sent to ${statement.customer_email}`);
      fetchStatements();
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  }

  async function handleExport(statement: CustomerStatement) {
    const data = [
      {
        "Customer Name": statement.customer_name,
        "Customer Email": statement.customer_email,
        "Statement Date": statement.statement_date,
        "Period Start": statement.period_start,
        "Period End": statement.period_end,
        "Opening Balance": statement.opening_balance,
        "Closing Balance": statement.closing_balance,
        "Total Invoices": statement.total_invoices,
        "Total Payments": statement.total_payments,
        "Current": statement.aging_current,
        "30 Days": statement.aging_30,
        "60 Days": statement.aging_60,
        "90 Days": statement.aging_90,
      },
    ];

    const columns = [
      { header: "Customer Name", key: "Customer Name", width: 25 },
      { header: "Customer Email", key: "Customer Email", width: 30 },
      { header: "Statement Date", key: "Statement Date", width: 15 },
      { header: "Period Start", key: "Period Start", width: 15 },
      { header: "Period End", key: "Period End", width: 15 },
      { header: "Opening Balance", key: "Opening Balance", width: 15 },
      { header: "Closing Balance", key: "Closing Balance", width: 15 },
      { header: "Total Invoices", key: "Total Invoices", width: 15 },
      { header: "Total Payments", key: "Total Payments", width: 15 },
      { header: "Current", key: "Current", width: 12 },
      { header: "30 Days", key: "30 Days", width: 12 },
      { header: "60 Days", key: "60 Days", width: 12 },
      { header: "90 Days", key: "90 Days", width: 12 },
    ];

    await exportToExcel(data, `statement-${statement.customer_name}`, {
      columns,
      branded: true,
    });
  }

  const stats = {
    total: statements.length,
    pending: statements.filter((s) => s.status === "pending").length,
    sent: statements.filter((s) => s.status === "sent").length,
    totalOutstanding: statements.reduce((sum, s) => sum + (s.closing_balance || 0), 0),
  };

  const filtered = statements.filter((statement) => {
    const matchesSearch =
      statement.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      statement.customer_email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Customer Statements
          </h1>
          <p className="text-gray-600">
            Generate and send account statements to customers
          </p>
        </div>
        <button
          onClick={handleGenerateStatement}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          Generate Statements
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <h3 className="font-medium text-gray-900 mb-4">Statement Period</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Start
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period End
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateStatement}
              className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Generate for Period
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Statements</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${stats.totalOutstanding.toLocaleString()}
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
              placeholder="Search by customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <button
            onClick={fetchStatements}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Aging Summary */}
      {statements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Aging Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Current</p>
              <p className="text-2xl font-bold text-green-700">
                ${statements.reduce((sum, s) => sum + (s.aging_current || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">30 Days</p>
              <p className="text-2xl font-bold text-blue-700">
                ${statements.reduce((sum, s) => sum + (s.aging_30 || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 mb-1">60 Days</p>
              <p className="text-2xl font-bold text-yellow-700">
                ${statements.reduce((sum, s) => sum + (s.aging_60 || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 mb-1">90+ Days</p>
              <p className="text-2xl font-bold text-red-700">
                ${statements.reduce((sum, s) => sum + (s.aging_90 || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading statements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No statements found</p>
          <p className="text-sm text-gray-500 mt-2">
            Generate statements for customers with outstanding balances
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statement Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
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
              {filtered.map((statement) => (
                <tr key={statement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{statement.customer_name}</p>
                      <p className="text-xs text-gray-500">{statement.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(statement.statement_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-xs text-gray-600">
                      {new Date(statement.period_start).toLocaleDateString()} -{" "}
                      {new Date(statement.period_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-gray-600">
                      ${statement.total_invoices?.toLocaleString() || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-green-600">
                      ${statement.total_payments?.toLocaleString() || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <span className={statement.closing_balance > 0 ? "text-red-600" : "text-green-600"}>
                      ${statement.closing_balance?.toLocaleString() || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statement.status === "sent"
                          ? "bg-blue-100 text-blue-700"
                          : statement.status === "viewed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendEmail(statement)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExport(statement)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Export"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
