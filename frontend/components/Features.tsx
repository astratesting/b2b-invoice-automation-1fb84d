import {
  Brain,
  GitBranch,
  BarChart3,
  Shield,
  Plug,
  Bell,
  FileSearch,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    category: "AI Extraction",
    title: "Extract every field — automatically",
    description:
      "Our fine-tuned LLM reads PDFs, scanned images, XML, and EDI files. It captures vendor details, line items, tax codes, PO references, and GL codes with 99.4% accuracy — no templates, no training data required.",
    highlights: [
      "Multi-format: PDF, XML, CSV, EDI 810",
      "Handles handwritten & low-res scans",
      "Auto-learns from correction feedback",
    ],
    color: "blue",
    large: true,
  },
  {
    icon: GitBranch,
    category: "Workflow Automation",
    title: "Custom approval routing",
    description:
      "Build multi-tier approval chains with drag-and-drop. Route by amount, department, vendor, cost center, or PO match status. Auto-escalate on SLA breach.",
    highlights: [
      "Unlimited approval tiers",
      "SLA-based auto-escalation",
      "Parallel & sequential routing",
    ],
    color: "indigo",
    large: false,
  },
  {
    icon: BarChart3,
    category: "Analytics Dashboard",
    title: "Real-time AP intelligence",
    description:
      "Track cycle times, approval bottlenecks, vendor performance, and spend by category. Export to Excel or push to your BI tool via API.",
    highlights: [
      "Live spend & cycle dashboards",
      "Vendor scorecard & aging reports",
      "Early payment discount tracker",
    ],
    color: "violet",
    large: false,
  },
  {
    icon: FileSearch,
    category: "3-Way PO Match",
    title: "Eliminate unauthorized spend",
    description:
      "Automatically match invoices against POs and goods receipts in your ERP. Flag discrepancies before they reach approvers.",
    highlights: [
      "Quantity & price tolerance rules",
      "Partial receipt matching",
      "Duplicate invoice detection",
    ],
    color: "cyan",
    large: false,
  },
  {
    icon: Shield,
    category: "Fraud & Compliance",
    title: "Protect every payment",
    description:
      "AI flags vendor impersonation, duplicate submissions, and anomalous patterns in real time. Full audit trail for SOX, GDPR, and AP forensics.",
    highlights: [
      "Duplicate & ghost vendor detection",
      "Immutable audit log",
      "SOX & GDPR compliance exports",
    ],
    color: "green",
    large: false,
  },
  {
    icon: Plug,
    category: "Integrations",
    title: "Connects to your existing stack",
    description:
      "Native connectors for SAP, Oracle NetSuite, QuickBooks, Xero, Sage, and Microsoft Dynamics. REST API + webhooks for custom integrations.",
    highlights: [
      "SAP, NetSuite, QuickBooks, Xero",
      "REST API & webhooks",
      "Pre-built Zapier & Make flows",
    ],
    color: "orange",
    large: false,
  },
  {
    icon: Bell,
    category: "Smart Notifications",
    title: "Approvers act, not chase",
    description:
      "Contextual Slack, Teams, and email nudges include invoice preview, vendor context, and one-click approve/reject — no login required.",
    highlights: [
      "Slack & Teams native actions",
      "One-click approve from email",
      "Configurable reminder cadence",
    ],
    color: "pink",
    large: false,
  },
  {
    icon: Layers,
    category: "Multi-entity",
    title: "One platform, all your entities",
    description:
      "Manage invoices across subsidiaries, currencies, and tax jurisdictions from a single workspace. Granular RBAC by entity and department.",
    highlights: [
      "Multi-currency & multi-entity",
      "Consolidated reporting",
      "Per-entity workflow rules",
    ],
    color: "amber",
    large: false,
  },
];

const colorMap: Record<
  string,
  { bg: string; icon: string; badge: string; dot: string }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  pink: {
    bg: "bg-pink-50",
    icon: "text-pink-600",
    badge: "bg-pink-100 text-pink-700",
    dot: "bg-pink-500",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-700 mb-4">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Built for AP teams at scale
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Everything your AP team needs.
            <br />
            <span className="text-gray-400">Nothing they don&apos;t.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            InvoiceAI replaces spreadsheets, email chains, and disconnected tools
            with a single intelligent platform purpose-built for B2B invoice
            operations.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const colors = colorMap[feature.color];
            const isFirst = idx === 0;

            return (
              <div
                key={feature.title}
                className={`group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 ${
                  isFirst ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                {/* Category badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center ${colors.icon}`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}
                  >
                    {feature.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-4">
            See all features in action — no sales call needed.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Explore the full platform
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
