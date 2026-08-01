import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: Request) {
  try {
    const backendRes = await axios.post(`${API_BASE}/integrations/facebook/oauth`, {}, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });

    const data = backendRes.data?.data || {};

    return NextResponse.json({
      success: true,
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1712255293083461",
      supportedScopes: [
        "business_management",
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_metadata",
        "leads_retrieval",
        "instagram_basic"
      ],
      supportedProducts: ["business_login", "pages_api", "lead_ads"],
      businessLogin: true,
      marketingApi: true,
      pagesApi: true,
      leadAds: true,
      isConfigured: true,
      missingRequiredPermissions: [],
      oauthUrl: data.oauthUrl,
      state: data.state,
      redirectUri: data.redirectUri,
    });
  } catch (error: any) {
    const errMsg = error.response?.data?.error || error.message || "Failed to generate Meta OAuth URL from backend";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: error.response?.status || 500 }
    );
  }
}
