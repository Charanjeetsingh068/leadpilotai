import { KnowledgeRepository, DocumentFilterOptions } from '../repositories/knowledge.repository';
import { ApiError } from '../utils/apiError';

export class KnowledgeService {
  private repository: KnowledgeRepository;

  constructor() {
    this.repository = new KnowledgeRepository();
  }

  async getDocuments(options: DocumentFilterOptions) {
    return this.repository.getDocuments(options);
  }

  async getDocumentById(id: string) {
    const doc = await this.repository.findById(id);
    if (!doc) throw new ApiError(404, 'Knowledge document not found');
    return doc;
  }

  async uploadDocument(payload: any) {
    return this.repository.createDocument(payload);
  }

  async deleteDocument(id: string) {
    const success = await this.repository.deleteDocument(id);
    if (!success) throw new ApiError(404, 'Knowledge document not found');
    return { success: true };
  }

  async updateDocument(id: string, payload: any) {
    return this.repository.updateDocument(id, payload);
  }

  async archiveDocument(id: string) {
    return this.repository.archiveDocument(id);
  }

  async restoreDocument(id: string) {
    return this.repository.restoreDocument(id);
  }

  async reindexDocument(id: string) {
    return this.repository.reindexDocument(id);
  }

  async getOverviewMetrics(agentId?: string) {
    return this.repository.getOverviewMetrics(agentId);
  }

  async reindexAll() {
    return {
      success: true,
      message: 'Re-indexing initiated across all knowledge documents.',
      timestamp: new Date().toISOString(),
    };
  }

  async getCategories() {
    return [
      { name: 'Brochure', percentage: 35, count: 120 },
      { name: 'Pricing', percentage: 20, count: 68 },
      { name: 'Amenities', percentage: 15, count: 51 },
      { name: 'Legal', percentage: 10, count: 34 },
      { name: 'Location', percentage: 10, count: 34 },
      { name: 'Others', percentage: 10, count: 35 },
    ];
  }

  async getTopUsage() {
    return [
      { id: 'u1', name: 'Sunshine Villas Brochure.pdf', convCount: 1248, usagePct: 42 },
      { id: 'u2', name: 'Price List - May 2025.xlsx', convCount: 876, usagePct: 28 },
      { id: 'u3', name: 'Amenities & Features.pdf', convCount: 654, usagePct: 22 },
      { id: 'u4', name: 'Payment Plan & Offers.pdf', convCount: 432, usagePct: 12 },
    ];
  }

  async getHealthMetrics() {
    return {
      freshnessScore: 92,
      accuracyScore: 90,
      completenessScore: 88,
      consistencyScore: 94,
    };
  }

  async getFaqs(agentId?: string) {
    return this.repository.getFaqs(agentId);
  }

  async createFaq(payload: any) {
    return this.repository.createFaq(payload);
  }

  async deleteFaq(id: string) {
    return this.repository.deleteFaq(id);
  }

  async getWebsites(agentId?: string) {
    return this.repository.getWebsites(agentId);
  }

  async addWebsite(payload: any) {
    return this.repository.addWebsite(payload);
  }

  async getMedia(agentId?: string) {
    return this.repository.getMedia(agentId);
  }

  async getDataSources(agentId?: string) {
    return this.repository.getDataSources(agentId);
  }

  async getTrainingJobs(agentId?: string) {
    return this.repository.getTrainingJobs(agentId);
  }

  async getVersions(agentId?: string) {
    return this.repository.getVersions(agentId);
  }
}
