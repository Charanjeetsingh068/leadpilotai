import { AgentRepository, AgentFilterOptions } from '../repositories/agent.repository';
import { ApiError } from '../utils/apiError';

export class AgentService {
  private agentRepository: AgentRepository;

  constructor() {
    this.agentRepository = new AgentRepository();
  }

  async getAgents(options: AgentFilterOptions) {
    return this.agentRepository.findAllWithFilters(options);
  }

  async getAgentById(id: string) {
    const agent = await this.agentRepository.findById(id);
    if (!agent) throw new ApiError(404, 'AI Agent not found');
    return agent;
  }

  async createAgent(payload: any) {
    return this.agentRepository.create({
      name: payload.name || 'New AI Agent',
      industry: payload.industry || 'Real Estate',
      department: payload.department || 'Sales',
      description: payload.description || '',
      avatar: payload.avatar || '',
      agentCode: payload.agentCode || 'PROP_ADVISOR_01',
      defaultLanguage: payload.defaultLanguage || 'English (India)',
      supportedLanguages: payload.supportedLanguages || ['English', 'Hindi', 'Hinglish'],
      businessHours: payload.businessHours || '09:00 AM - 08:00 PM',
      workingDays: payload.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      timeZone: payload.timeZone || 'Asia/Kolkata (GMT +05:30)',
      model: payload.model || 'GPT-4o',
      temperature: payload.temperature !== undefined ? Number(payload.temperature) : 0.7,
      maxTokens: payload.maxTokens ? Number(payload.maxTokens) : 1500,
      responseTone: payload.responseTone || 'Professional',
      responseStyle: payload.responseStyle || 'Helpful & Consultative',
      responseLength: payload.responseLength || 'Medium',
      typingSpeed: payload.typingSpeed || 'Natural',
      status: payload.status || 'Active',
      connectedWhatsapp: payload.connectedWhatsapp || '+91 98765 43210',
      knowledgeVersion: payload.knowledgeVersion || 'v2.4.1',
      activeLeadsCount: payload.activeLeadsCount || 250,
      conversationsToday: payload.conversationsToday || 180,
      qualificationRate: payload.qualificationRate || 68.0,
      avgResponseTime: payload.avgResponseTime || '2.4s',
      humanTakeoverRate: payload.humanTakeoverRate || 12.0,
      systemPrompt: payload.systemPrompt || 'You are Property Advisor AI, a real estate expert assistant for Acme Real Estate. Your goal is to understand customer requirements, share relevant property details, qualify leads, and help them book a site visit.\n\nAlways be professional, polite and helpful.',
      welcomeMessage: payload.welcomeMessage || '',
      autoApproval: payload.autoApproval || false,
      confidenceThreshold: payload.confidenceThreshold || 80,
    });
  }

  async updateAgent(id: string, payload: any) {
    const agent = await this.agentRepository.update(id, payload);
    if (!agent) throw new ApiError(404, 'AI Agent not found');
    return agent;
  }

  async toggleAgentStatus(id: string) {
    const agent = await this.agentRepository.findById(id);
    if (!agent) throw new ApiError(404, 'AI Agent not found');

    const nextStatus = agent.status === 'Active' ? 'Paused' : 'Active';
    return this.agentRepository.update(id, { status: nextStatus });
  }

  async deleteAgent(id: string) {
    const success = await this.agentRepository.delete(id);
    if (!success) throw new ApiError(404, 'AI Agent not found');
    return { success: true };
  }

  async getMetricsSummary() {
    return this.agentRepository.getMetricsSummary();
  }

  async getRecentActivity() {
    return [
      {
        id: 'act_1',
        agentName: 'Property Advisor AI',
        iconType: 'bot',
        action: 'Knowledge base updated to v2.4.1',
        timeAgo: '2m ago',
      },
      {
        id: 'act_2',
        agentName: 'Pharma Sales AI',
        iconType: 'whatsapp',
        action: 'WhatsApp template approved',
        timeAgo: '15m ago',
      },
      {
        id: 'act_3',
        agentName: 'Admission Counselor AI',
        iconType: 'document',
        action: 'New document uploaded',
        timeAgo: '1h ago',
      },
      {
        id: 'act_4',
        agentName: 'Auto Sales AI',
        iconType: 'flow',
        action: 'Automation flow activated',
        timeAgo: '2h ago',
      },
      {
        id: 'act_5',
        agentName: 'Insurance Advisor AI',
        iconType: 'shield',
        action: 'AI prompt updated',
        timeAgo: '3h ago',
      },
    ];
  }
}
