# LeadPilot AI - Meta (Facebook/Instagram/WhatsApp) Developer Platform & Permissions Technical Reference

> **Document Version:** 1.0.0  
> **Meta Graph API Version:** `v23.0`  
> **App ID:** `1712255293083461`  
> **Config ID:** `937320012719440`  
> **Business ID:** `312449849278509`  
> **Last Updated:** August 2026

---

## 📌 Executive Summary

This document provides a comprehensive technical overview of the **Meta Developer Platform (Facebook, Instagram & WhatsApp Business API)** integration within **LeadPilot AI**. It establishes authoritative guidelines covering requested API permissions (OAuth scopes), authentication flows, real-time webhook ingestion, access token lifecycle management, Meta App Review requirements, and structured troubleshooting protocols.

Adhering strictly to these specifications ensures seamless multi-tenant asset discovery, prevents permission denial issues, and maintains full compliance with Meta Platform Terms.

---

## 🔑 1. Complete Meta Permissions (Scopes) Matrix

LeadPilot AI requests and enforces the following 12 Meta OAuth Scopes via **Facebook Login for Business** and Graph API `v23.0`:

| Permission (Scope Name) | Access Level | App Review Required? | Business Verification Required? | Purpose in LeadPilot AI |
| :--- | :--- | :--- | :--- | :--- |
| `public_profile` | Default | ❌ No (Basic) | ❌ No | User authentication, identity display, and profile metadata. |
| `email` | Default | ❌ No (Basic) | ❌ No | User account verification and cross-platform identity mapping. |
| `business_management` | Advanced | ✅ Yes | ✅ Yes | Enumerates Business Portfolios (BM), managed client assets, and page relationships. |
| `pages_show_list` | Advanced | ✅ Yes | ❌ No | Fetches all Facebook Pages managed by the authenticated workspace user. |
| `pages_read_engagement` | Advanced | ✅ Yes | ❌ No | Reads Page metrics, posts, and engagement data for lead attribution. |
| `pages_manage_metadata` | Advanced | ✅ Yes | ❌ No | Subscribes webhooks to Facebook Pages for real-time lead capture. |
| `pages_manage_posts` | Advanced | ✅ Yes | ❌ No | Publishes automated posts and response updates when enabled by workspace admins. |
| `leads_retrieval` | Advanced | ✅ Yes | ✅ Yes | Ingests detailed Meta Lead Ads form responses (contact details & custom answers). |
| `instagram_basic` | Advanced | ✅ Yes | ❌ No | Discovers connected Instagram Professional and Creator accounts linked to Pages. |
| `instagram_manage_messages` | Advanced | ✅ Yes | ❌ No | Ingests and automates responses for Instagram Direct Messages and ad inquiries. |
| `whatsapp_business_management` | Advanced | ✅ Yes | ✅ Yes | Manages WhatsApp Business Accounts (WABA), message templates, and phone numbers. |
| `whatsapp_business_messaging` | Advanced | ✅ Yes | ✅ Yes | Sends real-time WhatsApp notifications, templates, and automated AI chat responses. |

---

## 🔄 2. OAuth 2.0 & Token Exchange Architecture

### Authentication Flow Specification:
1. **Authorization Request Trigger:**  
   `GET https://www.facebook.com/v23.0/dialog/oauth`  
   Query Parameters: `client_id`, `redirect_uri`, `config_id`, `state`, `response_type=code`, `auth_type=rerequest`, `scope`
2. **Short-Lived Token Exchange:**  
   `GET https://graph.facebook.com/v23.0/oauth/access_token`  
   Exchanges authorization code for a Short-Lived User Access Token (valid for ~1-2 hours).
3. **Long-Lived Token Exchange (60-Day Renewal):**  
   `GET https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token`  
   Exchanges Short-Lived User Access Token for a Long-Lived User Access Token (valid for 60 days).
4. **Page Access Token Acquisition (Infinite Expiry):**  
   `GET https://graph.facebook.com/v23.0/{page-id}?fields=access_token`  
   Acquired using a Long-Lived User Access Token. Page tokens do not expire unless the user changes credentials or explicitly revokes permissions.

### Token Storage & Encryption:
* Tokens stored in Prisma DB and MongoDB are encrypted using **AES-256-GCM** via `ENCRYPTION_KEY`.
* Unencrypted tokens MUST NEVER be emitted in server logs, API responses, or client-side storage.

---

## 🌐 3. Real-Time Webhook Architecture & Verification

LeadPilot AI utilizes HTTP webhooks for real-time lead ingestion and event monitoring.

### Webhook Endpoints:
* **Public Callback URL:** `https://leadpilotai-2kar.onrender.com/webhooks/facebook`
* **Internal Routing Endpoint:** `https://leadpilotai-2kar.onrender.com/api/v1/facebook/webhooks`
* **Deauthorization Callback URL:** `https://leadpilotai-2kar.onrender.com/api/meta/webhooks/deauthorize`

### Subscribed Topics & Event Fields:
1. **Topic:** `page`
   * **Field:** `leadgen` (Triggers on new Meta Lead Ad form submissions)
   * **Field:** `feed` (Triggers on Page activity and user interactions)
2. **Topic:** `application` (Business Integration Lifecycle)
   * **Field:** `business_integration_install` (Triggers when user connects BM via Facebook Login)
   * **Field:** `business_integration_uninstall` (Triggers when user disconnects LeadPilot AI)
   * **Field:** `business_integration_update` (Triggers when user alters granted scopes)
3. **Topic:** `whatsapp_business_account`
   * **Field:** `messages` (Triggers on incoming WhatsApp messages)

