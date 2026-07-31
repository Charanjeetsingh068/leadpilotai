import { FacebookRepository } from '../repositories/facebook.repository';
import { WorkspaceScope } from '../interfaces/workspace-scope.interface';

export class AuditService {
  private repo: FacebookRepository;

  constructor() {
    this.repo = new FacebookRepository();
  }

  async logEvent(scope: WorkspaceScope, message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO', category: string = 'INTEGRATION', details?: string) {
    return this.repo.createEvent(scope, {
      eventType: category,
      title: message,
      description: details || message,
      status: level === 'ERROR' ? 'FAILED' : 'SUCCESS',
    });
  }

  async getLogs(scope: WorkspaceScope, limit: number = 50) {
    return this.repo.getRecentEvents(scope, limit);
  }
}
