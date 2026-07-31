import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export interface LeadSyncJobPayload {
  scope: WorkspaceScope;
  leadGenId: string;
  formId: string;
}

export class LeadSyncJob {
  async execute(payload: LeadSyncJobPayload): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `LeadSyncJob queued for lead ${payload.leadGenId} in workspace ${payload.scope.workspaceId}`,
    };
  }
}