### Webhook Verification Handshake:
During configuration, Meta dispatches a `GET` request with parameters:
* `hub.mode`: `subscribe`
* `hub.verify_token`: Must match `FACEBOOK_VERIFY_TOKEN` (Default: `leadpilot_fb_secret_token_98765`)
* `hub.challenge`: Returned as plain text with HTTP status `200`.

### Security Signature Validation:
Every incoming webhook `POST` request payload must be verified against the `X-Hub-Signature-256` header:
```crypto
Signature = 'sha256=' + HMAC_SHA256(raw_request_body, FACEBOOK_APP_SECRET)
```

---

## 📋 4. Meta App Review & Compliance Checklist

To secure and maintain **Advanced Access** for requested scopes:

### 1. Required Compliance Endpoints:
* **Privacy Policy URL:** `https://leadpilotai-rust.vercel.app/privacy-policy`
* **Terms of Service URL:** `https://leadpilotai-rust.vercel.app/terms-of-service`
* **User Data Deletion Callback URL:** `https://leadpilotai-rust.vercel.app/api/privacy/data-deletion-request`
* **Data Deletion Instructions Page:** `https://leadpilotai-rust.vercel.app/data-deletion`

### 2. Business Verification Prerequisites:
* Validated Company Registration Document matching legal entity name.
* Domain Ownership Verification for `leadpilotai-rust.vercel.app`.
* D-U-N-S Number (recommended for expedited approval).

### 3. Screencast Recording Guidelines:
Screencasts submitted for `leads_retrieval`, `pages_show_list`, and `business_management` MUST record:
1. User clicking "Connect Meta Account" in the LeadPilot AI dashboard.
2. The Facebook Login for Business dialog displaying the requested permissions.
3. Selection of Facebook Pages and Lead Forms by the user.
4. Redirection back to the LeadPilot AI dashboard with active status.
5. Live test lead submission using the [Meta Lead Testing Tool](https://developers.facebook.com/tools/lead-ads-testing/) appearing instantly in the LeadPilot AI inbox.

---

## 🚨 5. Error Code & Troubleshooting Reference

| Error Code / Subcode | Meta API Error Message | Root Cause | Resolution Strategy |
| :--- | :--- | :--- | :--- |
| **1 / 2** | `An unknown error occurred` | Transient Graph API server error. | Automatic retries via exponential backoff (up to 3 attempts). |
| **4 / 17** | `Application request limit reached` | Exceeded Meta Graph API rate limit quota. | Throttle outgoing requests, cache metadata, retry after backoff interval. |
| **100** | `Invalid parameter` | Malformed endpoint parameter or outdated Graph API version. | Confirm endpoint uses Graph API version `v23.0` and valid syntax. |
| **102 / 463** | `Session has expired` | User session ended or password changed. | Prompt workspace administrator to re-authenticate via OAuth. |
| **190** | `Invalid OAuth access token` | Token revoked, expired, or invalidated by user. | Set token status to `TOKEN_EXPIRED` and initiate re-authorization (`auth_type=rerequest`). |
| **200** | `Permissions error` | Required OAuth scope was ungranted by user. | Re-launch OAuth flow enforcing all missing required scopes. |
| **LAM Error** | `Lead Access Manager Restricted` | Lead Access restricted under Page's Meta Business Manager. | Page Admin must assign Lead Access to LeadPilot AI under **Business Settings -> Integrations -> Leads Access**. |
| **Webhook 403** | `Verification token mismatch` | Supplied `hub.verify_token` does not match `FACEBOOK_VERIFY_TOKEN`. | Update `FACEBOOK_VERIFY_TOKEN` in `.env` to match Meta App Dashboard settings. |

---

## ⚙️ 6. Required Environment Variables Reference

Verify that the following environment variables are correctly defined in `backend/.env` and `frontend/.env.local`:

```env
# Meta App Credentials
FACEBOOK_APP_ID="1712255293083461"
FACEBOOK_APP_SECRET="fadc1ae30941d9573ec85c9fe27dc784"
FACEBOOK_BUSINESS_ID="312449849278509"
FACEBOOK_CONFIG_ID="937320012719440"
META_LOGIN_CONFIG_ID="937320012719440"

# Webhooks & Encryption
FACEBOOK_VERIFY_TOKEN="leadpilot_fb_secret_token_98765"
META_GRAPH_API_VERSION="v23.0"
ENCRYPTION_KEY="leadpilot_super_secret_encryption_key_32bytes!!"

# Authentication Callbacks
FACEBOOK_REDIRECT_URI="https://leadpilotai-2kar.onrender.com/api/integrations/facebook/callback"
FRONTEND_URL="https://leadpilotai-rust.vercel.app"
```

---

## 👤 7. Reference Connected Account Record

The system contains the following verified reference Meta user connection record (configured in database seed `backend/prisma/seed-facebook.ts`):

| Field | Value |
| :--- | :--- |
| **Facebook Name** | **Sumit Chaudhary** |
| **Facebook User ID** | **28149461204738597** |
| **Connection Status** | `CONNECTED` |
| **Token Status** | `Active` |
| **Token Type** | `Long Lived Token` |
| **Token Encryption** | `AES-256-GCM` |
| **Token Expiry** | **30 September 2026** |

---

## 🛠️ 8. Official Meta Developer Resources

* **Meta Lead Ads Testing Tool:** [https://developers.facebook.com/tools/lead-ads-testing/](https://developers.facebook.com/tools/lead-ads-testing/)
* **Access Token Debugger:** [https://developers.facebook.com/tools/debug/accesstoken/](https://developers.facebook.com/tools/debug/accesstoken/)
* **Graph API Explorer (v23.0):** [https://developers.facebook.com/tools/explorer/](https://developers.facebook.com/tools/explorer/)
* **Webhook Debugging Tool:** [https://developers.facebook.com/tools/webhooks/](https://developers.facebook.com/tools/webhooks/)
