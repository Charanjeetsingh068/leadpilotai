import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    const backendRes = await axios.get(`${API_BASE}/facebook/pages`, {
      params: { businessId },
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      withCredentials: true,
    });
    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: 0,
      pages: []
    });
  }
}
