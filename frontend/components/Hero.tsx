"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const trustBadges = [
  "SOC 2 Type II",
  "ISO 27001",
  "GDPR Compliant",
  "99.9% Uptime SLA",
];

const socialProof = [
  { value: "800+", label: "B2B companies" },
  { value: "$4.2B", label: "Invoices processed" },
  { value: "4.9★", label: "G2 rating" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white pt-16 pb-24">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Announcement banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-800 font-medium">
              New: GPT-4o powered extraction engine — 40% faster
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Invoice processing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              on autopilot
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            InvoiceAI extracts, validates, and routes every invoice automatically.
            Cut your AP cycle from weeks to hours — with 99.4% extraction accuracy
            and zero manual data entry.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
          >
            Start free 14-day trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-xl border border-gray-200 transition-all shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
            </div>
            Watch 3-min demo
          </button>
        </div>

        {/* No CC required */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-14">
          {["No credit card required", "Live in under 30 minutes", "Cancel anytime"].map(
            (item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span>{item}</span>
              </div>
            )
          )}
        </div>

        {/* Social proof numbers */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-14">
          {socialProof.map((sp) => (
            <div key={sp.label} className="text-center">
              <div className="text-3xl font-black text-gray-900">{sp.value}</div>
              <div className="text-sm text-gray-500">{sp.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-400 font-mono max-w-xs mx-auto text-center">
                  app.invoiceai.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard preview content */}
            <div className="p-6 bg-gray-50">
              {/* Mini KPI row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Processed", value: "1,247", icon: CheckCircle, color: "text-green-600 bg-green-50" },
                  { label: "Pending", value: "38", icon: Clock2, color: "text-amber-600 bg-amber-50" },
                  { label: "Saved", value: "$184k", icon: BarChart3, color: "text-blue-600 bg-blue-50" },
                  { label: "AI Accuracy", value: "99.4%", icon: Zap, color: "text-purple-600 bg-purple-50" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs mb-2 ${item.color}`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 leading-none mb-1">
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini invoice table */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Recent Invoices
                  </span>
                  <span className="text-xs text-blue-600 font-medium">View all →</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { vendor: "Salesforce Inc.", amount: "$42,800", status: "approved", conf: 99 },
                    { vendor: "Amazon AWS", amount: "$18,340", status: "processing", conf: 97 },
                    { vendor: "McKinsey & Co.", amount: "$95,000", status: "pending", conf: 94 },
                  ].map((inv) => (
                    <div
                      key={inv.vendor}
                      className="flex items-center justify-between px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">
                          {inv.vendor.slice(0, 1)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {inv.vendor}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-900">
                          {inv.amount}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            inv.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : inv.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {inv.status}
                        </span>
                        <span className="text-xs text-gray-400">{inv.conf}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {trustBadges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-green-500" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clock2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
