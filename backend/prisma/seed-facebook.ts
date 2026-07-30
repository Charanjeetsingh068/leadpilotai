import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'leadpilot_super_secret_encryption_key_32bytes!!';

function encryptToken(text: string): string {
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function main() {
  console.log('Seeding Facebook Integration initial data...');

  // Ensure default Company, Workspace, User exist
  let company = await prisma.company.findFirst();
  if (!company) {
    company = await prisma.company.create({
      data: { name: 'Acme Real Estate' },
    });
  }

  let workspace = await prisma.workspace.findFirst({ where: { companyId: company.id } });
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: 'Acme Real Estate Workspace', companyId: company.id },
    });
  }

  let user = await prisma.user.findFirst({ where: { email: 'arjun@leadpilot.ai' } });
  if (!user) {
    let role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: 'Super Admin', description: 'System Administrator' } });
    }
    user = await prisma.user.create({
      data: {
        name: 'Arjun Mehta',
        email: 'arjun@leadpilot.ai',
        passwordHash: '$2b$10$e7V/7uPqYh...',
        organizationId: company.id,
        companyId: company.id,
        roleId: role.id,
      },
    });
  }

  // Create additional users for table listing
  let userNeha = await prisma.user.findFirst({ where: { email: 'neha@leadpilot.ai' } });
  if (!userNeha) {
    userNeha = await prisma.user.create({
      data: { name: 'Neha Rathi', email: 'neha@leadpilot.ai', passwordHash: 'hash', organizationId: company.id, companyId: company.id },
    });
  }

  let userRohit = await prisma.user.findFirst({ where: { email: 'rohit@leadpilot.ai' } });
  if (!userRohit) {
    userRohit = await prisma.user.create({
      data: { name: 'Rohit Jain', email: 'rohit@leadpilot.ai', passwordHash: 'hash', organizationId: company.id, companyId: company.id },
    });
  }

  let userPooja = await prisma.user.findFirst({ where: { email: 'pooja@leadpilot.ai' } });
  if (!userPooja) {
    userPooja = await prisma.user.create({
      data: { name: 'Pooja Sharma', email: 'pooja@leadpilot.ai', passwordHash: 'hash', organizationId: company.id, companyId: company.id },
    });
  }

  // Ensure default AI Agent exists
  let aiAgent = await prisma.aIAgent.findFirst({ where: { agentCode: 'PROP_ADVISOR_01' } });
  if (!aiAgent) {
    aiAgent = await prisma.aIAgent.create({
      data: {
        name: 'Property Advisor AI',
        industry: 'Real Estate',
        agentCode: 'PROP_ADVISOR_01',
        workspaceId: workspace.id,
      },
    });
  }

  // Seed Facebook Accounts (Matching Section 2)
  const accountsData = [
    {
      accountName: 'LeadPilot Marketing',
      fbUserId: '123456789012345',
      fbUserEmail: 'marketing@leadpilot.ai',
      userId: user.id,
      tokenStatus: 'Active',
      tokenExpiresAt: new Date('2025-06-20T10:15:00Z'),
    },
    {
      accountName: 'Luxury Homes Ads',
      fbUserId: '234567890123456',
      fbUserEmail: 'ads@luxuryhomes.com',
      userId: userNeha.id,
      tokenStatus: 'Active',
      tokenExpiresAt: new Date('2025-06-22T09:30:00Z'),
    },
    {
      accountName: 'Acme Builders',
      fbUserId: '765432109876543',
      fbUserEmail: 'rohit@acmebuilders.com',
      userId: userRohit.id,
      tokenStatus: 'Active',
      tokenExpiresAt: new Date('2025-06-18T11:45:00Z'),
    },
    {
      accountName: 'Premium Projects',
      fbUserId: '456789012345678',
      fbUserEmail: 'pooja@premiumprojects.com',
      userId: userPooja.id,
      tokenStatus: 'Expired',
      tokenExpiresAt: new Date('2025-05-18T10:00:00Z'),
    },
  ];

  for (const accData of accountsData) {
    const existing = await prisma.facebookAccount.findFirst({ where: { fbUserId: accData.fbUserId } });
    if (!existing) {
      await prisma.facebookAccount.create({
        data: {
          companyId: company.id,
          workspaceId: workspace.id,
          userId: accData.userId,
          accountName: accData.accountName,
          fbUserId: accData.fbUserId,
          fbUserEmail: accData.fbUserEmail,
          accessToken: encryptToken('EAAB_mock_long_lived_token_leadpilot'),
          tokenStatus: accData.tokenStatus,
          tokenExpiresAt: accData.tokenExpiresAt,
          scopes: ['pages_show_list', 'pages_read_engagement', 'leads_retrieval', 'business_management'],
        },
      });
    }
  }

  const primaryAccount = await prisma.facebookAccount.findFirst({ where: { fbUserId: '123456789012345' } });

  if (primaryAccount) {
    // Seed Business Managers (Matching Section 3)
    const businessesData = [
      { businessId: '987654321098765', name: 'LeadPilot Marketing' },
      { businessId: '675543210987654', name: 'Luxury Homes Pvt Ltd' },
      { businessId: '765432109876843', name: 'Acme Builders' },
      { businessId: '654321098765432', name: 'Premium Projects' },
    ];

    for (const bData of businessesData) {
      const existingB = await prisma.facebookBusiness.findFirst({ where: { businessId: bData.businessId } });
      if (!existingB) {
        await prisma.facebookBusiness.create({
          data: {
            companyId: company.id,
            workspaceId: workspace.id,
            facebookAccountId: primaryAccount.id,
            businessId: bData.businessId,
            name: bData.name,
            verificationStatus: 'VERIFIED',
          },
        });
      }
    }

    const businessLeadPilot = await prisma.facebookBusiness.findFirst({ where: { businessId: '987654321098765' } });

    // Seed Connected Pages (Matching Section 4)
    const pagesData = [
      { pageId: '112233445566779', name: 'Luxury Homes', category: 'Real Estate Developer', followers: 98500 },
      { pageId: '223344556677889', name: 'Commercial Offices', category: 'Commercial Real Estate', followers: 67200 },
      { pageId: '334455667788990', name: 'Luxury Villas', category: 'Luxury Living', followers: 124800 },
      { pageId: '445566778899001', name: 'Investment Plots', category: 'Land & Plots', followers: 45600 },
    ];

    for (const pData of pagesData) {
      const existingP = await prisma.facebookPage.findFirst({ where: { pageId: pData.pageId } });
      if (!existingP) {
        await prisma.facebookPage.create({
          data: {
            companyId: company.id,
            workspaceId: workspace.id,
            facebookAccountId: primaryAccount.id,
            facebookBusinessId: businessLeadPilot?.id,
            pageId: pData.pageId,
            name: pData.name,
            category: pData.category,
            followersCount: pData.followers,
            accessToken: encryptToken('EAA_page_token_' + pData.pageId),
            status: 'Active',
            webhookStatus: 'Active',
            assignedAiAgentId: aiAgent.id,
            ownerName: 'LeadPilot Marketing',
          },
        });
      }
    }

    const pageLuxuryVillas = await prisma.facebookPage.findFirst({ where: { pageId: '334455667788990' } });
    const pageLuxuryHomes = await prisma.facebookPage.findFirst({ where: { pageId: '112233445566779' } });
    const pageCommercial = await prisma.facebookPage.findFirst({ where: { pageId: '223344556677889' } });
    const pagePlots = await prisma.facebookPage.findFirst({ where: { pageId: '445566778899001' } });

    // Seed Lead Forms (Matching Section 5)
    const formsData = [
      { formId: 'f_301', name: 'Luxury Villas Form', pageId: pageLuxuryVillas?.id, leads: 1245, active: true, campaign: 'Luxury Villas Launch 2025' },
      { formId: 'f_302', name: 'Site Visit Form', pageId: pageLuxuryHomes?.id, leads: 856, active: true, campaign: 'Site Visit Campaign' },
      { formId: 'f_303', name: 'Commercial Office Form', pageId: pageCommercial?.id, leads: 642, active: true, campaign: 'Commercial Hub 2025' },
      { formId: 'f_304', name: 'Investment Enquiry Form', pageId: pagePlots?.id, leads: 321, active: true, campaign: 'Investment Land 2025' },
      { formId: 'f_305', name: 'Pre Launch Enquiry Form', pageId: pageLuxuryHomes?.id, leads: 98, active: false, campaign: 'Pre-launch Teaser' },
    ];

    for (const formData of formsData) {
      if (formData.pageId) {
        const existingF = await prisma.facebookForm.findFirst({ where: { formId: formData.formId } });
        if (!existingF) {
          await prisma.facebookForm.create({
            data: {
              companyId: company.id,
              workspaceId: workspace.id,
              facebookPageId: formData.pageId,
              formId: formData.formId,
              name: formData.name,
              campaign: formData.campaign,
              leadCount: formData.leads,
              status: formData.active ? 'Active' : 'Inactive',
              isActive: formData.active,
              assignedAiAgentId: aiAgent.id,
            },
          });
        }
      }
    }

    // Seed Permissions (Matching Section 6)
    const permissionsData = [
      { permission: 'pages_show_list', description: 'View and manage your Pages', status: 'Granted' },
      { permission: 'pages_read_engagement', description: 'Read content posted on the Page', status: 'Granted' },
      { permission: 'leads_retrieval', description: 'Manage and retrieve your leads', status: 'Granted' },
      { permission: 'business_management', description: 'Manage your business', status: 'Granted' },
    ];

    for (const perm of permissionsData) {
      const existingPerm = await prisma.facebookPermission.findFirst({
        where: { facebookAccountId: primaryAccount.id, permission: perm.permission },
      });
      if (!existingPerm) {
        await prisma.facebookPermission.create({
          data: {
            facebookAccountId: primaryAccount.id,
            permission: perm.permission,
            description: perm.description,
            status: perm.status,
          },
        });
      }
    }

    // Seed Webhook Health record (Matching Section 7)
    const existingWebhook = await prisma.facebookWebhook.findFirst({ where: { companyId: company.id } });
    if (!existingWebhook) {
      await prisma.facebookWebhook.create({
        data: {
          companyId: company.id,
          workspaceId: workspace.id,
          webhookUrl: 'https://app.leadpilot.ai/webhooks/facebook',
          verifyToken: 'leadpilot_fb_secret_token_98765',
          status: 'Active',
          successRate7d: 99.2,
          failedEvents7d: 12,
          retryQueueCount: 3,
          deadLetterCount: 0,
        },
      });
    }

    // Seed Live Sync Activity Events (Matching Section 8 Top Right)
    const eventsData = [
      { title: 'New lead received', description: 'Luxury Villas Form • LeadPilot Marketing' },
      { title: 'New lead received', description: 'Investment Enquiry Form • Acme Builders' },
      { title: 'Lead form submitted', description: 'Commercial Office Form • LeadPilot Marketing' },
      { title: 'New lead received', description: 'Luxury Homes Form • Luxury Homes Ads' },
      { title: 'New lead received', description: 'Plots Enquiry Form • Acme Builders' },
    ];

    for (const ev of eventsData) {
      await prisma.facebookEvent.create({
        data: {
          companyId: company.id,
          workspaceId: workspace.id,
          eventType: 'LEAD_IMPORTED',
          title: ev.title,
          description: ev.description,
          status: 'SUCCESS',
        },
      });
    }
  }

  console.log('Facebook Integration initial data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
