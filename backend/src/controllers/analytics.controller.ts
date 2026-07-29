import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '../utils/apiResponse';

export class AnalyticsController {
  private service = new AnalyticsService();

  public getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const data = await this.service.getOverview(agentId);
      sendResponse(res, 200, 'Analytics overview fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const period = req.query.period as string | undefined;
      const data = await this.service.getConversationsOverTime(period);
      sendResponse(res, 200, 'Conversations analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getLeadsAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getLeadsAnalytics();
      sendResponse(res, 200, 'Leads and qualification analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getKnowledgeAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getKnowledgeAnalytics();
      sendResponse(res, 200, 'Knowledge base analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getAutomationAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAutomationAnalytics();
      sendResponse(res, 200, 'Automation analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getHandover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getHandover();
      sendResponse(res, 200, 'Human handover analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getPerformance();
      sendResponse(res, 200, 'AI performance metrics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getAgentsLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAgentsLeaderboard();
      sendResponse(res, 200, 'AI agents leaderboard fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getRevenueAnalytics();
      sendResponse(res, 200, 'Revenue analytics fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getChannels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getChannels();
      sendResponse(res, 200, 'Channel distribution fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getFunnel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getFunnel();
      sendResponse(res, 200, 'Qualification funnel fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getIntents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getIntents();
      sendResponse(res, 200, 'Top intents fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public getHeatmap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getHeatmap();
      sendResponse(res, 200, 'Conversation heatmap fetched', data);
    } catch (error) {
      next(error);
    }
  };

  public exportReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const format = req.query.format as string | undefined || 'csv';
      const result = await this.service.exportReport(format);
      sendResponse(res, 200, 'Report exported successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
