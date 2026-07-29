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

const masterRouter = Router();

masterRouter.use('/auth', authRoutes);
masterRouter.use('/leads', leadRoutes);
masterRouter.use('/conversations', conversationRoutes);
masterRouter.use('/dashboard', dashboardRoutes);
masterRouter.use('/approvals', approvalRoutes);
masterRouter.use('/ai-agents', agentRoutes);
masterRouter.use('/knowledge', knowledgeRoutes);
masterRouter.use('/qualification-flows', flowRoutes);
masterRouter.use('/whatsapp', whatsappRoutes);

export default masterRouter;
