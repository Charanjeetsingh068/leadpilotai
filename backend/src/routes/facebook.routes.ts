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

// Diagnostics Routes
router.get('/meta/diagnostics', integrationController.getDiagnostics);
router.get('/facebook/diagnostics', integrationController.getDiagnostics);

// Accounts Routes
router.get('/facebook/accounts', integrationController.getAccounts);
router.get('/facebook/accounts/:id', integrationController.getAccounts);

// Businesses Routes
router.get('/facebook/businesses', integrationController.getBusinesses);

// Pages Routes
router.get('/facebook/pages', integrationController.getPages);
router.get('/facebook/pages/:id', integrationController.getPages);

// Forms Routes
router.get('/facebook/forms', integrationController.getForms);

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
