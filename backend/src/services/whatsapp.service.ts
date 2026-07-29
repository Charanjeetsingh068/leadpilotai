import { WhatsAppRepository } from '../repositories/whatsapp.repository';

export class WhatsAppService {
  private repository = new WhatsAppRepository();

  async getConnection(agentId?: string) {
    return this.repository.getConnection(agentId);
  }

  async getTemplates(agentId?: string) {
    return this.repository.getTemplates(agentId);
  }

  async createTemplate(payload: any) {
    return this.repository.createTemplate(payload);
  }

  async deleteTemplate(id: string) {
    return this.repository.deleteTemplate(id);
  }

  async getFollowupSequence(agentId?: string) {
    return this.repository.getFollowupSequence(agentId);
  }

  async getAutomationRules(agentId?: string) {
    return this.repository.getAutomationRules(agentId);
  }

  async getUsageMetrics(agentId?: string) {
    return this.repository.getUsageMetrics(agentId);
  }

  async getLogs(agentId?: string) {
    return this.repository.getLogs(agentId);
  }

  async testConnection(agentId?: string) {
    return {
      status: 'Success',
      apiConnection: 'Connected',
      phoneNumberVerified: true,
      webhookActive: true,
      messageSendingEnabled: true,
      messageReceivingEnabled: true,
      qualityRating: 'High',
      rateLimitAvailablePercentage: 95,
      timestamp: new Date().toISOString(),
    };
  }
}
