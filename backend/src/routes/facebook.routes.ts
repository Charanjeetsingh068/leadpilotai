import { Router } from 'express';
import { FacebookOAuthController } from '../controllers/facebook-oauth.controller';
import { FacebookIntegrationController } from '../controllers/facebook-integration.controller';
import { FacebookWebhookController } from '../controllers/facebook-webhook.controller';
import { MetaLoginController } from '../controllers/meta-login.controller';
import { MetaCallbackController } from '../controllers/meta-callback.controller';

const router = Router();

const oauthController = new FacebookOAuthController();
const integrationController = new FacebookIntegrationController();
const webhookController = new FacebookWebhookController();
const metaLoginController = new MetaLoginController();
const metaCallbackController = new MetaCallbackController();

// Facebook Login for Business Endpoint (Config ID Flow with PKCE, Zero Scope parameter)
router.get('/meta/login', metaLoginController.getLoginUrl);
router.get('/integrations/facebook/login', metaLoginController.getLoginUrl);

// Meta OAuth Callback Endpoints (Code Exchange -> 60-day Long Lived Token -> AES-256 Storage)
router.get('/meta/callback', metaCallbackController.handleCallback);
router.post('/meta/callback', metaCallbackController.handleCallback);
router.get('/integrations/facebook/callback', oauthController.handleCallback);
router.post('/integrations/facebook/disconnect', oauthController.disconnect);
router.post('/integrations/facebook/oauth', oauthController.startOAuth);

// Webhook Routes (Meta Verification Challenge & Event Receiver)
router.get('/webhooks/facebook', webhookController.verify);
router.post('/webhooks/facebook', webhookController.receive);
router.get('/integrations/facebook/webhooks', webhookController.verify);
router.post('/integrations/facebook/webhooks', webhookController.receive);
router.post('/integrations/facebook/webhooks/retry', integrationController.retryWebhooks);

// Dashboard Analytics & Asset Sync Routes
router.get('/integrations/facebook/dashboard', integrationController.getDashboard);
router.get('/facebook/dashboard', integrationController.getDashboard);
router.get('/integrations/facebook/status', integrationController.getStatus);
router.get('/facebook/status', integrationController.getStatus);

router.post('/integrations/facebook/sync', integrationController.triggerSync);
router.post('/facebook/sync', integrationController.triggerSync);

// Business Portfolios Routes (Step 1 Requirement)
router.get('/facebook/businesses', integrationController.getBusinesses);
router.get('/integrations/facebook/businesses', integrationController.getBusinesses);
router.post('/facebook/businesses/select', integrationController.selectBusiness);
router.post('/integrations/facebook/businesses/select', integrationController.selectBusiness);

// Facebook Pages Routes (Step 2 Requirement)
router.get('/facebook/pages', integrationController.getPages);
router.get('/integrations/facebook/pages', integrationController.getPages);
router.post('/facebook/pages/select', integrationController.selectPages);
router.post('/integrations/facebook/pages/select', integrationController.selectPages);

// Instagram Business Accounts Routes (Step 3 Requirement)
router.get('/facebook/instagram', integrationController.getInstagramAccounts);
router.get('/integrations/facebook/instagram', integrationController.getInstagramAccounts);

// WhatsApp Business Accounts Routes (Step 4 Requirement)
router.get('/facebook/whatsapp', integrationController.getWhatsAppAccounts);
router.get('/integrations/facebook/whatsapp', integrationController.getWhatsAppAccounts);

// Lead Forms Routes (Step 5 Requirement)
router.get('/facebook/forms', integrationController.getForms);
router.get('/integrations/facebook/forms', integrationController.getForms);
router.post('/facebook/forms/select', integrationController.selectForms);
router.post('/integrations/facebook/forms/select', integrationController.selectForms);

// Webhook Health Routes (Step 6 Requirement)
router.get('/facebook/webhooks/health', integrationController.getWebhookHealth);
router.get('/integrations/facebook/webhooks/health', integrationController.getWebhookHealth);

// Lead Inbox Routes (Step 7 Requirement)
router.get('/facebook/leads', integrationController.getLeads);
router.get('/integrations/facebook/leads', integrationController.getLeads);

// Campaign & Ads Performance Routes (Step 9 Requirement)
router.get('/facebook/campaigns', integrationController.getCampaigns);
router.get('/integrations/facebook/campaigns', integrationController.getCampaigns);
router.get('/facebook/ads', integrationController.getAds);
router.get('/integrations/facebook/ads', integrationController.getAds);

// Lead Center Management Routes (Step 10 Requirement)
router.post('/facebook/leads/status', integrationController.updateLeadStatus);
router.post('/integrations/facebook/leads/status', integrationController.updateLeadStatus);
router.post('/facebook/leads/assign', integrationController.assignLeadUser);
router.post('/integrations/facebook/leads/assign', integrationController.assignLeadUser);
router.post('/facebook/leads/notes', integrationController.addLeadNote);
router.post('/integrations/facebook/leads/notes', integrationController.addLeadNote);

// Multi-Account Overview & Lifecycle Management Routes (Enterprise Requirement)
router.get('/facebook/dashboard/overview', integrationController.getDashboardOverview);
router.get('/integrations/facebook/dashboard/overview', integrationController.getDashboardOverview);
router.post('/facebook/accounts/:id/disconnect', integrationController.disconnectAccount);
router.post('/integrations/facebook/accounts/:id/disconnect', integrationController.disconnectAccount);
router.post('/facebook/accounts/:id/reconnect', integrationController.reconnectAccount);
router.post('/integrations/facebook/accounts/:id/reconnect', integrationController.reconnectAccount);
router.delete('/facebook/accounts/:id', integrationController.deleteAccount);
router.delete('/integrations/facebook/accounts/:id', integrationController.deleteAccount);

// Lead Form Customization & AI Agent Assignment Routes
router.post('/integrations/facebook/forms/active', integrationController.toggleFormActive);
router.post('/integrations/facebook/forms/assign-agent', integrationController.assignAiAgent);

export default router;
