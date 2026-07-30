import type { Metadata } from "next";
import { TermsOfServiceView } from "@/components/terms/TermsOfServiceView";

export const metadata: Metadata = {
  title: "LeadPilot AI Terms of Service",
  description:
    "Official Terms of Service for LeadPilot AI Enterprise SaaS platform. Meta App Review & Google OAuth compliant legal terms governing Facebook Login, Instagram API, WhatsApp Business API, and Lead Automation.",
  keywords: [
    "LeadPilot AI Terms of Service",
    "Meta Developer Terms of Service",
    "Facebook Login Business Terms",
    "WhatsApp Business API Legal Terms",
    "Google Ads Integration Terms",
    "Real Estate Lead Automation Terms",
  ],
  alternates: {
    canonical: "https://leadpilotai-rust.vercel.app/terms-of-service",
  },
  openGraph: {
    title: "LeadPilot AI Terms of Service",
    description:
      "Enterprise Terms of Service for LeadPilot AI. Legally structured disclosures for Meta Developer App Review, WhatsApp Business API, and Google Services.",
    url: "https://leadpilotai-rust.vercel.app/terms-of-service",
    siteName: "LeadPilot AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadPilot AI Terms of Service",
    description:
      "Enterprise Terms of Service for LeadPilot AI. Complete legal disclosures for Meta Developer integrations and Google OAuth.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "LeadPilot AI Terms of Service",
  "url": "https://leadpilotai-rust.vercel.app/terms-of-service",
  "description":
    "Comprehensive Terms of Service for LeadPilot AI SaaS platform, governing Meta Developer integrations, Google Ads, WhatsApp Business API, and lead automation services.",
  "inLanguage": "en-US",
  "datePublished": "2026-01-01",
  "dateModified": "2026-07-30",
  "publisher": {
    "@type": "Organization",
    "name": "LeadPilot AI Inc.",
    "url": "https://leadpilotai-rust.vercel.app",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "entecmedia@gmail.com",
      "contactType": "customer service"
    }
  }
};

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TermsOfServiceView />
    </>
  );
}
