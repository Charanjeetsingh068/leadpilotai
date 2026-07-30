import { Router } from 'express';
import { FacebookOAuthController } from '../controllers/facebook-oauth.controller';
import { FacebookIntegrationController } from '../controllers/facebook-integration.controller';
import { FacebookWebhookController } from '../controllers/facebook-webhook.controller';

const router = Router();

const oauthController = new FacebookOAuthController();
const integrationController = new FacebookIntegrationController();
const webhookController = new FacebookWebhookController();

// OAuth Routes
router.post('/integrations/facebook/oauth', oauthController.startOAuth);
router.get('/integrations/facebook/callback', oauthController.handleCallback);
router.post('/integrations/facebook/disconnect', oauthController.disconnect);
router.post('/facebook/disconnect', oauthController.disconnect);

// Accounts Routes
router.get('/facebook/accounts', integrationController.getAccounts);
router.get('/facebook/accounts/:id', integrationController.getAccounts);

// Businesses Routes
router.get('/facebook/businesses', integrationController.getBusinesses);

// Pages Routes
router.get('/facebook/pages', integrationController.getPages);
router.get('/facebook/pages/:id', integrationController.getPages);
router.post('/facebook/pages/sync', integrationController.syncPages);

// Forms Routes
router.get('/facebook/forms', integrationController.getForms);
router.put('/facebook/forms/assign-ai', integrationController.assignAiAgent);
router.post('/facebook/forms/sync', integrationController.syncForms);

// Permissions Routes
router.get('/facebook/permissions', integrationController.getPermissions);

// Webhook Routes (Internal management & Meta Verification)
router.get('/webhooks/facebook', webhookController.verify);
router.post('/webhooks/facebook', webhookController.receive);
router.get('/facebook/webhooks', integrationController.getWebhooks);
router.post('/facebook/webhooks/retry', integrationController.retryWebhooks);

// Dashboard Analytics & Sync Routes
router.get('/facebook/dashboard', integrationController.getDashboard);
router.get('/facebook/sync/history', integrationController.getDashboard);
router.post('/facebook/sync', integrationController.triggerSync);

export default router;
