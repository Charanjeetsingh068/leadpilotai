import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const conversationController = new ConversationController();

// Query & Read Endpoints
router.get('/', authMiddleware, conversationController.getConversations);
router.get('/:id', authMiddleware, conversationController.getConversationById);
router.get('/:id/messages', authMiddleware, conversationController.getMessages);

// Actions (Supports both /:id/... and root /action with id in body)
router.post('/send', authMiddleware, conversationController.sendMessage);
router.post('/:id/messages', authMiddleware, conversationController.sendMessage);
router.post('/:id/send', authMiddleware, conversationController.sendMessage);

router.post('/takeover', authMiddleware, conversationController.takeover);
router.post('/:id/takeover', authMiddleware, conversationController.takeover);

router.post('/pause', authMiddleware, conversationController.pauseAi);
router.post('/:id/pause', authMiddleware, conversationController.pauseAi);

router.post('/resume', authMiddleware, conversationController.resumeAi);
router.post('/:id/resume', authMiddleware, conversationController.resumeAi);

router.post('/approve', authMiddleware, conversationController.approveAiReply);
router.post('/:id/approve', authMiddleware, conversationController.approveAiReply);

router.post('/sitevisit', authMiddleware, conversationController.bookSiteVisit);
router.post('/:id/sitevisit', authMiddleware, conversationController.bookSiteVisit);

router.post('/export', authMiddleware, conversationController.exportConversation);
router.post('/:id/export', authMiddleware, conversationController.exportConversation);

export default router;
