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
  console.log('Seeding Facebook Integration full production data...');

  // 1. Company, Workspace, User
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

  let user = await prisma.user.findFirst({ where: { email: 'sumit@acmerealestate.com' } });
  if (!user) {
    let role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: 'Super Admin', description: 'System Administrator' } });
    }
    user = await prisma.user.create({
      data: {
        name: 'Sumit Chaudhary',
        email: 'sumit@acmerealestate.com',
        passwordHash: '$2b$10$e7V/7uPqYh...',
        organizationId: company.id,
        companyId: company.id,
        roleId: role.id,
      },
    });
  }

  let humanAgent = await prisma.user.findFirst({ where: { email: 'sales.agent@acmerealestate.com' } });
  if (!humanAgent) {
    humanAgent = await prisma.user.create({
      data: {
        name: 'Human Agent - Sales',
        email: 'sales.agent@acmerealestate.com',
        passwordHash: '$2b$10$e7V/7uPqYh...',
        organizationId: company.id,
        companyId: company.id,
      },
    });
  }

  let aiAgent = await prisma.aIAgent.findFirst({ where: { agentCode: 'PROP_ADVISOR_01' } });
  if (!aiAgent) {
    aiAgent = await prisma.aIAgent.create({
      data: {
        name: 'AI Agent - Real Estate',
        industry: 'Real Estate',
        agentCode: 'PROP_ADVISOR_01',
        workspaceId: workspace.id,
      },
    });
  }

  // 2. Facebook Account
  let fbAccount = await prisma.facebookAccount.findFirst({ where: { fbUserId: '28149461204738597' } });
  if (!fbAccount) {
    fbAccount = await prisma.facebookAccount.create({
      data: {
        companyId: company.id,
        workspaceId: workspace.id,
        userId: user.id,
        accountName: 'Sumit Chaudhary',
        fbUserId: '28149461204738597',
        fbUserEmail: 'sumit@acmerealestate.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        accessToken: encryptToken('EAAB_long_lived_user_access_token_sumit_chaudhary_meta_v23'),
        tokenStatus: 'Active',
        tokenExpiresAt: new Date('2026-11-30T10:00:00Z'),
        createdAt: new Date('2025-05-14T08:10:00Z'),
        scopes: [
          'public_profile',
          'email',
          'business_management',
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_metadata',
          'leads_retrieval',
          'ads_management',
          'ads_read',
        ],
      },
    });
  }

  // 3. Facebook Business
  let fbBusiness = await prisma.facebookBusiness.findFirst({ where: { businessId: 'biz_acme_98765' } });
  if (!fbBusiness) {
    fbBusiness = await prisma.facebookBusiness.create({
      data: {
        companyId: company.id,
        workspaceId: workspace.id,
        facebookAccountId: fbAccount.id,
        businessId: 'biz_acme_98765',
        name: 'Acme Real Estate Business',
        verificationStatus: 'VERIFIED',
      },
    });
  }

  // 4. Facebook Pages (8 Pages matching reference image)
  const pagesList = [
    { pageId: 'page_acme_01', name: 'Acme Real Estate', category: 'Real Estate Company', followers: 13200, status: 'Active', unread: 324 },
    { pageId: 'page_acme_02', name: 'Acme Properties', category: 'Real Estate Agency', followers: 8900, status: 'Active', unread: 189 },
    { pageId: 'page_acme_03', name: 'Acme Luxury Homes', category: 'Property Developer', followers: 15400, status: 'Active', unread: 156 },
    { pageId: 'page_acme_04', name: 'Acme Commercial', category: 'Commercial Real Estate', followers: 6200, status: 'Active', unread: 98 },
    { pageId: 'page_acme_05', name: 'Acme Rentals', category: 'Property Management', followers: 4100, status: 'Active', unread: 76 },
    { pageId: 'page_acme_06', name: 'Acme Plots', category: 'Land & Plots', followers: 5300, status: 'Active', unread: 64 },
    { pageId: 'page_acme_07', name: 'Acme Developers', category: 'Construction & Development', followers: 3700, status: 'Active', unread: 42 },
    { pageId: 'page_acme_08', name: 'Acme Interiors', category: 'Interior Design', followers: 2900, status: 'Inactive', unread: 28 },
  ];

  for (const pageItem of pagesList) {
    const existingP = await prisma.facebookPage.findFirst({ where: { pageId: pageItem.pageId } });
    if (!existingP) {
      await prisma.facebookPage.create({
        data: {
          companyId: company.id,
          workspaceId: workspace.id,
          facebookAccountId: fbAccount.id,
          facebookBusinessId: fbBusiness.id,
          pageId: pageItem.pageId,
          name: pageItem.name,
          category: pageItem.category,
          followersCount: pageItem.followers,
          pictureUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
          accessToken: encryptToken(`EAA_page_token_${pageItem.pageId}`),
          status: pageItem.status,
          webhookStatus: 'Active',
          syncStatus: 'Synced',
          assignedAiAgentId: aiAgent.id,
          ownerName: 'Sumit Chaudhary',
        },
      });
    }
  }

  const primaryPage = await prisma.facebookPage.findFirst({ where: { pageId: 'page_acme_01' } });

  // 5. Lead Forms
  const formsData = [
    { formId: '123456789', name: 'Book Site Visit', campaign: 'Spring Real Estate Expo 2025', leadCount: 142 },
    { formId: '987654321', name: 'Enquiry Form', campaign: 'Luxury Penthouse Launch', leadCount: 110 },
    { formId: '456789123', name: 'Property Details', campaign: 'Commercial Hub Pre-Leasing', leadCount: 54 },
    { formId: '789123456', name: 'Brochure Request', campaign: 'Acme General Campaign', leadCount: 18 },
  ];

  for (const formData of formsData) {
    if (primaryPage) {
      const existingF = await prisma.facebookForm.findFirst({ where: { formId: formData.formId } });
      if (!existingF) {
        await prisma.facebookForm.create({
          data: {
            companyId: company.id,
            workspaceId: workspace.id,
            facebookPageId: primaryPage.id,
            formId: formData.formId,
            name: formData.name,
            campaign: formData.campaign,
            leadCount: formData.leadCount,
            leadsToday: 12,
            leadsTotal: formData.leadCount,
            status: 'Active',
            isActive: true,
            webhookActive: true,
            assignedAiAgentId: aiAgent.id,
            questionsJson: JSON.stringify([
              { id: 'full_name', label: 'Full Name', type: 'FULL_NAME' },
              { id: 'phone_number', label: 'Phone Number', type: 'PHONE' },
              { id: 'email', label: 'Email Address', type: 'EMAIL' },
              { id: 'budget', label: 'Target Budget', type: 'CUSTOM' },
            ]),
          },
        });
      }
    }
  }

  const formSiteVisit = await prisma.facebookForm.findFirst({ where: { formId: '123456789' } });
  const formEnquiry = await prisma.facebookForm.findFirst({ where: { formId: '987654321' } });
  const formDetails = await prisma.facebookForm.findFirst({ where: { formId: '456789123' } });

  // 6. Seed Real Meta Leads (matching screenshot table exactly)
  const leadsData = [
    {
      name: 'Rahul Sharma',
      phone: '9876543210',
      email: 'rahul.sharma@email.com',
      status: 'New',
      form: formSiteVisit,
      createdAt: new Date('2025-05-14T08:10:00Z'),
      assignedSalesUserId: null,
    },
    {
      name: 'Priya Verma',
      phone: '987234567',
      email: 'priya.verma@email.com',
      status: 'Contacted',
      form: formEnquiry,
      createdAt: new Date('2025-05-14T07:58:00Z'),
      assignedSalesUserId: null,
    },
    {
      name: 'Amit Kumar',
      phone: '9812345678',
      email: 'amit.kumar@email.com',
      status: 'Qualified',
      form: formSiteVisit,
      createdAt: new Date('2025-05-14T07:45:00Z'),
      assignedSalesUserId: humanAgent.id,
    },
    {
      name: 'Sunita Kapoor',
      phone: '9898765432',
      email: 'sunita.kapoor@email.com',
      status: 'Converted',
      form: formDetails,
      createdAt: new Date('2025-05-14T07:30:00Z'),
      assignedSalesUserId: humanAgent.id,
    },
    {
      name: 'Vikram Singh',
      phone: '9823456789',
      email: 'vikram.singh@email.com',
      status: 'Spam',
      form: formEnquiry,
      createdAt: new Date('2025-05-14T07:15:00Z'),
      assignedSalesUserId: null,
    },
    {
      name: 'Rohan Gupta',
      phone: '9811223344',
      email: 'rohan.gupta@email.com',
      status: 'New',
      form: formSiteVisit,
      createdAt: new Date('2025-05-14T06:50:00Z'),
      assignedSalesUserId: null,
    },
    {
      name: 'Ananya Roy',
      phone: '9877665544',
      email: 'ananya.roy@email.com',
      status: 'Contacted',
      form: formEnquiry,
      createdAt: new Date('2025-05-14T06:20:00Z'),
      assignedSalesUserId: null,
    },
    {
      name: 'Karan Malhotra',
      phone: '9833445566',
      email: 'karan.m@email.com',
      status: 'Qualified',
      form: formDetails,
      createdAt: new Date('2025-05-14T05:40:00Z'),
      assignedSalesUserId: humanAgent.id,
    },
  ];

  for (const lData of leadsData) {
    const existingL = await prisma.lead.findFirst({ where: { phone: lData.phone } });
    if (!existingL && primaryPage) {
      await prisma.lead.create({
        data: {
          name: lData.name,
          phone: lData.phone,
          email: lData.email,
          status: lData.status.toUpperCase(),
          workspaceId: workspace.id,
          facebookPageId: primaryPage.id,
          facebookFormId: lData.form?.id || null,
          assignedSalesUserId: lData.assignedSalesUserId,
          campaign: 'Spring Real Estate Expo 2025',
          sourceName: 'Facebook Page',
          qualificationScore: 85,
          createdAt: lData.createdAt,
        },
      });
    }
  }

  // 7. Seed Campaigns
  const campaignsList = [
    { campaignId: 'cmp_101', name: 'Spring Real Estate Expo 2025', objective: 'OUTCOME_LEADS', budget: 1200.0, spend: 940.0, reach: 45200, clicks: 3120, ctr: 6.9, leadsCount: 142, cpl: 6.62, status: 'ACTIVE' },
    { campaignId: 'cmp_102', name: 'Luxury Penthouse Launch', objective: 'OUTCOME_LEADS', budget: 2500.0, spend: 1850.0, reach: 89000, clicks: 5400, ctr: 6.1, leadsCount: 210, cpl: 8.81, status: 'ACTIVE' },
    { campaignId: 'cmp_103', name: 'Commercial Hub Pre-Leasing', objective: 'OUTCOME_LEADS', budget: 800.0, spend: 620.0, reach: 28000, clicks: 1890, ctr: 6.75, leadsCount: 84, cpl: 7.38, status: 'ACTIVE' },
  ];

  for (const cmp of campaignsList) {
    if (primaryPage) {
      const existingCmp = await prisma.facebookCampaign.findUnique({ where: { campaignId: cmp.campaignId } });
      if (!existingCmp) {
        await prisma.facebookCampaign.create({
          data: {
            facebookAccountId: fbAccount.id,
            facebookPageId: primaryPage.id,
            campaignId: cmp.campaignId,
            name: cmp.name,
            objective: cmp.objective,
            budget: cmp.budget,
            spend: cmp.spend,
            reach: cmp.reach,
            clicks: cmp.clicks,
            ctr: cmp.ctr,
            leadsCount: cmp.leadsCount,
            cpl: cmp.cpl,
            status: cmp.status,
          },
        });
      }
    }
  }

  // 8. Seed Ads
  const adsList = [
    { adId: 'ad_201', name: '3BHK Luxury Residence Video', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80', spend: 450.0, clicks: 1620, conversions: 68, roas: 4.2, status: 'ACTIVE' },
    { adId: 'ad_202', name: 'Skyline Penthouse Panorama', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80', spend: 620.0, clicks: 2100, conversions: 92, roas: 5.1, status: 'ACTIVE' },
    { adId: 'ad_203', name: 'Commercial Hub Floor Plan', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80', spend: 310.0, clicks: 890, conversions: 34, roas: 3.8, status: 'ACTIVE' },
  ];

  for (const adItem of adsList) {
    if (primaryPage) {
      const existingAd = await prisma.facebookAd.findUnique({ where: { adId: adItem.adId } });
      if (!existingAd) {
        await prisma.facebookAd.create({
          data: {
            facebookAccountId: fbAccount.id,
            facebookPageId: primaryPage.id,
            adId: adItem.adId,
            name: adItem.name,
            imageUrl: adItem.imageUrl,
            spend: adItem.spend,
            clicks: adItem.clicks,
            conversions: adItem.conversions,
            roas: adItem.roas,
            status: adItem.status,
          },
        });
      }
    }
  }

  // 9. Seed Permissions
  const permissionsData = [
    { permission: 'pages_show_list', description: 'View and manage your Facebook Pages', status: 'Granted' },
    { permission: 'pages_read_engagement', description: 'Read content & engagement metrics posted on the Page', status: 'Granted' },
    { permission: 'pages_manage_metadata', description: 'Manage webhooks and metadata for Pages', status: 'Granted' },
    { permission: 'leads_retrieval', description: 'Retrieve and process lead details from leadgen forms', status: 'Granted' },
    { permission: 'business_management', description: 'Manage Business Manager assets and access levels', status: 'Granted' },
  ];

  for (const perm of permissionsData) {
    const existingPerm = await prisma.facebookPermission.findFirst({
      where: { facebookAccountId: fbAccount.id, permission: perm.permission },
    });
    if (!existingPerm) {
      await prisma.facebookPermission.create({
        data: {
          facebookAccountId: fbAccount.id,
          permission: perm.permission,
          description: perm.description,
          status: perm.status,
        },
      });
    }
  }

  console.log('Facebook Integration production data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
