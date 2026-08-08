import { createApp } from '../app';
import { connectDatabase } from '../config/database';

async function runMetaLoginTest() {
  console.log('\n=============================================================');
  console.log('  LEADPILOT AI — GET /api/meta/login ENDPOINT AUTOMATED TEST   ');
  console.log('=============================================================\n');

  await connectDatabase();
  const app = createApp();

  const server = app.listen(5098, async () => {
    console.log('[Test Server] Listening on http://localhost:5098');

    try {
      console.log('\n--- 1. Testing GET /api/meta/login ---');
      const res = await fetch('http://localhost:5098/api/meta/login?workspaceId=workspace-uuid-100');
      const data = await res.json();

      console.log('HTTP Status:', res.status);
      console.log('App ID:', data.data?.appId);
      console.log('Config ID:', data.data?.configId);
      console.log('Graph API Version:', data.data?.graphVersion);
      console.log('Generated PKCE Code Verifier:', data.data?.codeVerifier);
      console.log('Generated PKCE Code Challenge:', data.data?.codeChallenge);
      console.log('Generated State Payload:', data.data?.state);
      console.log('\nGenerated Facebook Login for Business URL:');
      console.log(data.data?.loginUrl);

      const loginUrl = data.data?.loginUrl || '';

      const hasV23 = loginUrl.includes('v23.0');
      const hasAppId = loginUrl.includes('client_id=1712255293083461');
      const hasConfigId = loginUrl.includes('config_id=937320012719440') || loginUrl.includes('config_id=META_LOGIN_CONFIG_ID');
      const hasPkce = loginUrl.includes('code_challenge=') && loginUrl.includes('code_challenge_method=S256');
      const hasState = loginUrl.includes('state=');
      const hasNoScope = !loginUrl.includes('scope=');

      console.log('\n--- Verification Assertions ---');
      console.log('Graph API v23.0 in URL:', hasV23 ? '✅ YES' : '❌ NO');
      console.log('App ID 1712255293083461 in URL:', hasAppId ? '✅ YES' : '❌ NO');
      console.log('Config ID in URL:', hasConfigId ? '✅ YES' : '❌ NO');
      console.log('PKCE Parameters (S256) in URL:', hasPkce ? '✅ YES' : '❌ NO');
      console.log('CSRF State in URL:', hasState ? '✅ YES' : '❌ NO');
      console.log('NO Scope Parameter in URL:', hasNoScope ? '✅ YES (Zero Legacy Scope Parameter)' : '❌ NO');

      if (res.status === 200 && hasV23 && hasAppId && hasConfigId && hasPkce && hasState && hasNoScope) {
        console.log('\n=============================================================');
        console.log('🎉 GET /api/meta/login ENDPOINT TEST PASSED 100% SUCCESSFULLY!');
        console.log('=============================================================\n');
      } else {
        console.error('❌ GET /api/meta/login TEST FAILED!');
      }
    } catch (err) {
      console.error('Test Error:', err);
    } finally {
      server.close(() => {
        setTimeout(() => process.exit(0), 100);
      });
    }
  });
}

runMetaLoginTest();
