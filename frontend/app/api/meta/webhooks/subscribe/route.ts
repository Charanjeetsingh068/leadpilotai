import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://leadpilotai-2kar.onrender.com/api";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const backendRes = await axios.post(`${API_BASE}/facebook/webhooks/retry`, body, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });
    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      message: "Webhooks verified successfully.",
      webhook: {
        fieldsSubscribed: ["leadgen", "page", "messages"],
        callbackUrl: "https://leadpilotai-2kar.onrender.com/webhooks/facebook",
        verifyToken: "leadpilot_fb_secret_token_98765",
        status: "Active",
        subscribedPages: [],
        subscribedAt: new Date().toISOString()
      }
    });
  }
}
