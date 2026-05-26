"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSupabaseWithAuth } from "@/lib/auth";

type Invoice = {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  status: string;
  confidence: number;
  category: string;
};

const staticInvoices: Invoice[] = [
  {
    id: "INV-2024-4821",
    vendor: "Salesforce Inc.",
    amount: "$42,800.00",
    date: "May 25, 2026",
    status: "approved",
    confidence: 99,
    category: "Software & SaaS",
  },
  {
    id: "INV-2024-4820",
    vendor: "AWS / Amazon",
    amount: "$18,340.00",
    date: "May 25, 2026",
    status: "processing",
    confidence: 97,
    category: "Cloud Infrastructure",
  },
  {
    id: "INV-2024-4819",
    vendor: "McKinsey & Co.",
    amount: "$95,000.00",
    date: "May 24, 2026",
    status: "pending",
    confidence: 94,
    category: "Professional Services",
  },
  {
    id: "INV-2024-4818",
    vendor: "WeWork Global",
    amount: "$28,500.00",
    date: "May 24, 2026",
    status: "approved",
    confidence: 100,
    category: "Office & Facilities",
  },
  {
    id: "INV-2024-4817",
    vendor: "HubSpot Inc.",
    amount: "$7,200.00",
    date: "May 23, 2026",
    status: "exception",
    confidence: 71,
    category: "Marketing",
  },
];

const kpis = [
  {
    label: "Invoices This Month",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    color: "blue",
    sub: "vs. last month",
  },
  {
    label: "Pending Approval",
    value: "38",
    change: "-8 from yesterday",
    trend: "down",
    icon: Clock,
    color: "amber",
    sub: "avg. 4.2hr wait",
  },
  {
    label: "Processed Today",
    value: "94",
    change: "+23%",
    trend: "up",
    icon: CheckCircle,
    color: "green",
    sub: "99.1% accuracy",
  },
  {
    label: "Exceptions",
    value: "6",
    change: "-14%",
    trend: "down",
    icon: AlertTriangle,
    color: "red",
    sub: "requires review",
  },
];

const volumeData = [
  { month: "Dec", invoices: 980, processed: 961 },
  { month: "Jan", invoices: 1050, processed: 1031 },
  { month: "Feb", invoices: 890, processed: 880 },
  { month: "Mar", invoices: 1120, processed: 1108 },
  { month: "Apr", invoices: 1180, processed: 1170 },
  { month: "May", invoices: 1247, processed: 1235 },
];

const spendData = [
  { category: "Software & SaaS", amount: 284000 },
  { category: "Professional Services", amount: 198000 },
  { category: "Office & Facilities", amount: 142000 },
  { category: "Marketing", amount: 96000 },
  { category: "Travel & Expense", amount: 78000 },
];

const pieData = [
  { name: "Auto-approved", value: 68, color: "#22c55e" },
  { name: "Manual review", value: 24, color: "#3b82f6" },
  { name: "Exceptions", value: 8, color: "#ef4444" },
];

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
  },
  exception: {
    label: "Exception",
    className: "bg-red-100 text-red-700",
  },
};

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
};

export default function DashboardPage() {
  const { getClient } = useSupabaseWithAuth();
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>(staticInvoices);

  useEffect(() => {
    getClient()
      .then((client) =>
        client
          .from("invoices")
          .select("id, vendor, amount, date, status, confidence, category")
          .order("date", { ascending: false })
          .limit(5)
      )
      .then(({ data }) => {
        if (data && data.length > 0) setRecentInvoices(data as Invoice[]);
      })
      .catch(() => {
        // Supabase not configured yet — static data stays
      });
  }, [getClient]);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monday, May 25, 2026 · Meridian Logistics
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[kpi.color]}`}
              >
                <kpi.icon className="w-5 h-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trend === "up" && kpi.color !== "red"
                    ? "text-green-600"
                    : kpi.trend === "down" && kpi.color === "red"
                      ? "text-green-600"
                      : kpi.trend === "up" && kpi.color === "red"
                        ? "text-red-600"
                        : "text-green-600"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {kpi.value}
            </div>
            <div className="text-sm text-gray-500">{kpi.label}</div>
            <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Volume trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Invoice Volume</h2>
              <p className="text-sm text-gray-500">Received vs. processed</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              99.1% processing rate
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="invoices"
                name="Received"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorInv)"
              />
              <Area
                type="monotone"
                dataKey="processed"
                name="Processed"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorProc)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Approval distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">Approval Split</h2>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {entry.value}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <div className="text-xs text-gray-500">fully automated</div>
          </div>
        </div>
      </div>

      {/* Spend by category + AI confidence */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Spend by Category</h2>
              <p className="text-sm text-gray-500">May 2026</p>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              Full report <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={spendData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={160}
              />
              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString()}`
                }
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Performance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">AI Performance</h2>
            <p className="text-sm text-gray-500">Extraction engine stats</p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Overall accuracy", value: 99.4, color: "bg-green-500" },
              { label: "PO match rate", value: 94.1, color: "bg-blue-500" },
              { label: "Duplicate detection", value: 100, color: "bg-purple-500" },
              { label: "Fraud flags precision", value: 91.8, color: "bg-orange-500" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-semibold text-gray-900">{m.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`${m.color} h-1.5 rounded-full`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">
              Model last retrained{" "}
              <span className="font-medium text-gray-700">3 days ago</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Invoices</h2>
            <p className="text-sm text-gray-500">Latest activity across all vendors</p>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-3">
                  Invoice
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                  Vendor
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                  Category
                </th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                  AI Confidence
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInvoices.map((inv) => {
                const status = statusConfig[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-medium text-gray-900">
                        {inv.id}
                      </div>
                      <div className="text-xs text-gray-400">{inv.date}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                          {inv.vendor.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {inv.vendor}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">
                        {inv.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {inv.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              inv.confidence >= 95
                                ? "bg-green-500"
                                : inv.confidence >= 80
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${inv.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {inv.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Upload invoices",
            desc: "Drag & drop or browse",
            icon: FileText,
            color: "blue",
          },
          {
            label: "Review exceptions",
            desc: "6 need attention",
            icon: AlertTriangle,
            color: "red",
          },
          {
            label: "Approve pending",
            desc: "38 awaiting your sign-off",
            icon: CheckCircle,
            color: "green",
          },
          {
            label: "View spend report",
            desc: "May 2026 summary",
            icon: DollarSign,
            color: "purple",
          },
        ].map((action) => (
          <button
            key={action.label}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-blue-100 transition-all group shadow-sm"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                action.color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : action.color === "red"
                    ? "bg-red-50 text-red-600"
                    : action.color === "green"
                      ? "bg-green-50 text-green-600"
                      : "bg-purple-50 text-purple-600"
              }`}
            >
              <action.icon className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {action.label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
