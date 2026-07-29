import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ApprovalController();

router.get('/', authMiddleware, controller.getApprovals);
router.get('/:id', authMiddleware, controller.getApprovalById);
router.patch('/:id/approve', authMiddleware, controller.approve);
router.patch('/:id/reject', authMiddleware, controller.reject);
router.patch('/:id/edit', authMiddleware, controller.editAndSend);
router.patch('/:id/assign', authMiddleware, controller.assignToSales);
router.patch('/:id/pause', authMiddleware, controller.pauseAi);

export default router;
