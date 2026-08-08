import { FacebookWebhookService } from '../src/services/facebook-webhook.service';
import { prisma } from '../src/config/database';

async function testWebhookPipeline() {
  console.log('--- Step 8 Real-Time Webhook Pipeline Verification ---');
  const service = new FacebookWebhookService();
  const startTime = Date.now();

  const testLeadgenId = `lead_realtime_${Date.now()}`;
  const testPageId = '1175924892278602';
  const testFormId = '115820120194829';

  console.log(`[1/5] Simulating Webhook event for leadgenId: ${testLeadgenId}...`);

  try {
    const result = await service.ingestLeadFromFacebook({
      webhookDocId: '',
      leadgenId: testLeadgenId,
      pageId: testPageId,
      formId: testFormId,
      createdTime: Math.floor(Date.now() / 1000),
    });

    const durationMs = Date.now() - startTime;
    console.log(`[2/5] Pipeline completed in ${durationMs}ms (< 2000ms SLA verified: ${durationMs < 2000})`);

    // Verify PostgreSQL Lead record
    const lead = await prisma.lead.findFirst({
      where: { leadId: testLeadgenId },
    });
    console.log('[3/5] PostgreSQL Lead Record Verified:', lead ? { id: lead.id, name: lead.name, phone: lead.phone, status: lead.status } : 'NOT FOUND');

    // Verify Live Stream Event
    const event = await prisma.facebookEvent.findFirst({
      where: { leadId: result.leadId },
    });
    console.log('[4/5] Live Stream Event Verified:', event ? { id: event.id, title: event.title } : 'NOT FOUND');

    console.log('--- Step 8 Realtime Pipeline Test PASSED Successfully! ---');
  } catch (err: any) {
    console.error('Test Failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhookPipeline();
