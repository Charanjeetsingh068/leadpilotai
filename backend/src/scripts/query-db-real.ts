import { prisma } from '../config/database';

async function runRealDbAudit() {
  console.log('=== REAL POSTGRESQL DATABASE & META GRAPH API AUDIT ===\n');

  try {
    await prisma.$connect();
    console.log('[PostgreSQL] Connected successfully.\n');

    // 1. SELECT COUNT(*) queries
    const accCount = await prisma.facebookAccount.count();
    const busCount = await prisma.facebookBusiness.count();
    const pageCount = await prisma.facebookPage.count();
    const formCount = await prisma.facebookForm.count();
    const permCount = await prisma.facebookPermission.count();
    const hookCount = await prisma.facebookWebhook.count();

    console.log('--- EXACT TABLE ROW COUNTS ---');
    console.log(`SELECT COUNT(*) FROM facebook_accounts;     => ${accCount}`);
    console.log(`SELECT COUNT(*) FROM facebook_businesses;   => ${busCount}`);
    console.log(`SELECT COUNT(*) FROM facebook_pages;        => ${pageCount}`);
    console.log(`SELECT COUNT(*) FROM facebook_forms;        => ${formCount}`);
    console.log(`SELECT COUNT(*) FROM facebook_permissions;  => ${permCount}`);
    console.log(`SELECT COUNT(*) FROM facebook_webhooks;     => ${hookCount}`);
    console.log('------------------------------------\n');

    // 2. SELECT * LIMIT 5 queries
    console.log('--- SELECT * FROM facebook_pages LIMIT 5; ---');
    const pages = await prisma.facebookPage.findMany({ take: 5 });
    console.log(JSON.stringify(pages, null, 2));
    console.log('');

    console.log('--- SELECT * FROM facebook_forms LIMIT 5; ---');
    const forms = await prisma.facebookForm.findMany({ take: 5 });
    console.log(JSON.stringify(forms, null, 2));
    console.log('');

    // 3. Test Direct Real Meta Graph API Request for App 1712255293083461
    const appId = process.env.FACEBOOK_APP_ID || '1712255293083461';
    const appSecret = process.env.FACEBOOK_APP_SECRET || 'fadc1ae30941d9573ec85c9fe27dc784';
    
    console.log(`--- DIRECT META GRAPH API REQUEST FOR APP ${appId} ---`);
    const graphUrl = `https://graph.facebook.com/v19.0/${appId}?access_token=${appId}|${appSecret}&fields=id,name,link,category`;
    console.log(`Request URL: ${graphUrl}`);

    try {
      const graphRes = await globalThis.fetch(graphUrl);
      const graphStatus = graphRes.status;
      const graphJson = await graphRes.json();

      console.log(`HTTP Status: ${graphStatus}`);
      console.log('Raw Meta Graph API Response:');
      console.log(JSON.stringify(graphJson, null, 2));
    } catch (graphErr: any) {
      console.error('Meta Graph API Network Request Error:', graphErr.message);
    }

  } catch (dbErr: any) {
    console.error('[PostgreSQL Error]:', dbErr.message);
    console.log('\n[Explanation of Database Connection State]');
    console.log('If PostgreSQL is not currently running locally or DATABASE_URL in .env points to an offline instance, tables will appear unpopulated until PostgreSQL daemon is running and an active OAuth session is granted by a real Facebook user.');
  } finally {
    await prisma.$disconnect();
  }
}

runRealDbAudit();
