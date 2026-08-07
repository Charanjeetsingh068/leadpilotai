import { prisma, connectDatabase } from '../config/database';
import { FacebookPageModel } from '../models/FacebookPage.model';
import { FacebookRepository } from '../repositories/facebook.repository';

async function testPageSaving() {
  console.log('Testing live page saving to DB...');
  await connectDatabase();
  const repo = new FacebookRepository();
  const scope = { companyId: 'default-company', workspaceId: 'default-workspace', userId: 'default-user' };

  try {
    const p1 = await repo.upsertPage({
      companyId: scope.companyId,
      workspaceId: scope.workspaceId,
      facebookAccountId: '28149461204738597',
      pageId: '107603092654737',
      name: 'Entec Media-Digital Marketing Agency',
      pageName: 'Entec Media-Digital Marketing Agency',
      category: 'Internet marketing service',
      followersCount: 104,
      followers: 104,
      accessToken: 'test_token',
      connected: true,
    });
    console.log('PostgreSQL Page Created:', p1.id, p1.name);

    const mongoP = await FacebookPageModel.updateOne(
      { pageId: '107603092654737' },
      {
        $set: {
          workspaceId: scope.workspaceId,
          companyId: scope.companyId,
          name: 'Entec Media-Digital Marketing Agency',
          category: 'Internet marketing service',
          fanCount: 104,
          isConnected: true,
        },
      },
      { upsert: true }
    );
    console.log('MongoDB Page Upserted:', mongoP);

    const allPg = await prisma.facebookPage.findMany({});
    console.log('Total PostgreSQL Pages:', allPg.length);

    const allMongo = await FacebookPageModel.find({});
    console.log('Total Mongoose Pages:', allMongo.length);
  } catch (e: any) {
    console.error('Error testing page saving:', e.message, e.stack);
  } finally {
    process.exit(0);
  }
}

testPageSaving();
