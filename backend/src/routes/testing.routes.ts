import { Router } from 'express';
import { TestingController } from '../controllers/testing.controller';

const router = Router();
const controller = new TestingController();

router.get('/session', controller.getSession);
router.post('/start', controller.startSession);
router.post('/message', controller.sendMessage);
router.post('/clear', controller.clearSession);
router.get('/history', controller.getSessionHistory);
router.get('/metrics', controller.getMetrics);
router.get('/knowledge', controller.getMetrics);
router.get('/scenarios', controller.getScenarios);

export default router;
