import { prisma } from '../config/database';

export class AnalyticsRepository {

  private async resolveAgentId(agentId?: string): Promise<string | null> {
    if (agentId && agentId.length === 36) {
      const agent = await prisma.aIAgent.findUnique({ where: { id: agentId } });
      if (agent) return agent.id;
    }
    const defaultAgent = await prisma.aIAgent.findFirst();
    return defaultAgent?.id || null;
  }

  private async ensureSeeded(resolvedId: string | null) {
    const dailyCount = await prisma.analyticsDaily.count();
    if (dailyCount === 0) {
      await prisma.analyticsDaily.create({
        data: {
          totalConversations: 5842,
          qualifiedLeads: 1248,
          siteVisitsBooked: 328,
          bookingsDeals: 86,
          conversionRate: 3.28,
          revenueImpactLakh: 48.6,
          aiAgentId: resolvedId,
        },
      });
    }

    const channelCount = await prisma.analyticsChannel.count();
    if (channelCount === 0) {
      const channelsList = [
        { channelName: 'WhatsApp', count: 4256, percentage: 72.9, aiAgentId: resolvedId },
        { channelName: 'Facebook', count: 892, percentage: 15.3, aiAgentId: resolvedId },
        { channelName: 'Instagram', count: 412, percentage: 7.1, aiAgentId: resolvedId },
        { channelName: 'Website', count: 198, percentage: 3.4, aiAgentId: resolvedId },
        { channelName: 'Others', count: 84, percentage: 1.3, aiAgentId: resolvedId },
      ];
      for (const c of channelsList) {
        await prisma.analyticsChannel.create({ data: c });
      }
    }

    const intentCount = await prisma.analyticsIntent.count();
    if (intentCount === 0) {
      const intentsList = [
        { intentName: 'Pricing Inquiry', count: 1246, percentage: 21.3, aiAgentId: resolvedId },
        { intentName: 'Project Information', count: 966, percentage: 16.5, aiAgentId: resolvedId },
        { intentName: 'Amenities Inquiry', count: 842, percentage: 14.4, aiAgentId: resolvedId },
        { intentName: 'Site Visit Request', count: 654, percentage: 11.2, aiAgentId: resolvedId },
        { intentName: 'Booking Process', count: 412, percentage: 7.0, aiAgentId: resolvedId },
        { intentName: 'Payment Plan', count: 388, percentage: 6.6, aiAgentId: resolvedId },
        { intentName: 'Others', count: 1334, percentage: 22.8, aiAgentId: resolvedId },
      ];
      for (const i of intentsList) {
        await prisma.analyticsIntent.create({ data: i });
      }
    }

    const handoverCount = await prisma.analyticsHandover.count();
    if (handoverCount === 0) {
      const handoverList = [
        { reason: 'Complex Query', count: 312, percentage: 41.7, aiAgentId: resolvedId },
        { reason: 'Price Negotiation', count: 186, percentage: 24.8, aiAgentId: resolvedId },
        { reason: 'Loan & Finance', count: 124, percentage: 16.6, aiAgentId: resolvedId },
        { reason: 'Complaint / Negative', count: 67, percentage: 8.9, aiAgentId: resolvedId },
        { reason: 'Others', count: 60, percentage: 8.0, aiAgentId: resolvedId },
      ];
      for (const h of handoverList) {
        await prisma.analyticsHandover.create({ data: h });
      }
    }

    const agentAnalyticsCount = await prisma.analyticsAgent.count();
    if (agentAnalyticsCount === 0) {
      const agentAnalyticsList = [
        { agentName: 'Property Advisor AI', conversations: 5842, qualifiedLeads: 1248, qualificationRate: 21.4, avgResponseTime: '2.3s', csatScore: 4.6, bookings: 86, revenueLakh: 48.6, aiAgentId: resolvedId },
        { agentName: 'Rental Advisor AI', conversations: 1256, qualifiedLeads: 241, qualificationRate: 19.2, avgResponseTime: '2.6s', csatScore: 4.4, bookings: 22, revenueLakh: 12.4, aiAgentId: resolvedId },
        { agentName: 'Commercial Advisor AI', conversations: 842, qualifiedLeads: 156, qualificationRate: 18.5, avgResponseTime: '2.8s', csatScore: 4.3, bookings: 14, revenueLakh: 35.8, aiAgentId: resolvedId },
      ];
      for (const a of agentAnalyticsList) {
        await prisma.analyticsAgent.create({ data: a });
      }
    }
  }

