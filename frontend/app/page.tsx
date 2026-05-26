import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Building2,
  TrendingUp,
  Clock,
} from "lucide-react";

const stats = [
  { value: "99.4%", label: "Extraction accuracy" },
  { value: "10x", label: "Faster processing" },
  { value: "$2.3M", label: "Avg. annual savings" },
  { value: "72hrs", label: "Payment cycle reduction" },
];

const testimonials = [
  {
    quote:
      "InvoiceAI cut our AP processing time from 3 days to 4 hours. The AI catches discrepancies our team missed for years.",
    author: "Sarah Chen",
    title: "CFO, Meridian Logistics",
    company: "500+ invoices/month",
  },
  {
    quote:
      "The workflow automation alone saved us two full-time positions. ROI was visible within the first quarter.",
    author: "Marcus Webb",
    title: "Director of Finance, TerraOps",
    company: "Enterprise · 2,000+ vendors",
  },
  {
    quote:
      "Finally, an invoice tool that integrates with our ERP without a six-month implementation. We were live in two weeks.",
    author: "Priya Nair",
    title: "VP Finance, Stackline Inc.",
    company: "Mid-market · $180M ARR",
  },
];

const pricingPlans = [
  {
    name: "Growth",
    price: "$499",
    period: "/month",
    description: "For teams processing up to 500 invoices monthly",
    features: [
      "AI data extraction (up to 500 invoices)",
      "3-step approval workflows",
      "ERP integrations (QuickBooks, Xero)",
      "Dashboard analytics",
      "Email & chat support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Business",
    price: "$1,299",
    period: "/month",
    description: "For finance teams scaling AP operations",
    features: [
      "Unlimited invoice processing",
      "Custom multi-tier workflows",
      "All ERP + Netsuite / SAP integrations",
      "Advanced fraud detection",
      "Dedicated success manager",
      "SLA-backed 99.9% uptime",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For complex organizations with unique requirements",
    features: [
      "Everything in Business",
      "Custom AI model fine-tuning",
      "On-premise deployment option",
      "SSO / SAML & advanced RBAC",
      "Audit logs & compliance exports",
      "White-glove onboarding",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />

      {/* Stats Bar */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From inbox to payment in minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              InvoiceAI handles the entire lifecycle — ingestion, extraction,
              validation, approval, and posting — without manual intervention.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: <Building2 className="w-6 h-6" />,
                title: "Ingest",
                desc: "Receive invoices via email, supplier portal, EDI, or API. PDF, XML, CSV — all formats supported.",
              },
              {
                step: "02",
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Extract & Validate",
                desc: "AI extracts header, line items, and tax data. 3-way PO match runs automatically against your ERP.",
              },
              {
                step: "03",
                icon: <Clock className="w-6 h-6" />,
                title: "Route & Approve",
                desc: "Smart rules route to the right approver. Automatic escalation on SLA breach. Full audit trail.",
              },
              {
                step: "04",
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Post & Pay",
                desc: "Approved invoices post to your ERP instantly. Schedule payments and capture early-pay discounts.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="text-5xl font-black text-blue-50 mb-4 leading-none">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {item.step !== "04" && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Finance teams trust InvoiceAI
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600">
              4.9/5 from 340+ reviews on G2 and Capterra
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t.author}
                    </div>
                    <div className="text-gray-500 text-xs">{t.title}</div>
                    <div className="text-blue-600 text-xs font-medium">
                      {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent, usage-based pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-2xl scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`font-bold text-xl mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${plan.highlighted ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-blue-200" : "text-blue-600"}`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-blue-50" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to eliminate manual invoice processing?
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Join 800+ finance teams that process invoices faster, with fewer
            errors, and at a fraction of the cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
              Start free 14-day trial
            </button>
            <button className="border border-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-all">
              Schedule a demo
            </button>
          </div>
          <p className="text-blue-300 text-sm mt-6">
            No credit card required · Setup in under 30 minutes · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-white font-bold text-lg">InvoiceAI</span>
              </div>
              <p className="text-sm leading-relaxed">
                The intelligent AP automation platform for modern B2B finance
                teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Extraction
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Workflow Automation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    SOC 2 Report
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 InvoiceAI. All rights reserved.
            </p>
            <p className="text-sm">SOC 2 Type II · ISO 27001 · GDPR Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
