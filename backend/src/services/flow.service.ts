import { FlowRepository } from '../repositories/flow.repository';

export class FlowService {
  private repository = new FlowRepository();

  async getFlow(agentId?: string) {
    return this.repository.getFlow(agentId);
  }

  async updateFlowNodes(flowId: string, nodes: any[], edges?: any[]) {
    return this.repository.updateFlowNodes(flowId, nodes, edges);
  }

  async publishFlow(flowId: string) {
    return this.repository.publishFlow(flowId);
  }

  async getExecutionHistory(flowId: string) {
    return this.repository.getExecutionHistory(flowId);
  }

  async getQuestions(agentId?: string) {
    return this.repository.getQuestions(agentId);
  }

  async createQuestion(payload: any) {
    return this.repository.createQuestion(payload);
  }

  async deleteQuestion(id: string) {
    return this.repository.deleteQuestion(id);
  }

  async getScoreRules(agentId?: string) {
    return this.repository.getScoreRules(agentId);
  }

  async getConditions(agentId?: string) {
    return this.repository.getConditions(agentId);
  }

  async getAutomations(agentId?: string) {
    return this.repository.getAutomations(agentId);
  }

  async getSettings(agentId?: string) {
    return this.repository.getSettings(agentId);
  }

  async runTestSimulation(payload: any) {
    return {
      sessionName: 'Interactive Simulation',
      executedNodesCount: 8,
      leadScore: 75,
      leadStatus: 'Hot Lead',
      variablesCaptured: {
        budget: '₹1 Cr - ₹2 Cr',
        location: 'Gurgaon Expressway',
        homeLoanRequired: true,
      },
      executionLogs: [
        'Start Node executed successfully',
        'Welcome Message sent via WhatsApp Simulator',
        'Lead answered Budget: ₹1 Cr - ₹2 Cr (+20 Points)',
        'Evaluated Condition Branch: ₹1 Cr - ₹2 Cr -> MATCHED',
        'Triggered Automation: Send Brochure & Pricelist PDF',
        'Flow Completed. Lead Profile updated in PostgreSQL CRM.',
      ],
    };
  }
}
