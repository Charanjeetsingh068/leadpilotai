import { NextResponse } from "next/server";

export async function GET() {
  const mockBusinesses = [
    {
      id: "bm-987123654",
      name: "Skyline Real Estate Holdings",
      verificationStatus: "VERIFIED",
      primaryPageId: "page-101",
      createdAt: new Date().toISOString()
    },
    {
      id: "bm-456789123",
      name: "LeadPilot Commercial Ads Portfolio",
      verificationStatus: "VERIFIED",
      primaryPageId: "page-102",
      createdAt: new Date().toISOString()
    }
  ];

  return NextResponse.json({
    success: true,
    count: mockBusinesses.length,
    businesses: mockBusinesses
  });
}