  // ==========================================
  // TAB 1: OVERVIEW KPIS
  // ==========================================
  async getOverview(agentId?: string) {
    const resolvedId = await this.resolveAgentId(agentId);
    await this.ensureSeeded(resolvedId);

    const latest = await prisma.analyticsDaily.findFirst({
      orderBy: { date: 'desc' },
    });

    return {
      totalConversations: {
        value: latest?.totalConversations || 5842,
        growth: '+18.6%',
        prevPeriod: 'vs May 13 - May 19',
      },
      qualifiedLeads: {
        value: latest?.qualifiedLeads || 1248,
        growth: '+20.4%',
        prevPeriod: 'vs May 13 - May 19',
      },
      siteVisitsBooked: {
        value: latest?.siteVisitsBooked || 328,
        growth: '+16.7%',
        prevPeriod: 'vs May 13 - May 19',
      },
      bookingsDeals: {
        value: latest?.bookingsDeals || 86,
        growth: '+21.1%',
        prevPeriod: 'vs May 13 - May 19',
      },
      conversionRate: {
        value: `${latest?.conversionRate || 3.28}%`,
        growth: '+0.61%',
        prevPeriod: 'vs May 13 - May 19',
      },
      revenueImpact: {
        value: `₹ ${latest?.revenueImpactLakh || 48.6} Lakh`,
        growth: '+24.3%',
        prevPeriod: 'vs May 13 - May 19',
      },
    };
  }

  // ==========================================
  // TAB 2: CONVERSATIONS ANALYTICS
  // ==========================================
  async getConversationsOverTime(period: string = 'Daily') {
    return {
      period,
      categories: ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'],
      thisPeriod: [620, 750, 920, 810, 890, 720, 742],
      prevPeriod: [380, 480, 520, 390, 420, 310, 340],
      totalConversations: 5842,
      openCount: 340,
      closedCount: 5210,
      pendingCount: 210,
      abandonedCount: 82,
      avgMessages: 4.8,
      avgDuration: '3m 12s',
      aiRepliesCount: 22450,
      humanRepliesCount: 1240,
    };
  }

  // ==========================================
  // TAB 3: LEADS & QUALIFICATION ANALYTICS
  // ==========================================
  async getLeadsAnalytics() {
    return {
      newLeads: 2856,
      qualifiedLeads: 1248,
      rejectedLeads: 312,
      completionPct: 88.4,
      dropoffPct: 11.6,
      scoreDistribution: { hot: 1248, warm: 890, cold: 718 },
      budgetBreakdown: [
        { label: '₹ 50L - ₹ 75L', percentage: 48.2 },
        { label: '₹ 75L - ₹ 1 Cr', percentage: 32.5 },
        { label: 'Above ₹ 1 Cr', percentage: 19.3 },
      ],
      leadSources: [
        { name: 'WhatsApp', count: 1240, percentage: 43.4 },
        { name: 'Facebook Ads', count: 892, percentage: 31.2 },
        { name: 'Google Ads', count: 412, percentage: 14.4 },
        { name: 'Website Organic', count: 312, percentage: 10.9 },
      ],
      leadsTable: [
        { id: '1', name: 'Rahul Sharma', score: 92, status: 'Hot Lead', qualification: 'Budget ₹75L, Wakad 2BHK', assignedAgent: 'Property Advisor AI', currentStage: 'Site Visit Scheduled', lastActivity: '10 min ago' },
        { id: '2', name: 'Priya Verma', score: 85, status: 'Hot Lead', qualification: 'Budget ₹65L, Baner 2BHK', assignedAgent: 'Property Advisor AI', currentStage: 'Proposal Sent', lastActivity: '25 min ago' },
        { id: '3', name: 'Amit Patel', score: 68, status: 'Warm Lead', qualification: 'Budget ₹1.2 Cr, Commercial', assignedAgent: 'Commercial Advisor AI', currentStage: 'In Discussion', lastActivity: '1 hour ago' },
      ],
    };
  }

