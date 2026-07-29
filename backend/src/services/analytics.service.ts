import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  async getOverview(agentId?: string) {
    return this.repo.getOverview(agentId);
  }

  async getConversationsOverTime(period?: string) {
    return this.repo.getConversationsOverTime(period);
  }

  async getLeadsAnalytics() {
    return this.repo.getLeadsAnalytics();
  }

  async getKnowledgeAnalytics() {
    return this.repo.getKnowledgeAnalytics();
  }

  async getAutomationAnalytics() {
    return this.repo.getAutomationAnalytics();
  }

  async getHandover() {
    return this.repo.getHandover();
  }

  async getPerformance() {
    return this.repo.getPerformance();
  }

  async getAgentsLeaderboard() {
    return this.repo.getAgentsLeaderboard();
  }

  async getRevenueAnalytics() {
    return this.repo.getRevenueAnalytics();
  }

  async getChannels() {
    return this.repo.getChannels();
  }

  async getFunnel() {
    return this.repo.getFunnel();
  }

  async getIntents() {
    return this.repo.getIntents();
  }

  async getHeatmap() {
    return this.repo.getHeatmap();
  }

  async exportReport(format?: string) {
    return this.repo.exportReport(format);
  }
}
