import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/components/privacy/PrivacyPolicyView";

export const metadata: Metadata = {
  title: "LeadPilot AI Privacy Policy",
  description:
    "Official Privacy Policy for LeadPilot AI Enterprise SaaS platform. Meta App Review compliant documentation covering Meta (Facebook & Instagram) Graph API permissions, WhatsApp Business API, Google Ads, and data protection standards.",
  keywords: [
    "LeadPilot AI Privacy Policy",
    "Meta App Review Privacy Policy",
    "Facebook Lead Ads Privacy Policy",
    "WhatsApp Business API Privacy",
    "Google Ads Integration Data Policy",
    "Real Estate Lead Automation Security",
  ],
  alternates: {
    canonical: "https://leadpilotai-rust.vercel.app/privacy-policy",
  },
  openGraph: {
    title: "LeadPilot AI Privacy Policy",
    description:
      "Enterprise Privacy Policy for LeadPilot AI. Complete disclosures for Meta Developer App Review, WhatsApp API, and Google OAuth.",
    url: "https://leadpilotai-rust.vercel.app/privacy-policy",
    siteName: "LeadPilot AI",
    locale: "en_US",
    type: "website",
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
  "name": "LeadPilot AI Privacy Policy",
  "url": "https://leadpilotai-rust.vercel.app/privacy-policy",
  "description":
    "Comprehensive privacy policy for LeadPilot AI SaaS platform, governing Meta Developer integrations, Google Ads, WhatsApp Business API, and lead automation services.",
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PrivacyPolicyView />
    </>
  );
}
