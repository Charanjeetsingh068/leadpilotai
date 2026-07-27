import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';
import conversationRoutes from './conversation.routes';
import dashboardRoutes from './dashboard.routes';

const masterRouter = Router();

masterRouter.use('/auth', authRoutes);
masterRouter.use('/leads', leadRoutes);
masterRouter.use('/conversations', conversationRoutes);
masterRouter.use('/dashboard', dashboardRoutes);

export default masterRouter;
