import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://leadpilotai-2kar.onrender.com/api";

export async function GET(request: Request) {
  try {
    const backendRes = await axios.get(`${API_BASE}/meta/diagnostics`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });
    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID || "1712255293083461";
    return NextResponse.json({
      success: true,
      data: {
        oauthStatus: "Configured",
        appId,
        accessTokenStatus: "None",
        tokenExpiry: null,
        grantedPermissions: [],
        businessCount: 0,
        pageCount: 0,
        leadFormCount: 0,
        webhookStatus: "Inactive",
        graphApiVersion: "v19.0",
        lastSync: null,
        missingPermissions: []
      }
    });
  }
}
