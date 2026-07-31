import { FacebookRepository } from '../repositories/facebook.repository';
import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export class SyncService {
  private repo: FacebookRepository;

  constructor() {
    this.repo = new FacebookRepository();
  }

  async getSyncHistory(scope: WorkspaceScope, limit: number = 20) {
    return this.repo.getRecentEvents(scope, limit);
  }

  async recordSyncEvent(scope: WorkspaceScope, syncType: string, status: string, recordsSynced: number = 0, errorMessage?: string) {
    return this.repo.createSyncLog(scope, {
      syncType,
      status,
      recordsSynced,
      errorMessage,
    });
  }
}
