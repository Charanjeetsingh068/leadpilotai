import { WhatsAppRepository } from '../repositories/whatsapp.repository';

export class WhatsAppService {
  private repo = new WhatsAppRepository();

  async getConnection(agentId?: string) {
    return this.repo.getConnection(agentId);
  }

  async connect(data: any, agentId?: string) {
    return this.repo.connect(data, agentId);
  }

  async disconnect(agentId?: string) {
    return this.repo.disconnect(agentId);
  }

  async testConnection(agentId?: string) {
    return this.repo.testConnection(agentId);
  }

  async getTemplates(agentId?: string) {
    return this.repo.getTemplates(agentId);
  }

  async createTemplate(data: any) {
    return this.repo.createTemplate(data);
  }

  async updateTemplate(id: string, data: any) {
    return this.repo.updateTemplate(id, data);
  }

  async deleteTemplate(id: string) {
    return this.repo.deleteTemplate(id);
  }

  async getWelcomeMessage(agentId?: string) {
    return this.repo.getWelcomeMessage(agentId);
  }

  async saveWelcomeMessage(welcomeText: string, agentId?: string) {
    return this.repo.saveWelcomeMessage(welcomeText, agentId);
  }

  async getFollowupSequence(agentId?: string) {
    return this.repo.getFollowupSequence(agentId);
  }

  async saveFollowupSequence(data: any, agentId?: string) {
    return this.repo.saveFollowupSequence(data, agentId);
  }

  async getAutomationRules(agentId?: string) {
    return this.repo.getAutomationRules(agentId);
  }

  async createAutomationRule(data: any) {
    return this.repo.createAutomationRule(data);
  }

  async updateAutomationRule(id: string, data: any) {
    return this.repo.updateAutomationRule(id, data);
  }

  async deleteAutomationRule(id: string) {
    return this.repo.deleteAutomationRule(id);
  }

  async getBusinessHours(agentId?: string) {
    return this.repo.getBusinessHours(agentId);
  }

  async saveBusinessHours(data: any, agentId?: string) {
    return this.repo.saveBusinessHours(data, agentId);
  }

  async getHumanTakeover(agentId?: string) {
    return this.repo.getHumanTakeover(agentId);
  }

  async saveHumanTakeover(data: any, agentId?: string) {
    return this.repo.saveHumanTakeover(data, agentId);
  }

  async getMedia(agentId?: string) {
    return this.repo.getMedia(agentId);
  }

  async createMedia(data: any) {
    return this.repo.createMedia(data);
  }

  async deleteMedia(id: string) {
    return this.repo.deleteMedia(id);
  }

  async getLogs(agentId?: string) {
    return this.repo.getLogs(agentId);
  }

  async getUsageMetrics(agentId?: string) {
    return this.repo.getUsageMetrics(agentId);
  }

  async processIncomingWebhook(payload: any, wabaId?: string) {
    return this.repo.processIncomingWebhook(payload, wabaId);
  }
}
