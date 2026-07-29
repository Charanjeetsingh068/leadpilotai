import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new WhatsAppController();

router.use(authMiddleware);

router.get('/connection', controller.getConnection);
router.post('/connect', controller.getConnection);
router.post('/test', controller.testConnection);
router.get('/templates', controller.getTemplates);
router.post('/templates', controller.createTemplate);
router.delete('/templates/:id', controller.deleteTemplate);
router.get('/followups', controller.getFollowupSequence);
router.get('/automations', controller.getAutomationRules);
router.get('/usage', controller.getUsageMetrics);
router.get('/logs', controller.getLogs);

export default router;
