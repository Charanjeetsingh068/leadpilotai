import { Router } from 'express';
import { FlowController } from '../controllers/flow.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new FlowController();

router.use(authMiddleware);

router.get('/', controller.getFlow);
router.get('/questions', controller.getQuestions);
router.post('/questions', controller.createQuestion);
router.delete('/questions/:id', controller.deleteQuestion);
router.get('/scoring', controller.getScoreRules);
router.get('/conditions', controller.getConditions);
router.get('/automations', controller.getAutomations);
router.get('/settings', controller.getSettings);

router.get('/history', controller.getHistory);
router.get('/:id', controller.getFlowById);
router.patch('/:id', controller.saveFlowNodes);
router.post('/publish', controller.publishFlow);
router.post('/test', controller.testFlow);

export default router;
