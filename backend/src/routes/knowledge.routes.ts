import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledge.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new KnowledgeController();

router.use(authMiddleware);

router.get('/documents', controller.getDocuments);
router.get('/documents/:id', controller.getDocumentById);
router.post('/upload', controller.uploadDocument);
router.patch('/documents/:id', controller.updateDocument);
router.delete('/documents/:id', controller.deleteDocument);
router.post('/documents/:id/reindex', controller.reindexDocument);
router.post('/documents/:id/archive', controller.archiveDocument);
router.post('/documents/:id/restore', controller.restoreDocument);
router.get('/overview', controller.getOverviewMetrics);
router.post('/reindex-all', controller.reindexAll);
router.get('/categories', controller.getCategories);
router.get('/top-usage', controller.getTopUsage);
router.get('/health', controller.getHealthMetrics);

router.get('/faqs', controller.getFaqs);
router.post('/faqs', controller.createFaq);
router.delete('/faqs/:id', controller.deleteFaq);
router.get('/websites', controller.getWebsites);
router.post('/websites', controller.addWebsite);
router.get('/media', controller.getMedia);
router.get('/datasources', controller.getDataSources);
router.get('/training-jobs', controller.getTrainingJobs);
router.get('/versions', controller.getVersions);

export default router;
