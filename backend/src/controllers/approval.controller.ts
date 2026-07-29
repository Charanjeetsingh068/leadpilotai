import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApprovalService } from '../services/approval.service';
import { Types } from 'mongoose';

export class ApprovalController {
  private approvalService: ApprovalService;

  constructor() {
    this.approvalService = new ApprovalService();
  }

  public getApprovals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const results = await this.approvalService.getApprovals(organizationId, req.query);

      res.status(200).json({
        success: true,
        message: 'Approvals queue fetched successfully',
        data: results.items,
        meta: results.pagination,
      });
    } catch (error) {
      console.error('[ApprovalController] Error in getApprovals:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch approvals queue',
      });
    }
  };

  public getApprovalById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;

      const approval = await this.approvalService.getApprovalById(organizationId, id);
      if (!approval) {
        res.status(404).json({
          success: false,
          message: 'Approval request not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Approval request details retrieved successfully',
        data: approval,
      });
    } catch (error) {
      console.error('[ApprovalController] Error in getApprovalById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve approval request details',
      });
    }
  };

  public approve = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;
      const actorId = req.user?.id && Types.ObjectId.isValid(req.user.id) 
        ? new Types.ObjectId(req.user.id) 
        : undefined;

      const success = await this.approvalService.approve(organizationId, id, actorId);
      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to approve. Request may not exist or is already processed.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'AI message approved and sent via WhatsApp successfully',
      });
    } catch (error) {
      console.error('[ApprovalController] Error in approve:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve AI message',
      });
    }
  };

  public reject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;
      const { reason } = req.body;
      const actorId = req.user?.id && Types.ObjectId.isValid(req.user.id) 
        ? new Types.ObjectId(req.user.id) 
        : undefined;

      if (!reason) {
        res.status(400).json({
          success: false,
          message: 'Rejection reason is required',
        });
        return;
      }

      const success = await this.approvalService.reject(organizationId, id, reason, actorId);
      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to reject. Request may not exist or is already processed.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'AI message rejected and AI Autopilot paused successfully',
      });
    } catch (error) {
      console.error('[ApprovalController] Error in reject:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject AI message',
      });
    }
  };

  public editAndSend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;
      const { pendingReplyText } = req.body;
      const actorId = req.user?.id && Types.ObjectId.isValid(req.user.id) 
        ? new Types.ObjectId(req.user.id) 
        : undefined;

      if (!pendingReplyText) {
        res.status(400).json({
          success: false,
          message: 'Reply text content is required',
        });
        return;
      }

      const success = await this.approvalService.editAndSend(organizationId, id, pendingReplyText, actorId);
      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to edit and send. Request may not exist or is already processed.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'AI message edited and sent via WhatsApp successfully',
      });
    } catch (error) {
      console.error('[ApprovalController] Error in editAndSend:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to edit and send message',
      });
    }
  };

  public assignToSales = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;
      const { salesUserId, salesUserName } = req.body;
      const actorId = req.user?.id && Types.ObjectId.isValid(req.user.id) 
        ? new Types.ObjectId(req.user.id) 
        : undefined;

      if (!salesUserId || !salesUserName) {
        res.status(400).json({
          success: false,
          message: 'salesUserId and salesUserName are required',
        });
        return;
      }

      const success = await this.approvalService.assignToSales(organizationId, id, salesUserId, salesUserName, actorId);
      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to assign salesperson. Request may not exist.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Lead successfully assigned to ${salesUserName}`,
      });
    } catch (error) {
      console.error('[ApprovalController] Error in assignToSales:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign salesperson',
      });
    }
  };

  public pauseAi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const id = req.params.id as string;
      const actorId = req.user?.id && Types.ObjectId.isValid(req.user.id) 
        ? new Types.ObjectId(req.user.id) 
        : undefined;

      const success = await this.approvalService.pauseAi(organizationId, id, actorId);
      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to pause AI. Request may not exist.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'AI Autopilot paused successfully',
      });
    } catch (error) {
      console.error('[ApprovalController] Error in pauseAi:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to pause AI Autopilot',
      });
    }
  };
}
