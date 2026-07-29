import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent.service';
import { sendResponse } from '../utils/apiResponse';

export class AgentController {
  private agentService: AgentService;

  constructor() {
    this.agentService = new AgentService();
  }

  public getAgents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { industry, status, search, sortBy, sortOrder, page, limit } = req.query;

      const result = await this.agentService.getAgents({
        industry: industry as string | undefined,
        status: status as string | undefined,
        search: search as string | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 6,
      });

      const meta = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };

      sendResponse(res, 200, 'AI Agents fetched successfully', result.agents, meta);
    } catch (error) {
      next(error);
    }
  };

  public getAgentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const agent = await this.agentService.getAgentById(id);
      sendResponse(res, 200, 'AI Agent details fetched', agent);
    } catch (error) {
      next(error);
    }
  };

  public createAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agent = await this.agentService.createAgent(req.body);
      sendResponse(res, 201, 'AI Agent created successfully', agent);
    } catch (error) {
      next(error);
    }
  };

  public updateAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const agent = await this.agentService.updateAgent(id, req.body);
      sendResponse(res, 200, 'AI Agent updated successfully', agent);
    } catch (error) {
      next(error);
    }
  };

  public toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const agent = await this.agentService.toggleAgentStatus(id);
      sendResponse(res, 200, 'AI Agent status toggled', agent);
    } catch (error) {
      next(error);
    }
  };

  public deleteAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await this.agentService.deleteAgent(id);
      sendResponse(res, 200, 'AI Agent deleted successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public getMetricsSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.agentService.getMetricsSummary();
      sendResponse(res, 200, 'Agent metrics summary fetched', summary);
    } catch (error) {
      next(error);
    }
  };

  public getRecentActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activity = await this.agentService.getRecentActivity();
      sendResponse(res, 200, 'Recent activity fetched', activity);
    } catch (error) {
      next(error);
    }
  };
}
