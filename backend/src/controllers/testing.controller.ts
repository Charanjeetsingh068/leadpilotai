import { Request, Response, NextFunction } from 'express';
import { TestingService } from '../services/testing.service';
import { sendResponse } from '../utils/apiResponse';

export class TestingController {
  private service = new TestingService();

  public getScenarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scenarios = await this.service.getScenarios();
      sendResponse(res, 200, 'Testing scenarios fetched', scenarios);
    } catch (error) {
      next(error);
    }
  };

  public getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const languages = await this.service.getLanguages();
      sendResponse(res, 200, 'Testing languages fetched', languages);
    } catch (error) {
      next(error);
    }
  };

  public startSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.service.startSession(req.body);
      sendResponse(res, 201, 'AI Testing session started', session);
    } catch (error) {
      next(error);
    }
  };

  public getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.query.id as string || req.params.id as string || '';
      const session = await this.service.getSession(id);
      sendResponse(res, 200, 'AI Testing session fetched', session);
    } catch (error) {
      next(error);
    }
  };

  public clearSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.body.sessionId || req.body.id || req.query.sessionId as string || '';
      const session = await this.service.clearSession(sessionId);
      sendResponse(res, 200, 'AI Testing chat session cleared', session);
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.sendMessage(req.body);
      sendResponse(res, 200, 'AI message processed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public getSessionHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const history = await this.service.getSessionHistory(agentId);
      sendResponse(res, 200, 'Testing session history fetched', history);
    } catch (error) {
      next(error);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.query.sessionId as string | undefined;
      const agentId = req.query.agentId as string | undefined;
      const metrics = await this.service.getMetrics(sessionId, agentId);
      sendResponse(res, 200, 'AI testing metrics fetched', metrics);
    } catch (error) {
      next(error);
    }
  };
}