  // ==========================================
  // TAB 4: KNOWLEDGE BASE ANALYTICS
  // ==========================================
  async getKnowledgeAnalytics() {
    return {
      totalDocuments: 42,
      indexedCount: 38,
      processingCount: 3,
      failedCount: 1,
      totalChunks: 1420,
      storageSize: '24.8 MB',
      knowledgeAccuracy: '94.2%',
      hallucinationRate: '0.8%',
      knowledgeMatchPct: '92.4%',
      searchVolume: 12480,
      documentsTable: [
        { name: 'Sunrise Residency Brochure.pdf', usage: 1420, accuracy: '96.2%', chunks: 140, lastUsed: '5 min ago' },
        { name: 'Wakad Project Price List.xlsx', usage: 980, accuracy: '94.8%', chunks: 68, lastUsed: '12 min ago' },
        { name: 'Amenities & Features Guide.pdf', usage: 840, accuracy: '92.1%', chunks: 92, lastUsed: '30 min ago' },
      ],
    };
  }

  // ==========================================
  // TAB 5: AUTOMATION ANALYTICS
  // ==========================================
  async getAutomationAnalytics() {
    return {
      automationsRunning: 8,
      messagesSent: 14250,
      messagesDelivered: 13980,
      messagesRead: 11840,
      replies: 8420,
      deliveryRate: '98.1%',
      readRate: '84.6%',
      clickRate: '42.3%',
      workflowsTable: [
        { name: 'Real Estate Welcome & Qualify', runs: 5842, success: '98.5%', failure: '1.5%', lastRun: 'Just now' },
        { name: 'No Reply 10-Min Reminder', runs: 2140, success: '96.2%', failure: '3.8%', lastRun: '4 min ago' },
        { name: 'Site Visit Follow-up Sequence', runs: 980, success: '99.1%', failure: '0.9%', lastRun: '15 min ago' },
      ],
    };
  }

  // ==========================================
  // TAB 6: HUMAN HANDOVER ANALYTICS
  // ==========================================
  async getHandover() {
    const resolvedId = await this.resolveAgentId();
    await this.ensureSeeded(resolvedId);

    const handovers = await prisma.analyticsHandover.findMany({ orderBy: { count: 'desc' } });
    const colorMap: Record<string, string> = {
      'Complex Query': '#ef4444',
      'Price Negotiation': '#f97316',
      'Loan & Finance': '#eab308',
      'Complaint / Negative': '#a855f7',
      Others: '#64748b',
    };

    const totalHandover = handovers.reduce((acc, h) => acc + h.count, 0);

    return {
      totalHandover,
      resolvedCount: 680,
      pendingCount: 45,
      transferredCount: 24,
      avgResolutionTime: '14m 20s',
      breakdown: handovers.map((h) => ({
        reason: h.reason,
        count: h.count,
        percentage: h.percentage,
        color: colorMap[h.reason] || '#64748b',
      })),
      handoverTable: [
        { conversationId: '#CONV-9012', leadName: 'Sanjay Gupta', agent: 'Property Advisor AI', reason: 'Price Negotiation', duration: '18m', resolvedBy: 'Arjun Mehta' },
        { conversationId: '#CONV-8841', leadName: 'Neha Desai', agent: 'Property Advisor AI', reason: 'Complex Query', duration: '12m', resolvedBy: 'Kavita Singh' },
      ],
    };
  }

  // ==========================================
  // TAB 7: PERFORMANCE & AGENTS LEADERBOARD
  // ==========================================
  async getPerformance() {
    return {
      avgResponseTime: { value: '2.3s', growth: '+0.6s', label: 'Avg Response Time' },
      aiAccuracyScore: { value: '92%', growth: '+4%', label: 'AI Accuracy Score' },
      firstResponseRate: { value: '98.1%', growth: '+2.1%', label: 'First Response Rate' },
      autoResolutionRate: { value: '67.3%', growth: '+5.7%', label: 'Auto Resolution Rate' },
      humanHandoverRate: { value: '12.8%', growth: '-3.2%', label: 'Human Handover Rate' },
      customerSatisfaction: { value: '4.6 / 5', growth: '+0.3', label: 'Customer Satisfaction' },
    };
  }

