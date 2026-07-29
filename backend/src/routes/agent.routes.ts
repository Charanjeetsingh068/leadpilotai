import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const agentController = new AgentController();

router.use(authMiddleware);

router.get('/', agentController.getAgents);
router.get('/metrics', agentController.getMetricsSummary);
router.get('/activity', agentController.getRecentActivity);
router.get('/:id', agentController.getAgentById);
router.post('/', agentController.createAgent);
router.put('/:id', agentController.updateAgent);
router.patch('/:id/toggle', agentController.toggleStatus);
router.delete('/:id', agentController.deleteAgent);

export default router;
