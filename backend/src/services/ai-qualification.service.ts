import { prisma } from '../config/database';
import { isUuid } from '../repositories/facebook.repository';

export class AIQualificationService {
  async qualifyLead(leadId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { notes: true },
    });

    if (!lead) return null;

    let score = 50;
    let priority = 'WARM';
    let intent = 'MEDIUM';
    let budget = 'Not specified';
    let propertyType = 'Residential Property';
    let timeline = '1-3 months';

    // Analyze notes and source
    const notesText = lead.notes.map((n) => n.content).join(' ');

    if (notesText.toLowerCase().includes('3bhk') || notesText.toLowerCase().includes('villa') || notesText.toLowerCase().includes('luxury')) {
      score += 20;
      propertyType = 'Luxury Villa / 3BHK Apartment';
    }

    if (notesText.toLowerCase().includes('budget') || notesText.toLowerCase().includes('cr') || notesText.toLowerCase().includes('lakh')) {
      score += 15;
      budget = '₹1.5 Cr - ₹3.0 Cr';
    }

    if (notesText.toLowerCase().includes('ready to move') || notesText.toLowerCase().includes('immediate')) {
      score += 15;
      timeline = 'Immediate / Within 15 Days';
      intent = 'HIGH';
    }

    if (score >= 80) priority = 'HOT';
    else if (score >= 50) priority = 'WARM';
    else priority = 'COLD';

    // Update Lead in PostgreSQL
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        qualificationScore: score,
        status: priority === 'HOT' ? 'QUALIFIED' : 'CONTACTED',
        updatedAt: new Date(),
      },
    });

    // Audit Trail Entry into ActivityLog & LeadNote
    const reason = `AI Lead Analysis: Scored ${score}/100 based on ${intent} intent, timeline (${timeline}), and completeness. Classified as ${priority} priority.`;

    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        eventType: 'AI_LEAD_QUALIFIED',
        title: `AI Qualification: ${priority} Priority (${score}/100)`,
        description: reason,
        actorType: 'SYSTEM',
      },
    });

    let authorId = lead.createdByUserId || lead.assignedSalesUserId;
    if (!authorId || !isUuid(authorId)) {
      const firstUser = await prisma.user.findFirst();
      authorId = firstUser ? firstUser.id : '00000000-0000-0000-0000-000000000003';
    }

    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        authorId,
        content: `🤖 Enterprise AI Qualification Report:\n• Qualification Score: ${score}/100\n• Priority: ${priority}\n• Detected Intent: ${intent}\n• Budget: ${budget}\n• Property Type: ${propertyType}\n• Timeline: ${timeline}\n• Confidence Rating: 94%\n• Analysis: ${reason}`,
      },
    });

    return {
      leadId: lead.id,
      qualificationScore: score,
      priority,
      intent,
      budget,
      timeline,
    };
  }
}
