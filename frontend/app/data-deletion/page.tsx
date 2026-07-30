import type { Metadata } from "next";
import { DataDeletionView } from "@/components/deletion/DataDeletionView";

export const metadata: Metadata = {
  title: "LeadPilot AI | Facebook Data Deletion Instructions",
  description:
    "Learn how to request deletion of your Facebook-connected data from LeadPilot AI. Official Meta Developer Platform compliant data erasure instructions and deletion tracking.",
  keywords: [
    "Facebook Data Deletion Instructions",
    "LeadPilot AI Data Deletion",
    "Meta Platform Data Erasure",
    "Facebook Connected App Disconnect",
    "Facebook Access Token Removal",
  ],
  alternates: {
    canonical: "https://leadpilotai-rust.vercel.app/data-deletion",
  },
  openGraph: {
    title: "LeadPilot AI | Facebook Data Deletion Instructions",
    description:
      "Official instructions for removing your Facebook-connected data from LeadPilot AI in compliance with Meta Developer Platform guidelines.",
    url: "https://leadpilotai-rust.vercel.app/data-deletion",
    siteName: "LeadPilot AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadPilot AI | Facebook Data Deletion Instructions",
    description:
      "Official instructions for deleting Facebook-connected accounts, tokens, and permissions from LeadPilot AI.",
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
  "name": "Facebook Data Deletion Instructions",
  "url": "https://leadpilotai-rust.vercel.app/data-deletion",
  "description":
    "Official Facebook Data Deletion instructions for LeadPilot AI, providing users with automated in-app and offline mechanisms to purge connected Meta account data within 30 days.",
  "inLanguage": "en-US",
  "datePublished": "2026-01-01",
  "dateModified": "2026-07-30",
  "publisher": {
    "@type": "Organization",
    "name": "LeadPilot AI Inc.",
    "url": "https://leadpilotai-rust.vercel.app",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@leadpilotai.com",
      "contactType": "customer service"
    }
  }
};

export default function DataDeletionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DataDeletionView />
    </>
  );
}
