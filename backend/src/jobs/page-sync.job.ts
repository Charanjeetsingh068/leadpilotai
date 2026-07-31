import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export interface PageSyncJobPayload {
  scope: WorkspaceScope;
  businessId?: string;
}

export class PageSyncJob {
  async execute(payload: PageSyncJobPayload): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `PageSyncJob queued for workspace ${payload.scope.workspaceId}`,
    };
  }
}
