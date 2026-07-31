import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export interface FormSyncJobPayload {
  scope: WorkspaceScope;
  pageId?: string;
}

export class FormSyncJob {
  async execute(payload: FormSyncJobPayload): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `FormSyncJob queued for workspace ${payload.scope.workspaceId}`,
    };
  }
}
