import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const controller = new AnalyticsController();

router.get('/overview', controller.getOverview);
router.get('/conversations', controller.getConversations);
router.get('/leads', controller.getLeadsAnalytics);
router.get('/qualification', controller.getLeadsAnalytics);
router.get('/knowledge', controller.getKnowledgeAnalytics);
router.get('/automation', controller.getAutomationAnalytics);
router.get('/handover', controller.getHandover);
router.get('/performance', controller.getPerformance);
router.get('/agents', controller.getAgentsLeaderboard);
router.get('/revenue', controller.getRevenueAnalytics);
router.get('/bookings', controller.getRevenueAnalytics);
router.get('/channels', controller.getChannels);
router.get('/funnel', controller.getFunnel);
router.get('/intents', controller.getIntents);
router.get('/heatmap', controller.getHeatmap);
router.get('/export', controller.exportReport);

export default router;
