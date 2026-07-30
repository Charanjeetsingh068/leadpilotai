import { Router } from 'express';
import { PrivacyController } from '../controllers/privacy.controller';

const router = Router();
const controller = new PrivacyController();

router.post('/data-deletion-request', (req, res) => controller.handleDataDeletionRequest(req, res));
router.get('/admin/data-deletion-requests', (req, res) => controller.getAdminDeletionRequests(req, res));

export default router;
