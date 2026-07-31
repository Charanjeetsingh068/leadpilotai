import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export interface WebhookRetryJobPayload {
  scope: WorkspaceScope;
  eventId?: string;
}

export class WebhookRetryJob {
  async execute(payload: WebhookRetryJobPayload): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `WebhookRetryJob queued for workspace ${payload.scope.workspaceId}`,
    };
  }
}
