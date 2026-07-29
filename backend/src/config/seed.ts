import { prisma } from './database';
import { hashPassword } from '../utils/password.utils';
import { LeadSource, LeadStatus } from '../enums/lead.enums';

export const seedInitialData = async () => {
  try {
    console.log('[Seed] Starting database seeding in PostgreSQL...');

    // 1. Ensure Roles Exist
    let superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: { name: 'SUPER_ADMIN', description: 'Super Administrator access' },
      });
    }

    let clientAdminRole = await prisma.role.findUnique({ where: { name: 'CLIENT_ADMIN' } });
    if (!clientAdminRole) {
      clientAdminRole = await prisma.role.create({
        data: { name: 'CLIENT_ADMIN', description: 'Client Administrator access' },
      });
    }

    let salesExecutiveRole = await prisma.role.findUnique({ where: { name: 'SALES_EXECUTIVE' } });
    if (!salesExecutiveRole) {
      salesExecutiveRole = await prisma.role.create({
        data: { name: 'SALES_EXECUTIVE', description: 'Sales Executive access' },
      });
    }

    // 2. Ensure default Company Exists
    let company = await prisma.company.findFirst({ where: { name: 'Acme Real Estate' } });
    if (!company) {
      company = await prisma.company.create({
        data: { name: 'Acme Real Estate' },
      });
      console.log('[Seed] Default company Acme Real Estate created.');
    }

    // 3. Ensure default Workspace Exists
    let workspace = await prisma.workspace.findFirst({ where: { name: 'Acme Real Estate Workspace' } });
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Acme Real Estate Workspace',
          companyId: company.id,
        },
      });
      console.log('[Seed] Default workspace created.');
    }

    // 4. Ensure Users Exist
    let adminUser = await prisma.user.findUnique({ where: { email: 'charanjeet.s7730@gmail.com' } });
    if (!adminUser) {
      const passwordHash = await hashPassword('123456');
      adminUser = await prisma.user.create({
        data: {
          name: 'Charanjeet Singh',
          email: 'charanjeet.s7730@gmail.com',
          passwordHash,
          roleId: clientAdminRole.id,
          organizationId: 'org_leadpilot_demo',
          companyId: company.id,
        },
      });
      console.log('[Seed] Admin user charanjeet.s7730@gmail.com seeded.');
    }

    let salesUser = await prisma.user.findUnique({ where: { email: 'neha@leadpilot.ai' } });
    if (!salesUser) {
      const passwordHash = await hashPassword('123456');
      salesUser = await prisma.user.create({
        data: {
          name: 'Neha Singh',
          email: 'neha@leadpilot.ai',
          passwordHash,
          roleId: salesExecutiveRole.id,
          organizationId: 'org_leadpilot_demo',
          companyId: company.id,
        },
      });
      console.log('[Seed] Sales executive neha@leadpilot.ai seeded.');
    }

    // 5. Ensure Projects Exist
    const projects = ['Sunshine Villas', 'Lake View Homes', 'Royal Residency', 'Skyline Towers'];
    for (const name of projects) {
      const exists = await prisma.project.findUnique({ where: { name } });
      if (!exists) {
        await prisma.project.create({ data: { name } });
      }
    }

    // 6. Ensure Lead Sources Exist
    const sources = Object.values(LeadSource);
    for (const name of sources) {
      const exists = await prisma.leadSource.findUnique({ where: { name } });
      if (!exists) {
        await prisma.leadSource.create({ data: { name } });
      }
    }

    // 7. Ensure Default AI Agents Exist
    const agentCount = await prisma.aIAgent.count();
    if (agentCount === 0) {
      const defaultAgents = [
        {
          name: 'Property Advisor AI',
          industry: 'Real Estate',
          description: 'Specialized in residential & commercial property inquiries, site visit booking, and pricing info.',
          status: 'Active',
          connectedWhatsapp: '+91 98765 43210',
          knowledgeVersion: 'v2.4.1',
          activeLeadsCount: 486,
          conversationsToday: 324,
          qualificationRate: 68.0,
          avgResponseTime: '2.4s',
          humanTakeoverRate: 12.0,
        },
        {
          name: 'Pharma Sales AI',
          industry: 'Pharma',
          description: 'Engages doctors, chemists, and distributors with sample requests and product documentation.',
          status: 'Active',
          connectedWhatsapp: '+91 98765 43211',
          knowledgeVersion: 'v1.8.3',
          activeLeadsCount: 352,
          conversationsToday: 216,
          qualificationRate: 72.0,
          avgResponseTime: '1.8s',
          humanTakeoverRate: 8.0,
        },
        {
          name: 'Admission Counselor AI',
          industry: 'Education',
          description: 'Guides students through university courses, eligibility, fee structures, and scholarship criteria.',
          status: 'Active',
          connectedWhatsapp: '+91 98765 43212',
          knowledgeVersion: 'v2.1.0',
          activeLeadsCount: 298,
          conversationsToday: 184,
          qualificationRate: 64.0,
          avgResponseTime: '2.7s',
          humanTakeoverRate: 15.0,
        },
        {
          name: 'Auto Sales AI',
          industry: 'Automobile',
          description: 'Handles test drive bookings, variant comparisons, trade-in quotes, and EMI calculations.',
          status: 'Paused',
          connectedWhatsapp: '+91 98765 43213',
          knowledgeVersion: 'v1.5.2',
          activeLeadsCount: 217,
          conversationsToday: 128,
          qualificationRate: 58.0,
          avgResponseTime: '3.1s',
          humanTakeoverRate: 18.0,
        },
        {
          name: 'Insurance Advisor AI',
          industry: 'Insurance',
          description: 'Qualifies leads for health, life, and motor insurance policies with instant premium quotes.',
          status: 'Active',
          connectedWhatsapp: '+91 98765 43214',
          knowledgeVersion: 'v2.0.5',
          activeLeadsCount: 263,
          conversationsToday: 156,
          qualificationRate: 66.0,
          avgResponseTime: '2.3s',
          humanTakeoverRate: 13.0,
        },
        {
          name: 'Healthcare Assistant AI',
          industry: 'Healthcare',
          description: 'Assists patients with appointment booking, doctor availability, lab test packages, and FAQs.',
          status: 'Active',
          connectedWhatsapp: '+91 98765 43215',
          knowledgeVersion: 'v1.9.7',
          activeLeadsCount: 189,
          conversationsToday: 112,
          qualificationRate: 62.0,
          avgResponseTime: '2.6s',
          humanTakeoverRate: 11.0,
        },
      ];

      for (const agent of defaultAgents) {
        await prisma.aIAgent.create({ data: agent });
      }
      console.log('[Seed] Default 6 AI Agents seeded in PostgreSQL.');
    }

    // 8. Ensure Default Knowledge Base & Documents Exist
    const docCount = await prisma.knowledgeDocument.count();
    if (docCount === 0) {
      let kb = await prisma.knowledgeBase.findFirst();
      if (!kb) {
        kb = await prisma.knowledgeBase.create({
          data: { name: 'Real Estate Standard Inventory' },
        });
      }

      const defaultDocs = [
        {
          name: 'Sunshine Villas Brochure.pdf',
          type: 'PDF',
          category: 'Brochure',
          pagesCount: 24,
          chunksCount: 1248,
          status: 'Indexed',
          uploadedBy: 'Arjun Mehta',
          fileSize: '4.8 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Price List - May 2025.xlsx',
          type: 'Excel',
          category: 'Pricing',
          pagesCount: 6,
          chunksCount: 654,
          status: 'Indexed',
          uploadedBy: 'Arjun Mehta',
          fileSize: '1.2 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Payment Plan & Offers.pdf',
          type: 'PDF',
          category: 'Payment Plan',
          pagesCount: 12,
          chunksCount: 842,
          status: 'Indexed',
          uploadedBy: 'Arjun Mehta',
          fileSize: '2.6 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Amenities & Features.pdf',
          type: 'PDF',
          category: 'Amenities',
          pagesCount: 18,
          chunksCount: 1102,
          status: 'Indexed',
          uploadedBy: 'Arjun Mehta',
          fileSize: '3.1 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'RERA Certificate - Sunshine Villas.pdf',
          type: 'PDF',
          category: 'Legal',
          pagesCount: 4,
          chunksCount: 256,
          status: 'Indexed',
          uploadedBy: 'Arjun Mehta',
          fileSize: '1.8 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Project Location & Connectivity.pdf',
          type: 'PDF',
          category: 'Location',
          pagesCount: 10,
          chunksCount: 684,
          status: 'Indexing',
          uploadedBy: 'Arjun Mehta',
          fileSize: '2.2 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Sunshine Villas Walkthrough.mp4',
          type: 'Video',
          category: 'Media',
          pagesCount: null,
          chunksCount: 1855,
          status: 'Pending',
          uploadedBy: 'Arjun Mehta',
          fileSize: '45.0 MB',
          knowledgeBaseId: kb.id,
        },
        {
          name: 'Floor Plans - All Blocks.zip',
          type: 'ZIP',
          category: 'Floor Plans',
          pagesCount: null,
          chunksCount: null,
          status: 'Processing',
          uploadedBy: 'Arjun Mehta',
          fileSize: '18.4 MB',
          knowledgeBaseId: kb.id,
        },
      ];

      for (const doc of defaultDocs) {
        await prisma.knowledgeDocument.create({ data: doc });
      }
      console.log('[Seed] Default 8 Knowledge Documents seeded in PostgreSQL.');
    }

    const leadCount = await prisma.lead.count();
    if (leadCount === 0) {
      const dbSources = await prisma.leadSource.findMany();
      const sourceMap = new Map(dbSources.map((s) => [s.name, s.id]));

      const mockLeads = [
        {
          name: 'Rohit Sharma',
          phone: '+91 98765 43210',
          email: 'rohit.sharma@example.com',
          source: LeadSource.FACEBOOK_ADS,
          status: LeadStatus.HUMAN_APPROVAL_REQUIRED,
          project: 'Sunshine Villas',
          location: 'Indore',
          budget: '₹50 - ₹70 Lakhs',
          timeline: '1-3 months',
          qualificationScore: 85,
          pendingReply: 'Sure Rohit! 👋\nThe price for 2BHK in Sunshine Villas starts from ₹45 Lakhs onwards.\nWould you like to schedule a site visit this weekend to explore the project?',
          reason: 'Pricing shared by AI',
          priority: 'High',
          confidenceScore: 78,
        },
        {
          name: 'Priya Verma',
          phone: '+91 91234 56789',
          email: 'priya.v@example.com',
          source: LeadSource.INSTAGRAM_ADS,
          status: LeadStatus.HUMAN_APPROVAL_REQUIRED,
          project: 'Lake View Homes',
          location: 'Bhopal',
          budget: '₹80 - ₹90 Lakhs',
          timeline: 'Immediate',
          qualificationScore: 94,
          pendingReply: "Hi Priya! I've generated the official brochure for Lake View Homes. You can download it here or let me know if you would like me to walk you through the floor plan details.",
          reason: 'Brochure request detected',
          priority: 'Medium',
          confidenceScore: 92,
        },
        {
          name: 'Amit Kumar',
          phone: '+91 99887 76655',
          email: 'amit.k@example.com',
          source: LeadSource.GOOGLE_ADS,
          status: LeadStatus.HUMAN_APPROVAL_REQUIRED,
          project: 'Royal Residency',
          location: 'Indore',
          budget: '₹60 - ₹70 Lakhs',
          timeline: '3-6 months',
          qualificationScore: 78,
          pendingReply: 'Hi Amit, we currently have two 2BHK units available in Royal Residency matching your budget of ₹60 Lakhs. Can I reserve one for a site visit?',
          reason: 'Budget mentioned needs confirmation',
          priority: 'High',
          confidenceScore: 68,
        },
      ];

      for (const m of mockLeads) {
        // Create Lead
        const lead = await prisma.lead.create({
          data: {
            name: m.name,
            phone: m.phone,
            email: m.email,
            sourceId: sourceMap.get(m.source),
            sourceName: m.source,
            project: m.project,
            location: m.location,
            budget: m.budget,
            timeline: m.timeline,
            status: m.status,
            qualificationScore: m.qualificationScore,
            workspaceId: workspace.id,
            assignedSalesUserId: salesUser.id,
          },
        });

        // Create AI Agent
        const aiAgent = await prisma.aIAgent.create({
          data: {
            name: 'Property Advisor Agent',
            industry: 'Real Estate',
            status: 'Running',
          },
        });

        // Create Conversation
        const conv = await prisma.conversation.create({
          data: {
            leadId: lead.id,
            organizationId: 'org_leadpilot_demo',
            isAiAutomated: true,
            status: 'Active',
            pendingAiReply: m.pendingReply,
            lastMessageContent: 'Yes, please share.',
            aiAgentId: aiAgent.id,
          },
        });

        // Create initial WhatsApp messages
        await prisma.message.createMany({
          data: [
            {
              conversationId: conv.id,
              sender: 'LEAD',
              senderName: m.name,
              content: 'Yes, please share.',
              status: 'READ',
              createdAt: new Date(Date.now() - 60000),
            },
          ],
        });

        // Create Human Approval Item
        await prisma.humanApproval.create({
          data: {
            leadId: lead.id,
            conversationId: conv.id,
            pendingReplyText: m.pendingReply,
            reason: m.reason,
            priority: m.priority,
            status: 'Pending',
            confidenceScore: m.confidenceScore,
            organizationId: 'org_leadpilot_demo',
          },
        });

        // Create Activity Logs
        await prisma.activityLog.create({
          data: {
            leadId: lead.id,
            userId: adminUser.id,
            eventType: 'HUMAN_ESCALATION',
            title: 'Human Approval Required',
            description: `AI reply held in queue: ${m.reason}`,
            actorType: 'AI',
          },
        });
      }
      console.log('[Seed] Seeding mock leads completed successfully.');
    }

    console.log('[Seed] PostgreSQL Seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error);
  }
};
export const seedInitialAdminUser = seedInitialData; // Alias for backward compatibility
