import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  public getOverview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_leadpilot_demo';
      const overviewData = await this.dashboardService.getOverview(organizationId);

      res.status(200).json({
        success: true,
        data: overviewData,
      });
    } catch (error) {
      console.error('[DashboardController] Error fetching overview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard overview metrics',
      });
    }
  };
}
