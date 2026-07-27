import { Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { sendResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { LeadStatus } from '../enums/lead.enums';

export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  public getDashboardData = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_demo_default';
      const period = req.query.period as string | undefined;

      const data = await this.leadService.getDashboardOverview(organizationId, period);
      sendResponse(res, 200, 'Dashboard statistics retrieved', data);
    } catch (error) {
      next(error);
    }
  };

  public getLeads = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_demo_default';
      const { source, status, industry, project, assignedSalesUser, startDate, endDate, search, sortBy, sortOrder, page, limit } = req.query;

      const result = await this.leadService.getLeadsWithFilters(organizationId, {
        source: source as string | undefined,
        status: status as string | undefined,
        industry: industry as string | undefined,
        project: project as string | undefined,
        assignedSalesUser: assignedSalesUser as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        search: search as string | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      sendResponse(res, 200, 'Leads fetched successfully', result.leads, result.meta);
    } catch (error) {
      next(error);
    }
  };

  public getLeadById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const lead = await this.leadService.getLeadById(id);
      sendResponse(res, 200, 'Lead profile retrieved', lead);
    } catch (error) {
      next(error);
    }
  };

  public createLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_demo_default';
      const createdBy = req.user?.id;

      const lead = await this.leadService.createLead({
        ...req.body,
        organizationId,
        createdBy,
      });
      sendResponse(res, 201, 'Lead created successfully', lead);
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const actorId = req.user?.id;

      const result = await this.leadService.updateLeadStatus(id, status as LeadStatus, actorId);
      sendResponse(res, 200, 'Lead status updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public assignLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { salesUserId, reason } = req.body;
      const assignedBy = req.user?.id || 'system';

      const result = await this.leadService.assignLead(id, salesUserId, assignedBy, reason);
      sendResponse(res, 200, 'Lead assigned successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public addNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { noteText } = req.body;
      const authorId = req.user?.id || 'system';

      const result = await this.leadService.addLeadNote(id, authorId, noteText);
      sendResponse(res, 201, 'Note added successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public deleteLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const deletedBy = req.user?.id;

      const result = await this.leadService.softDeleteLead(id, deletedBy);
      sendResponse(res, 200, 'Lead soft deleted successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
