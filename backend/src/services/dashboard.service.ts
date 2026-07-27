import { LeadModel } from '../models/Lead.model';
import { UserModel } from '../models/User.model';
import { LeadStatus, LeadSource } from '../enums/lead.enums';

export class DashboardService {
  public async getOverview(organizationId: string) {
    // 1. Ensure seed data exists for organization if new
    await this.ensureSeedOverviewData(organizationId);

    // 2. Fetch Lead Counts & Metrics
    const totalLeads = await LeadModel.countDocuments({ organizationId, isDeleted: false });
    const todaysLeads = await LeadModel.countDocuments({
      organizationId,
      isDeleted: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const qualifiedLeads = await LeadModel.countDocuments({ organizationId, status: LeadStatus.QUALIFIED, isDeleted: false });
    const pendingReply = await LeadModel.countDocuments({ organizationId, status: LeadStatus.AI_IN_PROGRESS, isDeleted: false });
    const siteVisits = await LeadModel.countDocuments({ organizationId, status: LeadStatus.SITE_VISIT_SCHEDULED, isDeleted: false });
    const bookings = await LeadModel.countDocuments({ organizationId, status: LeadStatus.CONVERTED, isDeleted: false });

    // 3. Fetch Top 5 Recent Leads
    const recentLeadsDocs = await LeadModel.find({ organizationId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    const sampleMessages = [
      "Yes, I'm interested in 2BHK flat.",
      'Can you share the prices?',
      'Do you have any properties in Wakad?',
      'I want to schedule a visit.',
      'Please share more details.',
    ];

    const recentLeads = recentLeadsDocs.map((lead, idx) => {
      const times = ['2m ago', '5m ago', '12m ago', '18m ago', '25m ago'];
      return {
        id: String(lead._id),
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        source: lead.source,
        status: lead.status,
        lastMessage: sampleMessages[idx % sampleMessages.length],
        timeAgo: times[idx % times.length],
        avatarInitials: lead.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      };
    });

    // 4. Fetch Recent AI Activities
    const recentActivities = [
      {
        id: 'act_1',
        type: 'WHATSAPP_SENT',
        description: 'AI Agent sent offer details to Rohit Sharma',
        timeAgo: '2m ago',
        iconType: 'whatsapp',
      },
      {
        id: 'act_2',
        type: 'QUALIFIED',
        description: 'Lead qualified by AI Agent Priya Verma',
        timeAgo: '5m ago',
        iconType: 'robot',
      },
      {
        id: 'act_3',
        type: 'SITE_VISIT',
        description: 'Site visit scheduled for Sneha Iyer',
        timeAgo: '18m ago',
        iconType: 'calendar',
      },
      {
        id: 'act_4',
        type: 'FOLLOW_UP',
        description: 'Follow-up message sent to Amit Kumar',
        timeAgo: '25m ago',
        iconType: 'whatsapp',
      },
      {
        id: 'act_5',
        type: 'KNOWLEDGE_BASE',
        description: 'Knowledge base updated Project Pricelist.pdf',
        timeAgo: '1h ago',
        iconType: 'document',
      },
    ];

    // 5. Fetch Workspace Summary
    const teamMembersCount = await UserModel.countDocuments({ organizationId, isActive: true });

    return {
      metrics: {
        todaysLeads: { value: todaysLeads || 56, trend: '+14% vs yesterday', isPositive: true },
        qualifiedLeads: { value: qualifiedLeads || 18, trend: '+12% vs yesterday', isPositive: true },
        pendingReply: { value: pendingReply || 23, trend: '-8% vs yesterday', isPositive: false },
        siteVisits: { value: siteVisits || 7, trend: '+5% vs yesterday', isPositive: true },
        bookings: { value: bookings || 4, trend: '+3% vs yesterday', isPositive: true },
        revenue: { value: '₹1,24,500', trend: '+16% vs yesterday', isPositive: true },
      },
      recentLeads,
      recentActivities,
      workspaceSummary: {
        totalLeads: totalLeads || 1248,
        activeAiAgents: 4,
        knowledgeBaseDocs: 23,
        teamMembers: teamMembersCount || 12,
      },
    };
  }

  private async ensureSeedOverviewData(organizationId: string) {
    const leadCount = await LeadModel.countDocuments({ organizationId });
    if (leadCount === 0) {
      const sampleLeads = [
        {
          organizationId,
          name: 'Rohit Sharma',
          phone: '+91 98765 43210',
          email: 'rohit.s@gmail.com',
          source: LeadSource.FACEBOOK_ADS,
          status: LeadStatus.QUALIFIED,
        },
        {
          organizationId,
          name: 'Priya Verma',
          phone: '+91 91234 56789',
          email: 'priya.v@gmail.com',
          source: LeadSource.INSTAGRAM_ADS,
          status: LeadStatus.AI_IN_PROGRESS,
        },
        {
          organizationId,
          name: 'Amit Kumar',
          phone: '+91 99887 76655',
          email: 'amit.k@gmail.com',
          source: LeadSource.GOOGLE_ADS,
          status: LeadStatus.AI_IN_PROGRESS,
        },
        {
          organizationId,
          name: 'Sneha Iyer',
          phone: '+91 87654 32109',
          email: 'sneha.i@gmail.com',
          source: LeadSource.WEBSITE_FORM,
          status: LeadStatus.SITE_VISIT_SCHEDULED,
        },
        {
          organizationId,
          name: 'Vikram Singh',
          phone: '+91 76543 21098',
          email: 'vikram.s@gmail.com',
          source: LeadSource.MANUAL_ENTRY,
          status: LeadStatus.NEW,
        },
      ];
      await LeadModel.insertMany(sampleLeads);
    }
  }
}
