import { UserModel } from '../models/User.model';
import { LeadModel } from '../models/Lead.model';
import { ConversationModel } from '../models/Conversation.model';
import { MessageModel } from '../models/Message.model';
import { hashPassword } from '../utils/password.utils';
import { LeadSource, LeadStatus } from '../enums/lead.enums';

export const seedInitialAdminUser = async () => {
  try {
    const existingUser = await UserModel.findOne({ email: 'charanjeet.s7730@gmail.com' });
    if (!existingUser) {
      const hashedPassword = await hashPassword('123456');
      await UserModel.create({
        name: 'Charanjeet Singh',
        email: 'charanjeet.s7730@gmail.com',
        passwordHash: hashedPassword,
        role: 'CLIENT_ADMIN',
        organizationId: 'org_leadpilot_demo',
        isActive: true,
      });
      console.log('[Seed] Admin user charanjeet.s7730@gmail.com created successfully.');
    }

    const convCount = await ConversationModel.countDocuments();
    if (convCount === 0) {
      const leadRS = await LeadModel.create({
        name: 'Rohit Sharma',
        phone: '+91 98765 43210',
        email: 'rohit.sharma@example.com',
        source: LeadSource.FACEBOOK_ADS,
        status: LeadStatus.AI_IN_PROGRESS,
        qualificationScore: 85,
        project: 'Sunshine Villas',
        organizationId: 'org_leadpilot_demo',
      });

      const convRS = await ConversationModel.create({
        leadId: leadRS._id,
        organizationId: 'org_leadpilot_demo',
        isAiAutomated: true,
        unreadCount: 0,
        lastMessageContent: 'Yes, please share.',
        lastMessageAt: new Date(),
        assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
        leadSource: 'Facebook Lead',
        status: 'Active',
        aiSummary: {
          intent: 'Buy a 2BHK Apartment',
          budget: '₹50 - ₹70 Lakhs',
          project: 'Sunshine Villas',
          timeline: 'Ready to buy in 1 - 3 months',
          loan: 'Yes, Home Loan Required',
          sentiment: 'Positive',
          leadScore: 85,
          recommendedAction: 'Share matching properties and schedule site visit',
          buyingProbability: '88%',
          confidenceScore: 0.95,
        },
        aiAgent: {
          name: 'Property Advisor Agent',
          industry: 'Real Estate',
          model: 'GPT-4o',
          status: 'Running',
        },
        recentAiActions: [
          { id: '1', action: 'Asked about preferred location', timestamp: '10:26 AM', iconType: 'question' },
          { id: '2', action: 'Shared price range', timestamp: '10:27 AM', iconType: 'document' },
          { id: '3', action: 'Checking availability', timestamp: '10:27 AM', iconType: 'check' },
        ],
      });

      await MessageModel.insertMany([
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'AI',
          senderName: 'LeadPilot AI',
          content: 'Hi Rohit 👋, Thanks for your interest in our projects. I can help you with details, pricing, site visit and more. What type of property are you looking for?',
          status: 'SEEN',
          createdAt: new Date(Date.now() - 300000),
        },
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'LEAD',
          senderName: 'Rohit Sharma',
          content: 'I am looking for a 2BHK in Indore.',
          status: 'SEEN',
          createdAt: new Date(Date.now() - 240000),
        },
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'AI',
          senderName: 'LeadPilot AI',
          content: 'Great choice! We have some excellent 2BHK options in Indore. May I know your preferred location?',
          status: 'SEEN',
          createdAt: new Date(Date.now() - 180000),
        },
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'LEAD',
          senderName: 'Rohit Sharma',
          content: 'Near Vijay Nagar or Scheme 78.',
          status: 'SEEN',
          createdAt: new Date(Date.now() - 120000),
        },
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'AI',
          senderName: 'LeadPilot AI',
          content: 'Sure! We have great options in Vijay Nagar and Scheme 78. Would you like me to share the price range for 2BHK in these areas?',
          status: 'SEEN',
          createdAt: new Date(Date.now() - 60000),
        },
        {
          conversationId: convRS._id,
          leadId: leadRS._id,
          organizationId: 'org_leadpilot_demo',
          sender: 'LEAD',
          senderName: 'Rohit Sharma',
          content: 'Yes, please share.',
          status: 'SEEN',
          createdAt: new Date(),
        },
      ]);

      console.log('[Seed] Seeding conversations completed successfully.');
    }
  } catch (error) {
    console.error('[Seed] Failed to seed initial data:', error);
  }
};
