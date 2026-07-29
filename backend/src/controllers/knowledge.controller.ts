import { Request, Response, NextFunction } from 'express';
import { KnowledgeService } from '../services/knowledge.service';
import { sendResponse } from '../utils/apiResponse';

export class KnowledgeController {
  private service: KnowledgeService;

  constructor() {
    this.service = new KnowledgeService();
  }

  public getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId, category, status, type, search, sortBy, page, limit } = req.query;

      const result = await this.service.getDocuments({
        agentId: agentId as string | undefined,
        category: category as string | undefined,
        status: status as string | undefined,
        type: type as string | undefined,
        search: search as string | undefined,
        sortBy: sortBy as string | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      });

      const meta = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };

      sendResponse(res, 200, 'Knowledge documents fetched', result.documents, meta);
    } catch (error) {
      next(error);
    }
  };

  public getDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const doc = await this.service.getDocumentById(id);
      sendResponse(res, 200, 'Knowledge document details fetched', doc);
    } catch (error) {
      next(error);
    }
  };

  public uploadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = await this.service.uploadDocument(req.body);
      sendResponse(res, 201, 'Knowledge document uploaded', doc);
    } catch (error) {
      next(error);
    }
  };

  public deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await this.service.deleteDocument(id);
      sendResponse(res, 200, 'Knowledge document deleted', result);
    } catch (error) {
      next(error);
    }
  };

  public updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const doc = await this.service.updateDocument(id, req.body);
      sendResponse(res, 200, 'Knowledge document updated', doc);
    } catch (error) {
      next(error);
    }
  };

  public archiveDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const doc = await this.service.archiveDocument(id);
      sendResponse(res, 200, 'Knowledge document archived', doc);
    } catch (error) {
      next(error);
    }
  };

  public restoreDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const doc = await this.service.restoreDocument(id);
      sendResponse(res, 200, 'Knowledge document restored', doc);
    } catch (error) {
      next(error);
    }
  };

  public reindexDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const doc = await this.service.reindexDocument(id);
      sendResponse(res, 200, 'Knowledge document re-indexing started', doc);
    } catch (error) {
      next(error);
    }
  };

  public getOverviewMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const overview = await this.service.getOverviewMetrics(agentId as string | undefined);
      sendResponse(res, 200, 'Knowledge overview metrics fetched', overview);
    } catch (error) {
      next(error);
    }
  };

  public reindexAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.reindexAll();
      sendResponse(res, 200, 'Re-indexing task started', result);
    } catch (error) {
      next(error);
    }
  };

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.service.getCategories();
      sendResponse(res, 200, 'Knowledge categories fetched', categories);
    } catch (error) {
      next(error);
    }
  };

  public getTopUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usage = await this.service.getTopUsage();
      sendResponse(res, 200, 'Knowledge top usage metrics fetched', usage);
    } catch (error) {
      next(error);
    }
  };

  public getHealthMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = await this.service.getHealthMetrics();
      sendResponse(res, 200, 'Knowledge health metrics fetched', health);
    } catch (error) {
      next(error);
    }
  };

  public getFaqs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const faqs = await this.service.getFaqs(agentId as string | undefined);
      sendResponse(res, 200, 'FAQs fetched', faqs);
    } catch (error) {
      next(error);
    }
  };

  public createFaq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const faq = await this.service.createFaq(req.body);
      sendResponse(res, 201, 'FAQ created successfully', faq);
    } catch (error) {
      next(error);
    }
  };

  public deleteFaq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteFaq(id);
      sendResponse(res, 200, 'FAQ deleted successfully', { id });
    } catch (error) {
      next(error);
    }
  };

  public getWebsites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const websites = await this.service.getWebsites(agentId as string | undefined);
      sendResponse(res, 200, 'Websites fetched', websites);
    } catch (error) {
      next(error);
    }
  };

  public addWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const site = await this.service.addWebsite(req.body);
      sendResponse(res, 201, 'Website added for crawling', site);
    } catch (error) {
      next(error);
    }
  };

  public getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const media = await this.service.getMedia(agentId as string | undefined);
      sendResponse(res, 200, 'Media items fetched', media);
    } catch (error) {
      next(error);
    }
  };

  public getDataSources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const sources = await this.service.getDataSources(agentId as string | undefined);
      sendResponse(res, 200, 'Data sources fetched', sources);
    } catch (error) {
      next(error);
    }
  };

  public getTrainingJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const jobs = await this.service.getTrainingJobs(agentId as string | undefined);
      sendResponse(res, 200, 'Training jobs fetched', jobs);
    } catch (error) {
      next(error);
    }
  };

  public getVersions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.query;
      const versions = await this.service.getVersions(agentId as string | undefined);
      sendResponse(res, 200, 'Knowledge versions fetched', versions);
    } catch (error) {
      next(error);
    }
  };
}
