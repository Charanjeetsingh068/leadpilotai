import { NextResponse } from "next/server";

export async function GET() {
  const mockPages = [
    {
      id: "page-101",
      pageId: "109283749201",
      name: "Skyline Luxury Apartments & Villas",
      category: "Real Estate Property",
      pictureUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120",
      followersCount: 14200,
      status: "Active",
      webhookStatus: "Subscribed"
    },
    {
      id: "page-102",
      pageId: "109283749202",
      name: "LeadPilot Commercial Hub",
      category: "Sales Automation",
      pictureUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120",
      followersCount: 8900,
      status: "Active",
      webhookStatus: "Subscribed"
    }
  ];

  return NextResponse.json({
    success: true,
    count: mockPages.length,
    pages: mockPages
  });
}
