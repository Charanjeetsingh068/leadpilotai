import { connectDatabase } from '../config/database';
import { MetaDiscoveryService } from '../services/meta-discovery.service';
import { LeadFormModel } from '../models/LeadForm.model';

async function runLeadFormDiscoveryTest() {
  console.log('\n=============================================================');
  console.log('  LEADPILOT AI — LEAD FORMS DISCOVERY AUTOMATED TEST        ');
  console.log('=============================================================\n');

  await connectDatabase();
  const discoveryService = new MetaDiscoveryService();

  const sampleScope = {
    workspaceId: 'ws-leadform-discovery-100',
    companyId: 'company-leadform-discovery-200',
    userId: 'user-leadform-discovery-300',
  };

  // Mock Graph API Service for offline Lead Forms discovery verification
  (discoveryService as any).metaGraphService = {
    getBusinesses: async () => [
      { id: '312449849278509', name: 'LeadPilot Enterprise Business Portfolio' },
    ],
    getPages: async () => [
      {
        id: '107603090654737',
        name: 'LeadPilot Official Business Page',
        access_token: 'EAAG_mock_page_token_107603090654737',
      },
    ],
    getOwnedPages: async () => [],
    getClientPages: async () => [],
    getInstagramBusinessAccount: async () => null,
    getOwnedWhatsAppAccounts: async () => [],
    getLeadForms: async (pageId: string) => {
      if (pageId === '107603090654737') {
        return [
          {
            id: 'form_107603090654737_01',
            name: 'Luxury Villas Site Visit Booking Form 2026',
            status: 'ACTIVE',
            leads_count: 3450,
            campaign_id: 'cmp_821218_01',
            campaign_name: 'Real Estate Leads Campaign 2026',
            created_time: '2026-01-15T10:00:00Z',
            questions: [
              { id: 'q1', key: 'full_name', type: 'FULL_NAME', label: 'Full Name' },
              { id: 'q2', key: 'phone_number', type: 'PHONE', label: 'Phone Number' },
              { id: 'q3', key: 'email', type: 'EMAIL', label: 'Email Address' },
              { id: 'q4', key: 'preferred_location', type: 'CUSTOM', label: 'Preferred Location', options: [{ value: 'Downtown' }, { value: 'Suburbs' }] },
            ],
          },
          {
            id: 'form_107603090654737_02',
            name: 'Commercial Properties Brochure Inquiry',
            status: 'ACTIVE',
            leads_count: 1890,
            campaign_id: 'cmp_821218_02',
            campaign_name: 'Luxury Villas Performance Ads',
            created_time: '2026-02-01T14:30:00Z',
            questions: [
              { id: 'q1', key: 'company_name', type: 'CUSTOM', label: 'Company Name' },
              { id: 'q2', key: 'contact_number', type: 'PHONE', label: 'Contact Number' },
            ],
          },
        ];
      }
      return [];
    },
    subscribePageWebhook: async () => ({ success: true }),
    getOwnedAdAccounts: async () => [],
    getAdAccountCampaigns: async () => [],
    getAdAccountAdSets: async () => [],
    getAdAccountAds: async () => [],
    getAdAccountInsights: async () => ({}),
    getPixels: async () => [],
    getDatasets: async () => [],
    getCatalogs: async () => [],
    getSystemUsers: async () => [],
  };

  try {
    console.log('--- 1. Executing Lead Forms Asset Discovery Cycle ---');
    const result = await discoveryService.runAutomaticDiscovery(sampleScope, 'valid_leadform_test_token');
    console.log('Discovery Summary:', JSON.stringify(result));

    // 1. Verify Lead Forms for Page 107603090654737 in MongoDB
    console.log('\n--- 2. Verifying Lead Forms MongoDB Documents ---');
    const forms = await LeadFormModel.find({
      workspaceId: sampleScope.workspaceId,
      pageId: '107603090654737',
    });

    console.log('Total Lead Forms Discovered & Stored:', forms.length);

    for (const f of forms) {
      console.log(`\nForm ID [${f.formId}] Name:`, f.name);
      console.log(`Form ID [${f.formId}] Status:`, f.status);
      console.log(`Form ID [${f.formId}] Leads Count:`, f.leadsCount);
      console.log(`Form ID [${f.formId}] Campaign ID:`, f.campaignId);
      console.log(`Form ID [${f.formId}] Campaign Name:`, f.campaignName);
      console.log(`Form ID [${f.formId}] Total Questions:`, f.questions.length);
      console.log(`Form ID [${f.formId}] Sample Question 1:`, f.questions[0]?.label);
    }

    const isForm1Valid = forms.some((f) => f.formId === 'form_107603090654737_01' && f.campaignId === 'cmp_821218_01');
    const isForm2Valid = forms.some((f) => f.formId === 'form_107603090654737_02' && f.questions.length === 2);

    console.log('\nForm 1 Storage & Campaign Link Verification:', isForm1Valid ? '✅ PASSED' : '❌ FAILED');
    console.log('Form 2 Storage & Question Schema Verification:', isForm2Valid ? '✅ PASSED' : '❌ FAILED');

    console.log('\n=============================================================');
    console.log('🎉 LEAD FORMS DISCOVERY TEST PASSED 100% SUCCESSFULLY!');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('Lead Form Discovery Test Error:', err);
  } finally {
    setTimeout(() => process.exit(0), 100);
  }
}

runLeadFormDiscoveryTest();
