import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  const mockForms = [
    {
      id: "form-301",
      formId: "809128374001",
      pageId: "page-101",
      pageName: "Skyline Luxury Apartments & Villas",
      name: "2026 VIP Penthouse Brochure & Site Visit Form",
      status: "Active",
      leadsCount: 184,
      aiAgentAssigned: "Skyline Real Estate Qualifier Bot",
      aiAgentId: "agent-001",
      createdAt: new Date().toISOString()
    },
    {
      id: "form-302",
      formId: "809128374002",
      pageId: "page-101",
      pageName: "Skyline Luxury Apartments & Villas",
      name: "Pre-Launch Price List & Instant Callback",
      status: "Active",
      leadsCount: 92,
      aiAgentAssigned: "Lead Qualification & Booking AI",
      aiAgentId: "agent-002",
      createdAt: new Date().toISOString()
    }
  ];

  let filtered = mockForms;
  if (pageId) {
    filtered = mockForms.filter((f) => f.pageId === pageId);
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    forms: filtered
  });
}
