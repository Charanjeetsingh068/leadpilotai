import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Facebook account and associated tokens have been disconnected successfully."
  });
}
