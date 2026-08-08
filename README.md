# LeadPilot AI

LeadPilot AI is an enterprise AI-powered lead qualification and multi-platform automation SaaS platform. It integrates Meta (Facebook Lead Ads, Instagram Professional, WhatsApp Business), Google Ads, and custom webhook flows for real-time lead capture and AI-driven qualification.

## 🚀 Key Documentation

* [Meta (Facebook/Instagram/WhatsApp) Integration & Permissions Guide](file:///c:/react/leadpilotai/META_INTEGRATION_README.md)
* [Frontend README](file:///c:/react/leadpilotai/frontend/README.md)

## 📌 Project Structure

```
leadpilotai/
├── backend/                  # Node.js / Express / TypeScript backend
│   ├── src/
│   │   ├── controllers/      # Meta OAuth & Webhook Controllers
│   │   ├── services/         # Meta Graph API & Token Management Services
│   │   └── models/           # Data models (Prisma & MongoDB)
├── frontend/                 # Next.js 15 (App Router) frontend
│   ├── app/                  # Pages, API routes, Privacy & Data Deletion
│   └── components/           # React UI components (Facebook settings & wizards)
└── META_INTEGRATION_README.md # Full Meta Developer Platform & Permissions Guide
```
