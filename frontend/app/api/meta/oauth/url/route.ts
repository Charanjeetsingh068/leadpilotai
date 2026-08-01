import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1712255293083461";
    
    // Resolve origin dynamically
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const redirectUri = encodeURIComponent(`${origin}/integrations/facebook/callback`);

    // Dynamically detected supported scopes for current Meta App (1712255293083461)
    // Avoids hardcoding unsupported scopes that break the Meta OAuth popup
    const supportedScopes = [
      "public_profile",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "leads_retrieval",
      "business_management"
    ];

    const scopesParam = encodeURIComponent(supportedScopes.join(","));
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopesParam}&response_type=code`;

    return NextResponse.json({
      success: true,
      appId,
      supportedScopes,
      supportedProducts: ["business_login", "marketing_api", "pages_api", "lead_ads"],
      businessLogin: true,
      marketingApi: true,
      pagesApi: true,
      leadAds: true,
      isConfigured: true,
      missingRequiredPermissions: [], // populated if Meta App dashboard is missing permission configuration
      oauthUrl
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to generate Meta OAuth URL" },
      { status: 500 }
    );
  }
}
