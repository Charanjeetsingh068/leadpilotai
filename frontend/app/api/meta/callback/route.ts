import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const redirectUri = searchParams.get("redirect_uri");

    if (error || errorDescription) {
      return NextResponse.json(
        {
          success: false,
          error: errorDescription || error || "Meta OAuth authorization was declined by user or app configuration."
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Authorization code missing in Meta callback." },
        { status: 400 }
      );
    }

    // Delegate to Express backend to execute actual token exchange and database storage
    const backendRes = await axios.get(`${API_BASE}/integrations/facebook/callback`, {
      params: { code, redirect_uri: redirectUri },
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });

    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    const errMsg = error.response?.data?.error || error.message || "Failed to process Meta OAuth callback.";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: error.response?.status || 500 }
    );
  }
}
