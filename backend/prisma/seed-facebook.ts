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
      data: { name: 'Entec Media' },
    });
  }

  let workspace = await prisma.workspace.findFirst({ where: { companyId: company.id } });
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: 'Entec Media Workspace', companyId: company.id },
    });
  }

  let user = await prisma.user.findFirst({ where: { email: 'entecmedia@gmail.com' } });
  if (!user) {
    let role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: 'Super Admin', description: 'System Administrator' } });
    }
    user = await prisma.user.create({
      data: {
        name: 'Entec Media Admin',
        email: 'entecmedia@gmail.com',
        passwordHash: '$2b$10$e7V/7uPqYh...',
        organizationId: company.id,
        companyId: company.id,
        roleId: role.id,
      },
    });
  }

  let humanAgent = await prisma.user.findFirst({ where: { email: 'agent@entecmedia.com' } });
  if (!humanAgent) {
    humanAgent = await prisma.user.create({
      data: {
        name: 'Entec Media Sales Agent',
        email: 'agent@entecmedia.com',
        passwordHash: '$2b$10$e7V/7uPqYh...',
        organizationId: company.id,
        companyId: company.id,
      },
    });
  }

  let aiAgent = await prisma.aIAgent.findFirst({ where: { agentCode: 'ENTEC_AI_01' } });
  if (!aiAgent) {
    aiAgent = await prisma.aIAgent.create({
      data: {
        name: 'Entec Media AI Advisor',
        industry: 'Marketing & Real Estate',
        agentCode: 'ENTEC_AI_01',
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
        accountName: 'Entec Media (Sumit Chaudhary)',
        fbUserId: '28149461204738597',
        fbUserEmail: 'entecmedia@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        accessToken: encryptToken('EAAB_long_lived_user_access_token_entec_media_v23'),
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
  } else {
    await prisma.facebookAccount.update({
      where: { id: fbAccount.id },
      data: {
        accountName: 'Entec Media (Sumit Chaudhary)',
        fbUserEmail: 'entecmedia@gmail.com',
        tokenStatus: 'Active',
      },
    });
  }

  // 3. Facebook Business
  let fbBusiness = await prisma.facebookBusiness.findFirst({ where: { businessId: '1359154526345483' } });
  if (!fbBusiness) {
    fbBusiness = await prisma.facebookBusiness.create({
      data: {
        companyId: company.id,
        workspaceId: workspace.id,
        facebookAccountId: fbAccount.id,
        businessId: '1359154526345483',
        name: 'Infushion Equipment Inc',
        businessName: 'Infushion Equipment Inc',
        verificationStatus: 'VERIFIED',
        isSelected: true,
      },
    });
  }

  // 4. Facebook Pages (9 Real Live Meta Pages from Screenshots)
  const pagesList = [
    { pageId: '1175924892278602', name: 'Infushion Equipment Inc', category: 'Industrial Equipment & Tools', followers: 14, status: 'Active', unread: 12 },
    { pageId: 'page_100square', name: '100square Real Estate', category: 'Real Estate Agency', followers: 8400, status: 'Active', unread: 189 },
    { pageId: 'page_entecmedia', name: 'Entec Media Marketing', category: 'Digital Marketing Agency', followers: 24500, status: 'Active', unread: 324 },
    { pageId: 'page_fashionjunction', name: 'Fashion Junction Store', category: 'Clothing & Apparel', followers: 12100, status: 'Active', unread: 156 },
    { pageId: 'page_gayatriinfra', name: 'Gayatri Infra Developers', category: 'Construction & Infrastructure', followers: 6700, status: 'Active', unread: 98 },
    { pageId: 'page_idm', name: 'IDM - Institute of Digital Marketing', category: 'Education & Training', followers: 18900, status: 'Active', unread: 210 },
    { pageId: 'page_landisa', name: 'Landisa Homestate Pvt Ltd', category: 'Real Estate Developer', followers: 9300, status: 'Active', unread: 142 },
    { pageId: 'page_sumvesting', name: 'SumVesting Financial', category: 'Financial & Investment Advisory', followers: 5600, status: 'Active', unread: 64 },
    { pageId: 'page_vitabiotech', name: 'Vitabiotech Healthcare Pvt Ltd', category: 'Healthcare & Wellness', followers: 11200, status: 'Active', unread: 178 },
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

  const primaryPage = (await prisma.facebookPage.findFirst({ where: { pageId: '1175924892278602' } })) || (await prisma.facebookPage.findFirst());

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

  // 6. Dynamic Meta Lead Ingestion initialized via Meta Discovery & Webhooks (No static seed array)

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
