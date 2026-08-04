import { Router } from 'express';
import { FacebookOAuthController } from '../controllers/facebook-oauth.controller';
import { FacebookIntegrationController } from '../controllers/facebook-integration.controller';
import { FacebookWebhookController } from '../controllers/facebook-webhook.controller';

const router = Router();

const oauthController = new FacebookOAuthController();
const integrationController = new FacebookIntegrationController();
const webhookController = new FacebookWebhookController();

// OAuth & Connect Routes
router.post('/integrations/facebook/oauth', oauthController.startOAuth);
router.get('/integrations/facebook/callback', oauthController.handleCallback);
router.post('/integrations/facebook/disconnect', oauthController.disconnect);
router.post('/facebook/connect', integrationController.connect);
router.post('/facebook/disconnect', oauthController.disconnect);

// Diagnostics & Audit Routes
router.get('/meta/diagnostics', integrationController.getDiagnostics);
router.get('/facebook/diagnostics', integrationController.getDiagnostics);
router.get('/meta/audit', integrationController.runAudit);
router.get('/facebook/audit', integrationController.runAudit);

// Accounts Routes
router.get('/facebook/accounts', integrationController.getAccounts);
router.get('/facebook/accounts/:id/details', integrationController.getAccountDetails);
router.get('/facebook/accounts/:id/leads', integrationController.getAccountLeads);
router.get('/facebook/accounts/:id/campaigns', integrationController.getAccountCampaigns);
router.get('/facebook/accounts/:id/ads', integrationController.getAccountAds);
router.get('/facebook/accounts/:id/insights', integrationController.getAccountInsights);
router.get('/facebook/accounts/:id/stream', integrationController.streamEvents);
router.get('/facebook/accounts/:id', integrationController.getAccounts);

// Businesses Routes
router.get('/facebook/businesses', integrationController.getBusinesses);

// Pages Routes
router.get('/facebook/pages', integrationController.getPages);
router.post('/facebook/pages/:pageId/connect', integrationController.connectPage);
router.post('/facebook/pages/:pageId/disconnect', integrationController.disconnectPage);
router.post('/facebook/pages/:pageId/sync', integrationController.syncPage);
router.get('/facebook/pages/:pageId/details', integrationController.getPageDetails);
router.get('/facebook/pages/:id', integrationController.getPages);

// Forms Routes
router.get('/facebook/forms', integrationController.getForms);

// Webhook Routes (Internal management & Meta Verification)
router.get('/webhooks/facebook', webhookController.verify);
router.post('/webhooks/facebook', webhookController.receive);
router.get('/facebook/webhooks', integrationController.getWebhooks);
router.post('/facebook/webhooks/retry', integrationController.retryWebhooks);

// Status Routes
router.get('/integration/status', integrationController.getStatus);
router.get('/facebook/status', integrationController.getStatus);

// Dashboard Analytics & Sync Routes
router.get('/facebook/dashboard', integrationController.getDashboard);
router.get('/facebook/sync/history', integrationController.getDashboard);
router.post('/facebook/sync', integrationController.triggerSync);

export default router;
