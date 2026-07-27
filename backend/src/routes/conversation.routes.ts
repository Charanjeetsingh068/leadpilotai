import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { sendMessageSchema, toggleAiSchema } from '../validators/conversation.validator';

const router = Router();
const conversationController = new ConversationController();

router.get('/', authMiddleware, conversationController.getConversations);
router.get('/:id/messages', authMiddleware, conversationController.getMessages);
router.post('/:id/messages', authMiddleware, validateRequest(sendMessageSchema), conversationController.sendMessage);
router.patch('/:id/ai-toggle', authMiddleware, validateRequest(toggleAiSchema), conversationController.toggleAi);

export default router;
