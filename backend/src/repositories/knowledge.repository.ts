import { prisma } from '../config/database';

export interface DocumentFilterOptions {
  agentId?: string;
  category?: string;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export class KnowledgeRepository {
  async getDocuments(options: DocumentFilterOptions) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.agentId && options.agentId.length === 36) {
      const agentKb = await prisma.knowledgeBase.findFirst({
        where: { aiAgentId: options.agentId },
      });
      if (agentKb) {
        where.knowledgeBaseId = agentKb.id;
      }
    }

    if (options.category && options.category !== 'All Categories') {
      where.category = options.category;
    }
    if (options.status && options.status !== 'All Status') {
      where.status = options.status;
    }
    if (options.type && options.type !== 'All Types') {
      where.type = options.type;
    }
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { category: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const sortField = options.sortBy === 'name' ? 'name' : 'createdAt';

    const [documents, total] = await Promise.all([
      prisma.knowledgeDocument.findMany({
        where,
        orderBy: { [sortField]: 'desc' },
        skip,
        take: limit,
      }),
      prisma.knowledgeDocument.count({ where }),
    ]);

    return {
      documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string) {
    if (!id || id.length !== 36) return null;
    return prisma.knowledgeDocument.findUnique({ where: { id } });
  }

  async createDocument(data: any) {
    let kbId = data.knowledgeBaseId;
    if (!kbId && data.agentId && data.agentId.length === 36) {
      const agentKb = await prisma.knowledgeBase.findFirst({
        where: { aiAgentId: data.agentId },
      });
      if (agentKb) kbId = agentKb.id;
    }

    if (!kbId) {
      const defaultKb = await prisma.knowledgeBase.findFirst();
      if (defaultKb) {
        kbId = defaultKb.id;
      } else {
        const newKb = await prisma.knowledgeBase.create({
          data: { name: 'Real Estate Standard Inventory' },
        });
        kbId = newKb.id;
      }
    }

    return prisma.knowledgeDocument.create({
      data: {
        name: data.name || 'Untitled Document.pdf',
        fileUrl: data.fileUrl || '',
        type: data.type || 'PDF',
        category: data.category || 'Brochure',
        pagesCount: data.pagesCount ? Number(data.pagesCount) : 12,
        chunksCount: data.chunksCount ? Number(data.chunksCount) : 650,
        status: data.status || 'Indexed',
        uploadedBy: data.uploadedBy || 'Arjun Mehta',
        fileSize: data.fileSize || '2.4 MB',
        knowledgeBaseId: kbId,
      },
    });
  }

  async deleteDocument(id: string) {
    if (!id || id.length !== 36) return false;
    await prisma.knowledgeDocument.delete({ where: { id } });
    return true;
  }

  async updateDocument(id: string, data: any) {
    if (!id || id.length !== 36) return null;
    return prisma.knowledgeDocument.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  async archiveDocument(id: string) {
    if (!id || id.length !== 36) return null;
    return prisma.knowledgeDocument.update({
      where: { id },
      data: { status: 'Archived' },
    });
  }

  async restoreDocument(id: string) {
    if (!id || id.length !== 36) return null;
    return prisma.knowledgeDocument.update({
      where: { id },
      data: { status: 'Indexed' },
    });
  }

  async reindexDocument(id: string) {
    if (!id || id.length !== 36) return null;
    return prisma.knowledgeDocument.update({
      where: { id },
      data: { status: 'Indexed', updatedAt: new Date() },
    });
  }

  async getOverviewMetrics(agentId?: string) {
    const where: any = {};
    let kbName = 'Real Estate KB v2.4.1';

    if (agentId && agentId.length === 36) {
      const agentKb = await prisma.knowledgeBase.findFirst({
        where: { aiAgentId: agentId },
      });
      if (agentKb) {
        where.knowledgeBaseId = agentKb.id;
        kbName = agentKb.name;
      }
    }

    const [totalDocs, totalChunks] = await Promise.all([
      prisma.knowledgeDocument.count({ where }),
      prisma.knowledgeDocument.aggregate({
        where,
        _sum: { chunksCount: true },
      }),
    ]);

    const docsCount = totalDocs || 342;
    const chunks = totalChunks._sum.chunksCount || 24856;

    return {
      kbName,
      totalDocuments: docsCount,
      totalPages: 1248,
      indexedChunks: chunks,
      storageUsed: '2.48 GB',
      lastTrained: 'May 26, 2025 10:30 AM',
      status: 'Up to date',
      trainingStatus: {
        totalDocuments: docsCount,
        indexedDocuments: Math.round(docsCount * 0.85),
        pendingDocuments: Math.round(docsCount * 0.1),
        failedDocuments: Math.max(0, docsCount - Math.round(docsCount * 0.95)),
        indexedPercentage: 85,
        lastTrainedCompleted: 'May 26, 2025 at 10:30 AM',
      },
    };
  }

  // FAQs
  async getFaqs(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeFAQ.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      const initialFaqs = [
        { question: 'What is the starting price for 3 BHK Sunshine Villas?', answer: 'The starting price for 3 BHK Sunshine Villas is ₹1.45 Crore onwards.', category: 'Pricing', priority: 'High', knowledgeBaseId: kb?.id },
        { question: 'What are the available payment plans?', answer: 'We offer 20:80 Construction Linked Plan and Flexi Payment options.', category: 'Payment Plan', priority: 'High', knowledgeBaseId: kb?.id },
        { question: 'Is Sunshine Villas RERA approved?', answer: 'Yes, Sunshine Villas is RERA registered under ID: RERA/IND/2024/0981.', category: 'Legal', priority: 'High', knowledgeBaseId: kb?.id },
        { question: 'What amenities are included in the project?', answer: 'Clubhouse, Swimming Pool, Gymnasium, EV Charging, Tennis Court, and 24/7 Security.', category: 'Amenities', priority: 'Medium', knowledgeBaseId: kb?.id },
      ];
      for (const faq of initialFaqs) {
        await prisma.knowledgeFAQ.create({ data: faq });
      }
    }
    return prisma.knowledgeFAQ.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createFaq(data: any) {
    let kbId = data.knowledgeBaseId;
    if (!kbId && data.agentId && data.agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: data.agentId } });
      if (kb) kbId = kb.id;
    }
    return prisma.knowledgeFAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || 'General',
        priority: data.priority || 'High',
        language: data.language || 'English',
        status: 'Active',
        knowledgeBaseId: kbId,
      },
    });
  }

  async deleteFaq(id: string) {
    if (!id || id.length !== 36) return false;
    await prisma.knowledgeFAQ.delete({ where: { id } });
    return true;
  }

  // Websites
  async getWebsites(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeWebsite.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      await prisma.knowledgeWebsite.create({
        data: { url: 'https://sunshinevillas.com/inventory', pagesCount: 24, chunksCount: 680, status: 'Synced', depth: 3, knowledgeBaseId: kb?.id },
      });
      await prisma.knowledgeWebsite.create({
        data: { url: 'https://sunshinevillas.com/pricing-offers', pagesCount: 8, chunksCount: 220, status: 'Synced', depth: 2, knowledgeBaseId: kb?.id },
      });
    }
    return prisma.knowledgeWebsite.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async addWebsite(data: any) {
    let kbId = data.knowledgeBaseId;
    if (!kbId && data.agentId && data.agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: data.agentId } });
      if (kb) kbId = kb.id;
    }
    return prisma.knowledgeWebsite.create({
      data: {
        url: data.url,
        pagesCount: data.pagesCount || 12,
        chunksCount: data.chunksCount || 340,
        status: 'Synced',
        depth: data.depth ? Number(data.depth) : 3,
        knowledgeBaseId: kbId,
      },
    });
  }

  // Media
  async getMedia(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeMedia.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      await prisma.knowledgeMedia.create({
        data: { title: 'Sunshine Villas 3D Floor Plan', type: 'Image', fileSize: '8.4 MB', ocrText: 'Master Bedroom: 14x16 ft, Living Hall: 18x22 ft', status: 'Processed', chunksCount: 45, knowledgeBaseId: kb?.id },
      });
      await prisma.knowledgeMedia.create({
        data: { title: 'Sunshine Villas Walkthrough HD', type: 'Video', fileSize: '45.0 MB', ocrText: 'Full video walkthrough transcript generated by Speech-to-Text', status: 'Processed', chunksCount: 1855, knowledgeBaseId: kb?.id },
      });
    }
    return prisma.knowledgeMedia.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // DataSources
  async getDataSources(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeDataSource.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      await prisma.knowledgeDataSource.create({
        data: { name: 'LeadPilot CRM Inventory DB', type: 'PostgreSQL', status: 'Connected', autoSyncSchedule: 'Every 6 Hours', knowledgeBaseId: kb?.id },
      });
      await prisma.knowledgeDataSource.create({
        data: { name: 'Google Drive Property Collaterals', type: 'Google Drive', status: 'Connected', autoSyncSchedule: 'Daily @ 12 AM', knowledgeBaseId: kb?.id },
      });
    }
    return prisma.knowledgeDataSource.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // Training Jobs
  async getTrainingJobs(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeTrainingJob.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      await prisma.knowledgeTrainingJob.create({
        data: { jobName: 'Full Knowledge Base Vector Re-index', status: 'Completed', progress: 100, chunksProcessed: 24856, embeddingsGenerated: 24856, knowledgeBaseId: kb?.id },
      });
    }
    return prisma.knowledgeTrainingJob.findMany({ where, orderBy: { startedAt: 'desc' } });
  }

  // Versions
  async getVersions(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const kb = await prisma.knowledgeBase.findFirst({ where: { aiAgentId: agentId } });
      if (kb) where.knowledgeBaseId = kb.id;
    }
    const count = await prisma.knowledgeVersion.count({ where });
    if (count === 0) {
      const kb = await prisma.knowledgeBase.findFirst();
      await prisma.knowledgeVersion.create({
        data: { version: 'v2.4.1', description: 'Updated May 2025 Price List & Offers', documentCount: 342, chunkCount: 24856, createdBy: 'Arjun Mehta', knowledgeBaseId: kb?.id },
      });
      await prisma.knowledgeVersion.create({
        data: { version: 'v2.4.0', description: 'Added RERA Certificate & Location Maps', documentCount: 338, chunkCount: 24120, createdBy: 'Arjun Mehta', knowledgeBaseId: kb?.id },
      });
    }
    return prisma.knowledgeVersion.findMany({ where, orderBy: { createdAt: 'desc' } });
  }
}
