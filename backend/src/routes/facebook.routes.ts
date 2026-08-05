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

// Lead Form Customization & AI Agent Assignment Routes
router.post('/integrations/facebook/forms/active', integrationController.toggleFormActive);
router.post('/integrations/facebook/forms/assign-agent', integrationController.assignAiAgent);

export default router;
