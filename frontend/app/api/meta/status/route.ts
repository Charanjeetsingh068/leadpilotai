import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    
    const backendRes = await axios.get(`${API_BASE}/facebook/dashboard`, {
      params: { businessId },
    });

    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    // If backend server fails or has no record, default to clean NOT_CONNECTED state
    return NextResponse.json({
      success: true,
      data: {
        connection: {
          status: "NOT_CONNECTED",
          isConnected: false,
          connectedBy: null,
          email: null,
        },
        accounts: [],
        totalAccounts: 0,
        businesses: [],
        pages: [],
        totalPages: 0,
        instagramAccounts: [],
        whatsAppAccounts: [],
        forms: [],
        totalForms: 0,
        permissions: [],
        webhookHealth: null,
        recentEvents: [],
        metrics: null,
      },
    });
  }
}
