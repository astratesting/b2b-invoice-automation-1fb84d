import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "InvoiceAI — Intelligent B2B Invoice Automation",
  description:
    "Automate your entire invoice lifecycle with AI-powered extraction, smart workflow routing, and real-time analytics. Process invoices 10x faster with 99.4% accuracy.",
  keywords: [
    "invoice automation",
    "B2B invoicing",
    "AI invoice processing",
    "accounts payable automation",
    "invoice workflow",
  ],
  openGraph: {
    title: "InvoiceAI — Intelligent B2B Invoice Automation",
    description:
      "AI-powered invoice processing that eliminates manual data entry and accelerates payment cycles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
