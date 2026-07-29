import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';

export class TestingRepository {

  private async resolveAgentId(agentId?: string): Promise<string | null> {
    if (agentId && agentId.length === 36) {
      const agent = await prisma.aIAgent.findUnique({ where: { id: agentId } });
      if (agent) return agent.id;
    }
    const defaultAgent = await prisma.aIAgent.findFirst();
    return defaultAgent?.id || null;
  }

  // ==========================================
  // 1. SCENARIOS & LANGUAGES
  // ==========================================
  async getScenarios() {
    const count = await prisma.aITestingScenario.count();
    if (count === 0) {
      const initialScenarios = [
        {
          name: 'Real Estate - General Inquiry',
          category: 'Real Estate',
          description: 'Simulate lead asking for 2BHK/3BHK configuration, location details & overview.',
          promptsJson: JSON.stringify([
            'I am looking for a 2BHK flat in Wakad.',
            'What is the price range of your projects?',
            'Do you have any projects near Hinjewadi?',
            'Tell me about amenities in your project.',
            'What is the possession time?',
            'Can I get a site visit this weekend?',
            'Do you provide home loan assistance?',
            'What is the booking amount?',
          ]),
        },
        {
          name: 'Site Visit Booking Request',
          category: 'Real Estate',
          description: 'Lead looking to visit project site on upcoming weekend.',
          promptsJson: JSON.stringify([
            'Can I visit the property this Saturday at 4 PM?',
            'Where is the exact location of the site sales office?',
            'Will sales executive be available for site tour?',
          ]),
        },
        {
          name: 'Pricing & Payment Schedule',
          category: 'Financial',
          description: 'Lead asking for price breakdown, down payment and bank loan offers.',
          promptsJson: JSON.stringify([
            'Share the cost sheet for 2BHK luxury unit.',
            'What is the slab-wise construction payment plan?',
            'Which banks are offering home loans with zero processing fee?',
          ]),
        },
      ];
      for (const s of initialScenarios) {
        await prisma.aITestingScenario.create({ data: s });
      }
    }
    return prisma.aITestingScenario.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async getLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'hinglish', name: 'Hinglish' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ];
  }

  // ==========================================
  // 2. SESSION MANAGEMENT
  // ==========================================
  async startSession(data: any): Promise<any> {

    const resolvedId = await this.resolveAgentId(data.agentId || data.aiAgentId);
    const sessionNum = Math.floor(1000 + Math.random() * 9000);
    const sessionIdStr = `TEST-${sessionNum}`;

    const session = await prisma.aITestingSession.create({
      data: {
        sessionId: sessionIdStr,
        aiAgentId: resolvedId,
        knowledgeBaseId: data.knowledgeBaseId || null,
        flowId: data.flowId || null,
        scenario: data.scenario || 'Real Estate - General Inquiry',
        language: data.language || 'English',
        mode: data.mode || 'Chat',
        status: 'Active',
        createdBy: data.createdBy || 'Arjun Mehta',
        workspaceId: data.workspaceId || null,
        companyId: data.companyId || null,
      },
    });

    // Seed initial demo message exchange if new session
    await prisma.aITestingMessage.create({
      data: {
        sessionId: session.id,
        sender: 'user',
        senderName: 'Customer (You)',
        message: 'I am looking for a 2BHK flat in Wakad.',
      },
    });

    await prisma.aITestingMessage.create({
      data: {
        sessionId: session.id,
        sender: 'agent',
        senderName: 'AI Agent',
        message: 'Great choice! We have several excellent 2BHK options in Wakad.\n\nHere are some details:\n• Project: Sunrise Residency\n• Configuration: 2BHK\n• Carpet Area: 720 - 780 sq.ft.\n• Price Range: ₹68 Lakh - ₹75 Lakh*\n• Possession: Dec 2026\n• Highlights: 15+ Amenities, Near Hinjewadi IT Park, Excellent Connectivity\n\nWould you like me to share more details or schedule a site visit for you?',
        intent: 'Property Inquiry',
        entities: JSON.stringify(['2BHK', 'Wakad', 'Sunrise Residency', 'Price Range', 'Amenities', 'Possession Dec 2026']),
        knowledgeUsed: JSON.stringify([
          { name: 'Sunrise Residency Brochure.pdf', similarity: 87 },
          { name: 'Wakad Project Price List.xlsx', similarity: 74 },
          { name: 'Amenities & Features.pdf', similarity: 62 },
        ]),
        leadScore: 85,
        confidenceScore: 92.0,
        knowledgeMatch: 91.0,
        promptTokens: 320,
        completionTokens: 192,
        totalTokens: 512,
        responseTimeMs: 2300,
        recommendedNextAction: 'Suggest site visit and share payment plan.',
        conversationStage: 'Proposal',
      },
    });

    return this.getSession(session.id);
  }

  async getSession(id: string): Promise<any> {

    if (!id) throw new ApiError(400, 'Session ID is required');
    let session = await prisma.aITestingSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        metrics: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!session && id.startsWith('TEST-')) {
      session = await prisma.aITestingSession.findFirst({
        where: { sessionId: id },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          metrics: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });
    }

    if (!session) {
      return this.startSession({ scenario: 'Real Estate - General Inquiry' });
    }

    return session;
  }

  async clearSession(sessionId: string) {
    const session = await this.getSession(sessionId);
    await prisma.aITestingMessage.deleteMany({
      where: { sessionId: session.id },
    });
    return this.startSession({ agentId: session.aiAgentId, scenario: session.scenario, language: session.language });
  }

  // ==========================================
  // 3. SEND MESSAGE & RUN AI PIPELINE
  // ==========================================
  async sendMessage(data: any) {
    const { message, language } = data;
    if (!message || !message.trim()) {
      throw new ApiError(400, 'Message body cannot be empty');
    }

    const session = await this.getSession(data.sessionId);
    const resolvedAgentId = await this.resolveAgentId(data.agentId || session.aiAgentId);
    const agent = resolvedAgentId ? await prisma.aIAgent.findUnique({ where: { id: resolvedAgentId } }) : null;

    // Save Customer Message to PostgreSQL
    await prisma.aITestingMessage.create({
      data: {
        sessionId: session.id,
        sender: 'user',
        senderName: 'Customer (You)',
        message: message.trim(),
      },
    });

    // Run AI Prompt RAG & Pipeline Simulation
    const isAmenitiesInquiry = message.toLowerCase().includes('amenities') || message.toLowerCase().includes('facility');
    const isPriceInquiry = message.toLowerCase().includes('price') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('budget');

    let aiReply = `Thank you for asking! ${agent?.name || 'Property Advisor AI'} is here to help.\n\nRegarding "${message.trim()}", our project offers premium amenities, 24/7 security, lush green gardens, clubhouse, and flexible financing options. Would you like to schedule a site visit this week?`;
    let entities = ['2BHK', 'Wakad', 'Price Range'];
    let knowledgeSources = [
      { name: 'Sunrise Residency Brochure.pdf', similarity: 89 },
      { name: 'Wakad Project Price List.xlsx', similarity: 78 },
      { name: 'Amenities & Features.pdf', similarity: 71 },
    ];
    let leadScore = 88;
    let confidenceScore = 94.0;
    let knowledgeMatch = 92.0;
    let recommendedAction = 'Suggest site visit and share payment plan.';
    let conversationStage = 'Proposal';

    if (isAmenitiesInquiry) {
      aiReply = `Sunrise Residency comes with 15+ premium amenities:\n\n✔ Clubhouse   ✔ Swimming Pool   ✔ Gymnasium   ✔ Children Play Area\n✔ Landscaped Garden   ✔ Indoor Games   ✔ 24/7 Security\n✔ Power Backup\n...and many more!`;
      entities = ['Clubhouse', 'Swimming Pool', 'Gymnasium', '24/7 Security', 'Amenities'];
      knowledgeSources = [
        { name: 'Amenities & Features.pdf', similarity: 95 },
        { name: 'Sunrise Residency Brochure.pdf', similarity: 82 },
      ];
      recommendedAction = 'Invite for a weekend site visit to see amenities live.';
      conversationStage = 'Proposal';
    } else if (isPriceInquiry) {
      aiReply = `Our 2BHK luxury apartments start from ₹68 Lakh up to ₹75 Lakh depending on floor selection and carpet size (720 - 780 sq.ft).\n\nWe also have special festive discounts & zero processing fee home loan tie-ups with leading banks.`;
      entities = ['₹68 Lakh - ₹75 Lakh', '720-780 sq.ft', 'Home Loan', 'Discount'];
      knowledgeSources = [
        { name: 'Wakad Project Price List.xlsx', similarity: 96 },
        { name: 'Payment Schedule 2025.pdf', similarity: 84 },
      ];
      leadScore = 92;
      recommendedAction = 'Share detailed PDF price sheet & schedule callback.';
      conversationStage = 'Negotiation';
    }

    const promptTokens = Math.floor(Math.random() * 100) + 300;
    const completionTokens = Math.floor(Math.random() * 80) + 150;
    const totalTokens = promptTokens + completionTokens;
    const responseTimeMs = Math.floor(Math.random() * 800) + 1800;

    // Save AI Agent Message to PostgreSQL
    const aiMessage = await prisma.aITestingMessage.create({
      data: {
        sessionId: session.id,
        sender: 'agent',
        senderName: 'AI Agent',
        message: aiReply,
        intent: isAmenitiesInquiry ? 'Amenities Inquiry' : isPriceInquiry ? 'Price & Payment Inquiry' : 'General Property Inquiry',
        entities: JSON.stringify(entities),
        knowledgeUsed: JSON.stringify(knowledgeSources),
        promptTokens,
        completionTokens,
        totalTokens,
        responseTimeMs,
        confidenceScore,
        knowledgeMatch,
        leadScore,
        recommendedNextAction: recommendedAction,
        conversationStage,
      },
    });

    // Save Metric Snapshot
    await prisma.aITestingMetric.create({
      data: {
        sessionId: session.id,
        leadScore,
        confidenceScore,
        responseTimeSec: parseFloat((responseTimeMs / 1000).toFixed(1)),
        totalTokens,
        knowledgeMatchPct: knowledgeMatch,
        intentDetected: aiMessage.intent || 'Property Inquiry',
        entitiesJson: JSON.stringify(entities),
        knowledgeUsedJson: JSON.stringify(knowledgeSources),
        recommendedAction,
        conversationStage,
      },
    });

    return {
      session: await this.getSession(session.id),
      message: aiMessage,
      insights: {
        leadScore,
        confidenceScore,
        responseTimeSec: parseFloat((responseTimeMs / 1000).toFixed(1)),
        totalTokens,
        knowledgeMatchPct: knowledgeMatch,
        intentDetected: aiMessage.intent,
        entities,
        knowledgeSources,
        recommendedAction,
        conversationStage,
      },
    };
  }

  // ==========================================
  // 4. METRICS & HISTORY
  // ==========================================
  async getSessionHistory(agentId?: string) {
    const resolvedId = await this.resolveAgentId(agentId);
    const where: any = resolvedId ? { aiAgentId: resolvedId } : {};

    return prisma.aITestingSession.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: 20,
      include: {
        _count: { select: { messages: true } },
      },
    });
  }

  async getMetrics(sessionId?: string, agentId?: string) {
    if (sessionId) {
      const metric = await prisma.aITestingMetric.findFirst({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
      });
      if (metric) return metric;
    }

    return {
      leadScore: 85,
      confidenceScore: 92.0,
      responseTimeSec: 2.3,
      totalTokens: 512,
      knowledgeMatchPct: 91.0,
      intentDetected: 'Property Inquiry',
      entitiesJson: JSON.stringify(['2BHK', 'Wakad', 'Sunrise Residency', 'Price Range', 'Amenities', 'Possession Dec 2026']),
      knowledgeUsedJson: JSON.stringify([
        { name: 'Sunrise Residency Brochure.pdf', similarity: 87 },
        { name: 'Wakad Project Price List.xlsx', similarity: 74 },
        { name: 'Amenities & Features.pdf', similarity: 62 },
      ]),
      recommendedAction: 'Suggest site visit and share payment plan.',
      conversationStage: 'Proposal',
    };
  }
}
