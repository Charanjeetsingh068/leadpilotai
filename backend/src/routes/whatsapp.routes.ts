import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';

const router = Router();
const controller = new WhatsAppController();

// Public Webhook route (No Auth Middleware needed for Meta Graph API callbacks)
router.post('/webhook', controller.handleWebhook);
router.post('/webhook/:wabaId', controller.handleWebhook);

// Protected routes (for Frontend SaaS Dashboard)
router.get('/connection', controller.getConnection);
router.post('/connect', controller.connect);
router.patch('/connection', controller.connect);
router.post('/disconnect', controller.disconnect);
router.post('/test', controller.testConnection);
router.post('/resubscribe', controller.testConnection);

// Templates
router.get('/templates', controller.getTemplates);
router.post('/templates', controller.createTemplate);
router.patch('/templates/:id', controller.updateTemplate);
router.delete('/templates/:id', controller.deleteTemplate);

// Welcome Message
router.get('/welcome', controller.getWelcomeMessage);
router.get('/welcome-message', controller.getWelcomeMessage);
router.post('/welcome', controller.saveWelcomeMessage);
router.post('/welcome-message', controller.saveWelcomeMessage);
router.patch('/welcome-message', controller.saveWelcomeMessage);

// Follow-up Sequence
router.get('/followups', controller.getFollowupSequence);
router.get('/followup', controller.getFollowupSequence);
router.post('/followups', controller.saveFollowupSequence);
router.post('/followup', controller.saveFollowupSequence);
router.patch('/followups/:id', controller.saveFollowupSequence);
router.patch('/followup', controller.saveFollowupSequence);

// Automation Rules
router.get('/rules', controller.getAutomationRules);
router.post('/rules', controller.createAutomationRule);
router.patch('/rules/:id', controller.updateAutomationRule);
router.delete('/rules/:id', controller.deleteAutomationRule);

// Business Hours
router.get('/business-hours', controller.getBusinessHours);
router.post('/business-hours', controller.saveBusinessHours);
router.patch('/business-hours', controller.saveBusinessHours);

// Human Takeover
router.get('/takeover', controller.getHumanTakeover);
router.post('/takeover', controller.saveHumanTakeover);
router.patch('/takeover', controller.saveHumanTakeover);

// Media
router.get('/media', controller.getMedia);
router.post('/media', controller.createMedia);
router.delete('/media/:id', controller.deleteMedia);

// Metrics & Logs
router.get('/usage', controller.getUsageMetrics);
router.get('/logs', controller.getLogs);

export default router;
