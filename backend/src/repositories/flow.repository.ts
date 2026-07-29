import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FlowRepository {
  async getFlow(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      where.aiAgentId = agentId;
    }

    let flow = await prisma.qualificationFlow.findFirst({
      where,
      include: {
        nodes: true,
        edges: true,
        versions: { orderBy: { createdAt: 'desc' } },
        questions: true,
        scoreRules: true,
        actions: true,
      },
    });

    if (!flow) {
      const defaultAgent = agentId && agentId.length === 36 ? await prisma.aIAgent.findUnique({ where: { id: agentId } }) : await prisma.aIAgent.findFirst();
      
      flow = await prisma.qualificationFlow.create({
        data: {
          name: `${defaultAgent?.name || 'Property Advisor'} Qualification Flow`,
          description: 'Design the conversation flow to qualify leads and capture the right information.',
          status: 'Published',
          lastPublishedAt: new Date(),
          aiAgentId: defaultAgent?.id || null,
        },
        include: {
          nodes: true,
          edges: true,
          versions: true,
          questions: true,
          scoreRules: true,
          actions: true,
        },
      });

      // Seed Initial Default Flow Nodes matching reference UI
      const initialNodes = [
        { nodeId: 'node-start', type: 'Start', label: 'Start', subtitle: 'Conversation Start', posX: 400, posY: 40, qualificationFlowId: flow.id },
        { nodeId: 'node-welcome', type: 'SendMessage', label: 'Send Message', subtitle: 'Welcome Message: Hello {{lead_name}} 👋', posX: 400, posY: 140, qualificationFlowId: flow.id },
        { nodeId: 'node-budget-q', type: 'AskQuestion', label: 'Ask Question', subtitle: 'What is your budget range?', posX: 400, posY: 240, qualificationFlowId: flow.id },
        // Conditions
        { nodeId: 'cond-50l', type: 'Condition', label: 'Condition', subtitle: '₹50 Lakh or less', posX: 150, posY: 360, qualificationFlowId: flow.id },
        { nodeId: 'cond-1cr', type: 'Condition', label: 'Condition', subtitle: '₹50 Lakh - ₹1 Cr', posX: 320, posY: 360, qualificationFlowId: flow.id },
        { nodeId: 'cond-2cr', type: 'Condition', label: 'Condition', subtitle: '₹1 Cr - ₹2 Cr', posX: 490, posY: 360, qualificationFlowId: flow.id },
        { nodeId: 'cond-above2cr', type: 'Condition', label: 'Condition', subtitle: 'Above ₹2 Cr', posX: 660, posY: 360, qualificationFlowId: flow.id },
        // Downstream Questions
        { nodeId: 'q-loc', type: 'AskQuestion', label: 'Ask Question', subtitle: 'Preferred location?', posX: 150, posY: 480, qualificationFlowId: flow.id },
        { nodeId: 'q-prop-type', type: 'AskQuestion', label: 'Ask Question', subtitle: 'Type of property?', posX: 320, posY: 480, qualificationFlowId: flow.id },
        { nodeId: 'q-timeline', type: 'AskQuestion', label: 'Ask Question', subtitle: 'When are you planning to buy?', posX: 490, posY: 480, qualificationFlowId: flow.id },
        { nodeId: 'q-amenities', type: 'AskQuestion', label: 'Ask Question', subtitle: 'Are you looking for premium amenities?', posX: 660, posY: 480, qualificationFlowId: flow.id },
        // Action Nodes
        { nodeId: 'node-update-field', type: 'UpdateLead', label: 'Update Lead Field', subtitle: 'Update Budget & Preferences', posX: 400, posY: 600, qualificationFlowId: flow.id },
        { nodeId: 'node-add-tag', type: 'AddTag', label: 'Add Tag', subtitle: 'Add Qualified Lead Tag', posX: 400, posY: 690, qualificationFlowId: flow.id },
        { nodeId: 'node-trigger-auto', type: 'TriggerAutomation', label: 'Trigger Automation', subtitle: 'Send Brochure & Pricelist', posX: 400, posY: 780, qualificationFlowId: flow.id },
        { nodeId: 'node-end', type: 'EndFlow', label: 'End Flow', subtitle: 'Thank You Message', posX: 400, posY: 870, qualificationFlowId: flow.id },
      ];

      for (const n of initialNodes) {
        await prisma.flowNode.create({ data: n });
      }

      // Initial Version
      await prisma.flowVersion.create({
        data: {
          version: 'v1.2.0',
          status: 'Published',
          qualificationFlowId: flow.id,
          publishedBy: 'Arjun Mehta',
        },
      });

      flow = await prisma.qualificationFlow.findFirst({
        where: { id: flow.id },
        include: {
          nodes: true,
          edges: true,
          versions: { orderBy: { createdAt: 'desc' } },
          questions: true,
          scoreRules: true,
          actions: true,
        },
      });
    }

    return flow;
  }

  async updateFlowNodes(flowId: string, nodes: any[], edges?: any[]) {
    if (!flowId || flowId.length !== 36) return null;

    // Replace nodes
    await prisma.flowNode.deleteMany({ where: { qualificationFlowId: flowId } });
    for (const n of nodes) {
      await prisma.flowNode.create({
        data: {
          nodeId: n.nodeId || n.id,
          type: n.type || 'AskQuestion',
          label: n.label || 'Node',
          subtitle: n.subtitle || '',
          posX: n.posX ?? n.x ?? 0,
          posY: n.posY ?? n.y ?? 0,
          config: JSON.stringify(n.config || {}),
          qualificationFlowId: flowId,
        },
      });
    }

    if (edges && Array.isArray(edges)) {
      await prisma.flowEdge.deleteMany({ where: { qualificationFlowId: flowId } });
      for (const e of edges) {
        await prisma.flowEdge.create({
          data: {
            edgeId: e.edgeId || e.id,
            sourceNodeId: e.sourceNodeId || e.source,
            targetNodeId: e.targetNodeId || e.target,
            label: e.label || '',
            qualificationFlowId: flowId,
          },
        });
      }
    }

    return prisma.qualificationFlow.findUnique({
      where: { id: flowId },
      include: { nodes: true, edges: true, versions: true },
    });
  }

  async publishFlow(flowId: string) {
    if (!flowId || flowId.length !== 36) return null;
    const flow = await prisma.qualificationFlow.findUnique({
      where: { id: flowId },
      include: { nodes: true, edges: true },
    });
    if (!flow) return null;

    const newVersionStr = `v1.${(await prisma.flowVersion.count({ where: { qualificationFlowId: flowId } })) + 2}.0`;

    await prisma.flowVersion.create({
      data: {
        version: newVersionStr,
        status: 'Published',
        publishedBy: 'Arjun Mehta',
        snapshotJson: JSON.stringify(flow),
        qualificationFlowId: flowId,
      },
    });

    return prisma.qualificationFlow.update({
      where: { id: flowId },
      data: {
        status: 'Published',
        lastPublishedAt: new Date(),
      },
      include: { nodes: true, edges: true, versions: true },
    });
  }

  async getExecutionHistory(flowId: string) {
    const where: any = {};
    if (flowId && flowId.length === 36) {
      where.qualificationFlowId = flowId;
    }
    const count = await prisma.flowExecutionHistory.count({ where });
    if (count === 0) {
      const defaultFlow = await prisma.qualificationFlow.findFirst();
      if (defaultFlow) {
        await prisma.flowExecutionHistory.create({
          data: {
            leadName: 'Rahul Sharma',
            nodeExecuted: 'Ask Question: What is your budget range?',
            scoreAssigned: 15,
            qualificationFlowId: defaultFlow.id,
          },
        });
        await prisma.flowExecutionHistory.create({
          data: {
            leadName: 'Priya Patel',
            nodeExecuted: 'Trigger Automation: Send Brochure & Pricelist',
            scoreAssigned: 30,
            qualificationFlowId: defaultFlow.id,
          },
        });
      }
    }
    return prisma.flowExecutionHistory.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take: 20,
    });
  }

  // Questions Tab
  async getQuestions(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const flow = await prisma.qualificationFlow.findFirst({ where: { aiAgentId: agentId } });
      if (flow) where.qualificationFlowId = flow.id;
    }
    const count = await prisma.flowQuestion.count({ where });
    if (count === 0) {
      const flow = await prisma.qualificationFlow.findFirst();
      if (flow) {
        const initialQuestions = [
          { questionText: 'What is your budget range?', questionType: 'Single Choice', saveAnswerTo: 'Budget Range', scoreImpact: 10, qualificationFlowId: flow.id },
          { questionText: 'Preferred location for purchase?', questionType: 'Single Choice', saveAnswerTo: 'Location Preference', scoreImpact: 15, qualificationFlowId: flow.id },
          { questionText: 'Type of property desired?', questionType: 'Single Choice', saveAnswerTo: 'Property Type', scoreImpact: 10, qualificationFlowId: flow.id },
          { questionText: 'When are you planning to buy?', questionType: 'Single Choice', saveAnswerTo: 'Buying Timeline', scoreImpact: 20, qualificationFlowId: flow.id },
        ];
        for (const q of initialQuestions) {
          await prisma.flowQuestion.create({ data: q });
        }
      }
    }
    return prisma.flowQuestion.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createQuestion(data: any) {
    let flowId = data.qualificationFlowId;
    if (!flowId && data.agentId && data.agentId.length === 36) {
      const flow = await prisma.qualificationFlow.findFirst({ where: { aiAgentId: data.agentId } });
      if (flow) flowId = flow.id;
    }
    if (!flowId) {
      const defaultFlow = await prisma.qualificationFlow.findFirst();
      flowId = defaultFlow?.id;
    }
    if (!flowId) return null;

    return prisma.flowQuestion.create({
      data: {
        questionText: data.questionText,
        questionType: data.questionType || 'Single Choice',
        saveAnswerTo: data.saveAnswerTo || 'General',
        scoreImpact: data.scoreImpact ? Number(data.scoreImpact) : 10,
        options: JSON.stringify(data.options || []),
        qualificationFlowId: flowId,
      },
    });
  }

  async deleteQuestion(id: string) {
    if (!id || id.length !== 36) return false;
    await prisma.flowQuestion.delete({ where: { id } });
    return true;
  }

  // Lead Scoring Tab
  async getScoreRules(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const flow = await prisma.qualificationFlow.findFirst({ where: { aiAgentId: agentId } });
      if (flow) where.qualificationFlowId = flow.id;
    }
    const count = await prisma.flowScoreRule.count({ where });
    if (count === 0) {
      const flow = await prisma.qualificationFlow.findFirst();
      if (flow) {
        const initialRules = [
          { conditionText: 'Budget > ₹1 Crore', points: 20, category: 'Budget', qualificationFlowId: flow.id },
          { conditionText: 'Ready to buy in 30 Days', points: 15, category: 'Timeline', qualificationFlowId: flow.id },
          { conditionText: 'Home Loan Pre-approved', points: 10, category: 'Finance', qualificationFlowId: flow.id },
          { conditionText: 'Visited Site Office', points: 30, category: 'Engagement', qualificationFlowId: flow.id },
        ];
        for (const r of initialRules) {
          await prisma.flowScoreRule.create({ data: r });
        }
      }
    }
    return prisma.flowScoreRule.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // Conditions Tab
  async getConditions(agentId?: string) {
    return [
      { id: 'cond-1', field: 'Budget Range', operator: 'Equals', value: 'Above ₹2 Cr', status: 'Active' },
      { id: 'cond-2', field: 'Location Preference', operator: 'Contains', value: 'Golf Course Road', status: 'Active' },
      { id: 'cond-3', field: 'Timeline', operator: 'Equals', value: 'Immediate (15 Days)', status: 'Active' },
      { id: 'cond-4', field: 'Lead Score', operator: 'Greater Than', value: '60 Points', status: 'Active' },
    ];
  }

  // Automations Tab
  async getAutomations(agentId?: string) {
    return [
      { id: 'auto-1', trigger: 'Lead Score > 70', action: 'Assign Senior Property Consultant', channel: 'CRM', status: 'Active' },
      { id: 'auto-2', trigger: 'Budget Mentioned > ₹1 Cr', action: 'Send 3D Floor Plan & PDF Brochure', channel: 'WhatsApp', status: 'Active' },
      { id: 'auto-3', trigger: 'Site Visit Requested', action: 'Notify Admin & Create Calendar Event', channel: 'Email', status: 'Active' },
      { id: 'auto-4', trigger: 'Negative Sentiment', action: 'Pause AI & Transfer to Human Supervisor', channel: 'Escalation', status: 'Active' },
    ];
  }

  // Settings Tab
  async getSettings(agentId?: string) {
    return {
      defaultLanguage: 'English (India)',
      fallbackLanguage: 'Hindi',
      timeoutSeconds: 300,
      maxRetries: 3,
      typingDelay: 'Natural (1.5s - 3s)',
      businessHours: '09:00 AM - 08:00 PM',
      autoQualification: true,
      maxQuestions: 5,
      minQualificationScore: 50,
      aiConfidenceThreshold: 80,
    };
  }
}
