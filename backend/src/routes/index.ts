import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';
import conversationRoutes from './conversation.routes';
import dashboardRoutes from './dashboard.routes';
import approvalRoutes from './approval.routes';
import agentRoutes from './agent.routes';
import knowledgeRoutes from './knowledge.routes';
import flowRoutes from './flow.routes';
import whatsappRoutes from './whatsapp.routes';
import testingRoutes from './testing.routes';
import analyticsRoutes from './analytics.routes';
import facebookRoutes from './facebook.routes';
import privacyRoutes from './privacy.routes';
import { TestingController } from '../controllers/testing.controller';

const masterRouter = Router();
const testingController = new TestingController();

masterRouter.use('/auth', authRoutes);
masterRouter.use('/leads', leadRoutes);
masterRouter.use('/conversations', conversationRoutes);
masterRouter.use('/dashboard', dashboardRoutes);
masterRouter.use('/approvals', approvalRoutes);
masterRouter.use('/ai-agents', agentRoutes);
masterRouter.use('/knowledge', knowledgeRoutes);
masterRouter.use('/qualification-flows', flowRoutes);
masterRouter.use('/whatsapp', whatsappRoutes);
masterRouter.use('/testing', testingRoutes);
masterRouter.use('/analytics', analyticsRoutes);
masterRouter.use('/reports', analyticsRoutes);
masterRouter.use('/privacy', privacyRoutes);
masterRouter.use('/', facebookRoutes);
masterRouter.get('/languages', testingController.getLanguages);

export default masterRouter;

