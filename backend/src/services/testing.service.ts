import { TestingRepository } from '../repositories/testing.repository';

export class TestingService {
  private repo = new TestingRepository();

  async getScenarios() {
    return this.repo.getScenarios();
  }

  async getLanguages() {
    return this.repo.getLanguages();
  }

  async startSession(data: any) {
    return this.repo.startSession(data);
  }

  async getSession(id: string) {
    return this.repo.getSession(id);
  }

  async clearSession(sessionId: string) {
    return this.repo.clearSession(sessionId);
  }

  async sendMessage(data: any) {
    return this.repo.sendMessage(data);
  }

  async getSessionHistory(agentId?: string) {
    return this.repo.getSessionHistory(agentId);
  }

  async getMetrics(sessionId?: string, agentId?: string) {
    return this.repo.getMetrics(sessionId, agentId);
  }
}
