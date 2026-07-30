import { NextResponse } from "next/server";

// Sample initial in-memory dataset for demonstration/admin inspection
const mockRequests = [
  {
    id: "del-req-001",
    email: "enterprise-client@example.com",
    companyName: "Skyline Realty Group",
    facebookAccount: "Skyline FB Admin",
    reason: "Meta app disconnect & privacy audit",
    status: "COMPLETED",
    confirmationCode: "DEL-2026-A8K9X2",
    requestedAt: "2026-07-15T10:00:00.000Z",
    completedAt: "2026-07-16T14:30:00.000Z"
  },
  {
    id: "del-req-002",
    email: "legal@realestatehub.com",
    companyName: "Real Estate Hub",
    facebookAccount: "Hub Business Manager",
    reason: "Account closure request",
    status: "PENDING",
    confirmationCode: "DEL-2026-M4P7L9",
    requestedAt: "2026-07-29T16:20:00.000Z",
    completedAt: null
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let filtered = mockRequests;
    if (status) {
      filtered = mockRequests.filter((r) => r.status.toUpperCase() === status.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      requests: filtered
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch deletion requests." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { confirmationCode, status } = body;

    if (!confirmationCode || !status) {
      return NextResponse.json(
        { success: false, error: "confirmationCode and status are required." },
        { status: 400 }
      );
    }

    const item = mockRequests.find((r) => r.confirmationCode === confirmationCode);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Deletion request not found." },
        { status: 404 }
      );
    }

    item.status = status.toUpperCase();
    if (item.status === "COMPLETED") {
      item.completedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: `Deletion request ${confirmationCode} status updated to ${item.status}`,
      request: item
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update deletion request status." },
      { status: 500 }
    );
  }
}
