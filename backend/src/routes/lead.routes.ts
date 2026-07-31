import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createLeadSchema,
  updateLeadStatusSchema,
  assignLeadSchema,
  addNoteSchema,
} from '../validators/lead.validator';

const router = Router();
const leadController = new LeadController();

router.get('/dashboard/stats', authMiddleware, leadController.getDashboardData);
router.get('/export', authMiddleware, leadController.exportLeads);
router.get('/duplicate-check', authMiddleware, leadController.duplicateCheck);
router.get('/', authMiddleware, leadController.getLeads);
router.post('/start-ai', authMiddleware, leadController.startAi);
router.post('/:id/qualify', authMiddleware, leadController.qualifyLead);
router.get('/:id', authMiddleware, leadController.getLeadById);
router.get('/:id/conversation', authMiddleware, leadController.getLeadConversation);
router.get('/:id/timeline', authMiddleware, leadController.getLeadTimeline);
router.get('/:id/notes', authMiddleware, leadController.getLeadNotes);
router.post('/', authMiddleware, validateRequest(createLeadSchema), leadController.createLead);
router.post('/import', authMiddleware, leadController.importLeads);
router.post('/assign', authMiddleware, leadController.bulkAssign);
router.post('/status', authMiddleware, leadController.bulkStatus);
router.put('/:id', authMiddleware, leadController.updateLead);
router.patch('/:id/status', authMiddleware, validateRequest(updateLeadStatusSchema), leadController.updateStatus);
router.post('/:id/assign', authMiddleware, validateRequest(assignLeadSchema), leadController.assignLead);
router.post('/:id/notes', authMiddleware, validateRequest(addNoteSchema), leadController.addNote);
router.delete('/:id', authMiddleware, leadController.deleteLead);

export default router;

