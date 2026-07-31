import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export interface TokenRefreshJobPayload {
  scope: WorkspaceScope;
  provider: string;
  tokenId: string;
}

export class TokenRefreshJob {
  async execute(payload: TokenRefreshJobPayload): Promise<{ success: boolean; message: string }> {
    // Contract definition for background token refresh execution
    return {
      success: true,
      message: `TokenRefreshJob queued for workspace ${payload.scope.workspaceId} provider ${payload.provider}`,
    };
  }
}
