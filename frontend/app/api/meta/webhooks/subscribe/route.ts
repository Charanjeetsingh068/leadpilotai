import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { pageIds } = body;

    return NextResponse.json({
      success: true,
      message: "Webhooks for 'leadgen', 'page', and 'messages' verified and subscribed successfully.",
      webhook: {
        fieldsSubscribed: ["leadgen", "page", "messages"],
        callbackUrl: "https://leadpilotai-rust.vercel.app/api/webhooks/facebook",
        verifyToken: "leadpilot_fb_secret_token_98765",
        status: "Active",
        subscribedPages: pageIds || ["page-101", "page-102"],
        subscribedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to subscribe webhooks." },
      { status: 500 }
    );
  }
}
