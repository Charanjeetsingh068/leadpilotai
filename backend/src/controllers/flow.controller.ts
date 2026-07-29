import { Request, Response, NextFunction } from 'express';
import { FlowService } from '../services/flow.service';
import { sendResponse } from '../utils/apiResponse';

export class FlowController {
  private service = new FlowService();

  public getFlow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const flow = await this.service.getFlow(agentId);
      sendResponse(res, 200, 'Qualification flow fetched', flow);
    } catch (error) {
      next(error);
    }
  };

  public getFlowById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const flow = await this.service.getFlow(id);
      sendResponse(res, 200, 'Qualification flow fetched by ID', flow);
    } catch (error) {
      next(error);
    }
  };

  public saveFlowNodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { nodes, edges } = req.body;
      const updated = await this.service.updateFlowNodes(id, nodes || [], edges);
      sendResponse(res, 200, 'Qualification flow saved successfully', updated);
    } catch (error) {
      next(error);
    }
  };

  public publishFlow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.body;
      const published = await this.service.publishFlow(id);
      sendResponse(res, 200, 'Qualification flow published live to AI Agent!', published);
    } catch (error) {
      next(error);
    }
  };

  public testFlow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const simulation = await this.service.runTestSimulation(req.body);
      sendResponse(res, 200, 'Flow test simulation executed', simulation);
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const flowId = String(req.query.flowId || '');
      const history = await this.service.getExecutionHistory(flowId);
      sendResponse(res, 200, 'Execution history fetched', history);
    } catch (error) {
      next(error);
    }
  };

  public getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const questions = await this.service.getQuestions(agentId);
      sendResponse(res, 200, 'Qualification questions fetched', questions);
    } catch (error) {
      next(error);
    }
  };

  public createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const question = await this.service.createQuestion(req.body);
      sendResponse(res, 201, 'Question created successfully', question);
    } catch (error) {
      next(error);
    }
  };

  public deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteQuestion(id);
      sendResponse(res, 200, 'Question deleted successfully', { id });
    } catch (error) {
      next(error);
    }
  };

  public getScoreRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const rules = await this.service.getScoreRules(agentId);
      sendResponse(res, 200, 'Lead score rules fetched', rules);
    } catch (error) {
      next(error);
    }
  };

  public getConditions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const conditions = await this.service.getConditions(agentId);
      sendResponse(res, 200, 'Business conditions fetched', conditions);
    } catch (error) {
      next(error);
    }
  };

  public getAutomations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const automations = await this.service.getAutomations(agentId);
      sendResponse(res, 200, 'Automation actions fetched', automations);
    } catch (error) {
      next(error);
    }
  };

  public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const settings = await this.service.getSettings(agentId);
      sendResponse(res, 200, 'Flow settings fetched', settings);
    } catch (error) {
      next(error);
    }
  };
}
