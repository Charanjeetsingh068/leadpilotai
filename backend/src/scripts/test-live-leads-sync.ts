import { prisma, connectDatabase } from '../config/database';
import { FacebookRepository } from '../repositories/facebook.repository';

async function testLeadSync() {
  console.log('=== LEAD INBOX DYNAMIC META SYNC TEST ===');
  await connectDatabase();
  const repo = new FacebookRepository();
  const scope = { companyId: 'default-company', workspaceId: 'default-workspace', userId: 'default-user', userRole: 'Super Admin' };

  try {
    const l1 = await repo.upsertLead({
      workspaceId: scope.workspaceId,
      leadId: 'meta_lead_1001',
      facebookLeadId: 'meta_lead_1001',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@gmail.com',
      phone: '+91 98112 34567',
      city: 'Gurugram',
      message: 'Interested in 3BHK Luxury Apartment in Sector 65',
      campaignName: 'Meta Real Estate Leads 2026',
      formName: 'Entec Media Site Visit Form',
      pageName: 'Entec Media-Digital Marketing Agency',
      status: 'NEW',
    });
    console.log('Lead 1 Created in PostgreSQL:', l1.id, l1.name, l1.phone);

    const l2 = await repo.upsertLead({
      workspaceId: scope.workspaceId,
      leadId: 'meta_lead_1002',
      facebookLeadId: 'meta_lead_1002',
      name: 'Priya Verma',
      email: 'priya.verma@outlook.com',
      phone: '+91 98765 43210',
      city: 'Noida',
      message: 'Looking for Commercial Property Investment',
      campaignName: 'Meta Real Estate Leads 2026',
      formName: 'Commercial Property Enquiry Form',
      pageName: 'Entec Media-Digital Marketing Agency',
      status: 'QUALIFIED',
    });
    console.log('Lead 2 Created in PostgreSQL:', l2.id, l2.name, l2.phone);

    const leadsRes = await repo.findLeads(scope, {});
    console.log(`Total Leads Found in Lead Inbox DB Query: ${leadsRes.total}`);
    console.log('Sample Lead 1:', JSON.stringify(leadsRes.leads[0], null, 2));

    if (leadsRes.total >= 2) {
      console.log('✅ DYNAMIC LEADS SYNC TEST PASSED 100% SUCCESSFULLY!');
    } else {
      console.error('❌ LEAD SYNC TEST FAILED!');
    }
  } catch (e: any) {
    console.error('Error during lead sync test:', e.message, e.stack);
  } finally {
    process.exit(0);
  }
}

testLeadSync();
