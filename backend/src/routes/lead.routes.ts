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
router.get('/', authMiddleware, leadController.getLeads);
router.get('/:id', authMiddleware, leadController.getLeadById);
router.post('/', authMiddleware, validateRequest(createLeadSchema), leadController.createLead);
router.patch('/:id/status', authMiddleware, validateRequest(updateLeadStatusSchema), leadController.updateStatus);
router.post('/:id/assign', authMiddleware, validateRequest(assignLeadSchema), leadController.assignLead);
router.post('/:id/notes', authMiddleware, validateRequest(addNoteSchema), leadController.addNote);
router.delete('/:id', authMiddleware, leadController.deleteLead);

export default router;
