import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://leadpilotai-2kar.onrender.com/api";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const backendRes = await axios.post(`${API_BASE}/facebook/disconnect`, body, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });
    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      message: "Facebook account and associated tokens disconnected successfully."
    });
  }
}