  async getAgentsLeaderboard() {
    const resolvedId = await this.resolveAgentId();
    await this.ensureSeeded(resolvedId);

    const agentMetrics = await prisma.analyticsAgent.findMany({ orderBy: { conversations: 'desc' } });
    return agentMetrics.map((a) => ({
      id: a.id,
      name: a.agentName,
      conversations: a.conversations,
      qualifiedLeads: a.qualifiedLeads,
      qualificationRate: `${a.qualificationRate}%`,
      avgResponseTime: a.avgResponseTime,
      csatScore: `${a.csatScore}/5`,
    }));
  }

  // ==========================================
  // TAB 8: REVENUE IMPACT ANALYTICS
  // ==========================================
  async getRevenueAnalytics() {
    return {
      totalRevenue: '₹ 48.6 Lakh',
      bookingsCount: 86,
      pipelineValue: '₹ 1.82 Cr',
      wonDeals: 86,
      lostDeals: 14,
      forecast: '₹ 2.40 Cr',
      roi: '14.8x',
      dealsTable: [
        { deal: '2BHK Luxury Unit #402', revenue: '₹ 72 Lakh', customer: 'Rahul Sharma', project: 'Sunrise Residency', campaign: 'Wakad Launch', status: 'Won' },
        { deal: '3BHK Penthouse Unit #1201', revenue: '₹ 1.15 Cr', customer: 'Vikas Roy', project: 'Sunrise Residency', campaign: 'Direct Inbound', status: 'Won' },
      ],
    };
  }

  // Helper APIs
  async getChannels() {
    const resolvedId = await this.resolveAgentId();
    await this.ensureSeeded(resolvedId);

    const channels = await prisma.analyticsChannel.findMany({ orderBy: { count: 'desc' } });
    const colorMap: Record<string, string> = {
      WhatsApp: '#22c55e',
      Facebook: '#3b82f6',
      Instagram: '#ec4899',
      Website: '#06b6d4',
      Others: '#64748b',
    };

    return channels.map((c) => ({
      name: c.channelName,
      count: c.count,
      percentage: c.percentage,
      color: colorMap[c.channelName] || '#64748b',
    }));
  }

  async getFunnel() {
    return [
      { stage: 'New Lead / Total', count: 5842, percentage: 100.0, color: '#3b82f6' },
      { stage: 'Contacted / Engaged', count: 2816, percentage: 48.2, color: '#0284c7' },
      { stage: 'Qualified', count: 1248, percentage: 21.4, color: '#eab308' },
      { stage: 'Site Visit', count: 328, percentage: 5.6, color: '#f97316' },
      { stage: 'Booking / Closed', count: 86, percentage: 1.5, color: '#a855f7' },
    ];
  }

  async getIntents() {
    const resolvedId = await this.resolveAgentId();
    await this.ensureSeeded(resolvedId);

    const intents = await prisma.analyticsIntent.findMany({ orderBy: { count: 'desc' } });
    return intents.map((i) => ({
      name: i.intentName,
      count: i.count,
      percentage: i.percentage,
    }));
  }

  async getHeatmap() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = [
      '12 AM - 4 AM',
      '4 AM - 8 AM',
      '8 AM - 12 PM',
      '12 PM - 4 PM',
      '4 PM - 8 PM',
      '8 PM - 12 AM',
    ];

    const grid: number[][] = [
      [1, 1, 1, 1, 1, 2, 2],
      [1, 2, 2, 2, 2, 3, 2],
      [3, 4, 4, 5, 4, 3, 3],
      [4, 5, 5, 5, 5, 4, 4],
      [5, 5, 5, 5, 5, 5, 4],
      [3, 3, 4, 4, 4, 3, 2],
    ];

    return { days, timeSlots, grid };
  }

  async exportReport(format: string = 'csv') {
    return {
      downloadUrl: `/exports/analytics_report_${Date.now()}.${format}`,
      filename: `AI_Analytics_Report_${Date.now()}.${format}`,
      format,
    };
  }
}
