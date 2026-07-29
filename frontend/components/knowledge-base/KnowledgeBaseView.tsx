'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Globe,
  Video,
  Database,
  Cpu,
  History,
  RotateCw,
  Plus,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Eye,
  Download,
  MoreVertical,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  File,
  FileCode,
  Film,
  Archive,
} from 'lucide-react';
import { KnowledgeClientService, KnowledgeDocumentItem, KnowledgeOverviewMetrics } from '@/services/knowledge.service';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
  initialTab?: string;
}

export const KnowledgeBaseView: React.FC<Props> = ({ agentId, initialTab }) => {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getTabFromPath = () => {
    if (pathname?.includes('/documents')) return 'documents';
    if (pathname?.includes('/faqs')) return 'faqs';
    if (pathname?.includes('/websites') || pathname?.includes('/urls')) return 'urls';
    if (pathname?.includes('/media')) return 'media';
    if (pathname?.includes('/data-sources') || pathname?.includes('/datasources')) return 'datasources';
    if (pathname?.includes('/training')) return 'training';
    if (pathname?.includes('/versions')) return 'versions';
    return initialTab || 'kb';
  };

  const activeTab = getTabFromPath();

  const handleTabClick = (tabKey: string) => {
    let subPath = '';
    switch (tabKey) {
      case 'documents': subPath = '/documents'; break;
      case 'faqs': subPath = '/faqs'; break;
      case 'urls': subPath = '/websites'; break;
      case 'media': subPath = '/media'; break;
      case 'datasources': subPath = '/data-sources'; break;
      case 'training': subPath = '/training'; break;
      case 'versions': subPath = '/versions'; break;
      default: subPath = ''; break;
    }

    if (agentId) {
      router.push(`/ai-agents/${agentId}/knowledge-base${subPath}`);
    } else {
      router.push(`/knowledge-base${subPath}`);
    }
  };

  const [agent, setAgent] = useState<AIAgentItem | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocumentItem[]>([]);
  const [metrics, setMetrics] = useState<KnowledgeOverviewMetrics>({
    totalDocuments: 342,
    totalPages: 1248,
    indexedChunks: 24856,
    storageUsed: '2.48 GB',
    lastTrained: 'May 26, 2025 10:30 AM',
    status: 'Up to date',
    trainingStatus: {
      totalDocuments: 342,
      indexedDocuments: 291,
      pendingDocuments: 28,
      failedDocuments: 3,
      indexedPercentage: 85,
      lastTrainedCompleted: 'May 26, 2025 at 10:30 AM',
    },
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [faqs, setFaqs] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);

  const [showFaqModal, setShowFaqModal] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newFaqCategory, setNewFaqCategory] = useState<string>('Pricing');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        docsRes,
        metricsRes,
        agentRes,
        faqsRes,
        sitesRes,
        mediaRes,
        sourcesRes,
        jobsRes,
        versionsRes,
      ] = await Promise.all([
        KnowledgeClientService.getDocuments({
          agentId,
          category: selectedCategory,
          status: selectedStatus,
          search: searchQuery,
          sortBy,
        }),
        KnowledgeClientService.getOverviewMetrics({ agentId }),
        agentId ? AgentClientService.getAgentById(agentId) : Promise.resolve(null),
        KnowledgeClientService.getFaqs({ agentId }),
        KnowledgeClientService.getWebsites({ agentId }),
        KnowledgeClientService.getMedia({ agentId }),
        KnowledgeClientService.getDataSources({ agentId }),
        KnowledgeClientService.getTrainingJobs({ agentId }),
        KnowledgeClientService.getVersions({ agentId }),
      ]);

      if (docsRes.success && Array.isArray(docsRes.data)) setDocuments(docsRes.data);
      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
      if (agentRes && agentRes.success && agentRes.data) setAgent(agentRes.data);
      if (faqsRes.success && Array.isArray(faqsRes.data)) setFaqs(faqsRes.data);
      if (sitesRes.success && Array.isArray(sitesRes.data)) setWebsites(sitesRes.data);
      if (mediaRes.success && Array.isArray(mediaRes.data)) setMediaList(mediaRes.data);
      if (sourcesRes.success && Array.isArray(sourcesRes.data)) setDataSources(sourcesRes.data);
      if (jobsRes.success && Array.isArray(jobsRes.data)) setTrainingJobs(jobsRes.data);
      if (versionsRes.success && Array.isArray(versionsRes.data)) setVersions(versionsRes.data);
    } catch {
      toast.error('Failed to load Knowledge Base data');
    } finally {
      setIsLoading(false);
    }
  }, [agentId, selectedCategory, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Please enter both question and answer');
      return;
    }
    try {
      const res = await KnowledgeClientService.createFaq({
        agentId,
        question: newQuestion,
        answer: newAnswer,
        category: newFaqCategory,
        priority: 'High',
      });
      if (res.success) {
        toast.success('FAQ created and indexed!');
        setShowFaqModal(false);
        setNewQuestion('');
        setNewAnswer('');
        loadData();
      }
    } catch {
      toast.error('Failed to create FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await KnowledgeClientService.deleteFaq(id);
      if (res.success) {
        toast.success('FAQ deleted');
        loadData();
      }
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebsiteUrl.trim()) return;
    try {
      const res = await KnowledgeClientService.addWebsite({
        agentId,
        url: newWebsiteUrl,
        depth: 3,
      });
      if (res.success) {
        toast.success('Website added and queued for crawling & vector indexing!');
        setNewWebsiteUrl('');
        loadData();
      }
    } catch {
      toast.error('Failed to add website');
    }
  };

  const handleReindexAll = async () => {
    try {
      const res = await KnowledgeClientService.reindexAll();
      if (res.success) {
        toast.success('Re-indexing task started for all documents!');
        loadData();
      }
    } catch {
      toast.error('Failed to start re-indexing');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const payload = {
        name: file.name,
        type: extension,
        category: 'Brochure',
        pagesCount: 12,
        chunksCount: 650,
        status: 'Indexed',
        uploadedBy: 'Arjun Mehta',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };

      const res = await KnowledgeClientService.uploadDocument(payload);
      if (res.success) {
        toast.success(`Document "${file.name}" uploaded & indexed successfully!`);
        loadData();
      }
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="agent-page-workspace">
      
      {/* Top Breadcrumb Navigation */}
      <div className="agent-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="agent-breadcrumb-link">
          AI Agents
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span
          onClick={() => agentId && router.push(`/ai-agents/${agentId}`)}
          className="agent-breadcrumb-link"
        >
          {agent ? agent.name : 'Property Advisor AI'}
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span className="agent-breadcrumb-current">Knowledge Base &amp; Training</span>
      </div>

      {/* Page Header */}
      <div className="agent-header-row">
        <div>
          <h1 className="agent-page-title">Knowledge Base &amp; Training</h1>
          <p className="agent-page-subtitle">Upload, manage and train knowledge for your AI agent to deliver accurate responses.</p>
        </div>

        <div className="agent-header-actions">
          <button type="button" onClick={handleReindexAll} className="btn-agent-secondary-action">
            <RotateCw size={15} />
            <span>Re-index All</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-agent-create-primary"
          >
            <Plus size={16} />
            <span>{isUploading ? 'Uploading...' : 'Upload Knowledge'}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar (8 Tabs) */}
      <div className="agent-tabs-header-bar">
        <button
          type="button"
          onClick={() => handleTabClick('kb')}
          className={`agent-tab-item ${activeTab === 'kb' ? 'active' : ''}`}
        >
          <BookOpen size={15} />
          <span>Knowledge Base</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('documents')}
          className={`agent-tab-item ${activeTab === 'documents' ? 'active' : ''}`}
        >
          <FileText size={15} />
          <span>Documents</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('faqs')}
          className={`agent-tab-item ${activeTab === 'faqs' ? 'active' : ''}`}
        >
          <HelpCircle size={15} />
          <span>FAQs</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('urls')}
          className={`agent-tab-item ${activeTab === 'urls' ? 'active' : ''}`}
        >
          <Globe size={15} />
          <span>Website &amp; URLs</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('media')}
          className={`agent-tab-item ${activeTab === 'media' ? 'active' : ''}`}
        >
          <Video size={15} />
          <span>Media</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('datasources')}
          className={`agent-tab-item ${activeTab === 'datasources' ? 'active' : ''}`}
        >
          <Database size={15} />
          <span>Data Sources</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('training')}
          className={`agent-tab-item ${activeTab === 'training' ? 'active' : ''}`}
        >
          <Cpu size={15} />
          <span>Training &amp; Indexing</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('versions')}
          className={`agent-tab-item ${activeTab === 'versions' ? 'active' : ''}`}
        >
          <History size={15} />
          <span>Versions</span>
        </button>
      </div>

      {/* Main 2-Column Content Workspace */}
      <div className="agent-main-layout">
        
        {/* LEFT COLUMN: Main Overview & Table & Upload Zone */}
        <div className="agent-left-col">
          
          {/* TAB 1 & 2: KNOWLEDGE BASE & DOCUMENTS */}
          {(activeTab === 'kb' || activeTab === 'documents') && (
            <>
              {/* Card 1: Knowledge Overview (5 KPI Cards Bar) */}
              <div className="agent-card-section">
                <h3 className="agent-card-section-title mb-3">Knowledge Overview</h3>
                
                <div className="kb-overview-grid">
                  
                  <div className="kb-overview-kpi">
                    <span className="kb-kpi-lbl">Total Documents</span>
                    <div className="kb-kpi-val">{metrics.totalDocuments}</div>
                    <span className="kb-kpi-trend text-green">&uarr; 24 this month</span>
                  </div>

                  <div className="kb-overview-kpi">
                    <span className="kb-kpi-lbl">Total Pages</span>
                    <div className="kb-kpi-val">{metrics.totalPages.toLocaleString()}</div>
                    <span className="kb-kpi-trend text-green">&uarr; 186 this month</span>
                  </div>

                  <div className="kb-overview-kpi">
                    <span className="kb-kpi-lbl">Indexed Chunks</span>
                    <div className="kb-kpi-val">{metrics.indexedChunks.toLocaleString()}</div>
                    <span className="kb-kpi-trend text-green">&uarr; 3,421 this month</span>
                  </div>

                  <div className="kb-overview-kpi">
                    <span className="kb-kpi-lbl">Storage Used</span>
                    <div className="kb-kpi-val">{metrics.storageUsed}</div>
                    <span className="kb-kpi-trend text-green">&uarr; 18% this month</span>
                  </div>

                  <div className="kb-overview-kpi border-0">
                    <span className="kb-kpi-lbl">Last Trained</span>
                    <div className="kb-kpi-val text-sm font-semibold">{metrics.lastTrained}</div>
                    <div className="mt-1">
                      <span className="agent-status-badge active">
                        <CheckCircle2 size={12} className="inline-icon" /> Up to date
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 2: Knowledge Documents Table & Toolbar */}
              <div className="agent-card-section">
                <div className="agent-toolbar-row">
                  <h3 className="agent-section-title mb-0">Knowledge Documents</h3>
                  
                  <div className="agent-toolbar-controls">
                    <div className="agent-search-input-wrap">
                      <Search size={15} className="agent-search-icon" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="agent-search-input"
                      />
                    </div>

                    <button type="button" className="btn-agent-filter">
                      <SlidersHorizontal size={14} />
                      <span>Filter</span>
                    </button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="agent-sort-select"
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="name">Sort: Name</option>
                    </select>
                  </div>
                </div>

                {/* Documents Table */}
                <div className="kb-documents-table-wrapper">
                  <table className="kb-documents-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Chunks</th>
                        <th>Status</th>
                        <th>Uploaded On</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="font-semibold text-slate-800 flex-cell">
                            {getFileIcon(doc.type)}
                            <span>{doc.name}</span>
                          </td>

                          <td>
                            <span className={`kb-type-badge ${doc.type.toLowerCase()}`}>
                              {doc.type}
                            </span>
                          </td>

                          <td className="text-slate-600 font-medium">{doc.category}</td>

                          <td>{doc.pagesCount ?? '-'}</td>

                          <td className="font-semibold">{doc.chunksCount ? doc.chunksCount.toLocaleString() : '-'}</td>

                          <td>
                            <span className={`kb-status-badge ${doc.status.toLowerCase()}`}>
                              {doc.status === 'Indexed' && <CheckCircle2 size={12} className="inline-icon" />}
                              {doc.status}
                            </span>
                          </td>

                          <td className="text-slate-500 text-xs">
                            {new Date(doc.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="text-right">
                            <div className="kb-actions-row">
                              <button type="button" className="kb-action-icon-btn" title="Preview">
                                <Eye size={15} />
                              </button>
                              <button type="button" className="kb-action-icon-btn" title="Download">
                                <Download size={15} />
                              </button>
                              <button type="button" className="kb-action-icon-btn" title="More">
                                <MoreVertical size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Pagination */}
                <div className="kb-table-footer">
                  <span className="kb-footer-count">Showing 1 to {documents.length} of 42 documents</span>
                  
                  <div className="kb-pagination-controls">
                    <button type="button" className="kb-page-btn">&lt;</button>
                    <button type="button" className="kb-page-btn active">1</button>
                    <button type="button" className="kb-page-btn">2</button>
                    <button type="button" className="kb-page-btn">3</button>
                    <button type="button" className="kb-page-btn">4</button>
                    <button type="button" className="kb-page-btn">5</button>
                    <button type="button" className="kb-page-btn">&gt;</button>
                  </div>

                  <select className="kb-per-page-select">
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                  </select>
                </div>

              </div>

              {/* Card 3: Drag & Drop Upload Zone */}
              <div
                className="kb-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="kb-dropzone-icon-box">
                  <UploadCloud size={32} className="text-blue" />
                </div>
                <h4 className="kb-dropzone-title">
                  Drag &amp; drop files here or <span className="text-blue cursor-pointer">click to upload</span>
                </h4>
                <p className="kb-dropzone-sub">
                  Supported formats: PDF, DOCX, DOC, XLSX, CSV, PPTX, TXT, MD, ZIP, MP4, JPG, PNG
                </p>
                <span className="kb-dropzone-hint">Max file size: 100MB</span>
              </div>
            </>
          )}

          {/* TAB 3: FAQs */}
          {activeTab === 'faqs' && (
            <div className="agent-card-section">
              <div className="agent-toolbar-row mb-3">
                <div>
                  <h3 className="agent-section-title mb-0">Frequently Asked Questions (FAQs)</h3>
                  <p className="text-xs text-slate-500">Add questions and answers to train AI responses instantly.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFaqModal(true)}
                  className="btn-agent-create-primary"
                >
                  <Plus size={15} />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Confidence</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((faq) => (
                      <tr key={faq.id}>
                        <td>
                          <div className="font-bold text-slate-800">{faq.question}</div>
                          <div className="text-xs text-slate-500 mt-1">{faq.answer}</div>
                        </td>
                        <td><span className="kb-type-badge pdf">{faq.category}</span></td>
                        <td><span className="font-semibold text-xs text-orange">{faq.priority}</span></td>
                        <td><span className="font-bold text-xs text-green">{faq.confidence}%</span></td>
                        <td><span className="kb-status-badge indexed">Active</span></td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="kb-action-icon-btn text-red-500"
                            title="Delete FAQ"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WEBSITE & URLS */}
          {activeTab === 'urls' && (
            <div className="agent-card-section">
              <h3 className="agent-section-title mb-2">Website Crawler &amp; URL Training</h3>
              <p className="text-xs text-slate-500 mb-3">Input your company website URL to automatically crawl pages and train AI.</p>

              <form onSubmit={handleAddWebsite} className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="https://yourcompany.com/pricing"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="agent-search-input flex-1"
                  required
                />
                <button type="submit" className="btn-agent-create-primary">
                  <Globe size={15} />
                  <span>Scan &amp; Train Website</span>
                </button>
              </form>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Website URL</th>
                      <th>Pages</th>
                      <th>Chunks</th>
                      <th>Status</th>
                      <th>Last Sync</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.map((site) => (
                      <tr key={site.id}>
                        <td className="font-semibold text-blue flex-cell">
                          <Globe size={16} />
                          <span>{site.url}</span>
                        </td>
                        <td>{site.pagesCount} pages</td>
                        <td className="font-bold">{site.chunksCount}</td>
                        <td><span className="kb-status-badge indexed">{site.status}</span></td>
                        <td className="text-xs text-slate-500">
                          {new Date(site.lastSyncAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA */}
          {activeTab === 'media' && (
            <div className="agent-card-section">
              <h3 className="agent-section-title mb-2">Media &amp; Transcripts (OCR &amp; Audio)</h3>
              <p className="text-xs text-slate-500 mb-3">Processed images, videos, 3D floor plans, and audio transcripts.</p>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Media Title</th>
                      <th>Type</th>
                      <th>OCR / Transcript Preview</th>
                      <th>Chunks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaList.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-slate-800 flex-cell">
                          {item.type === 'Image' ? <FileText size={16} className="text-blue" /> : <Video size={16} className="text-purple" />}
                          <span>{item.title}</span>
                        </td>
                        <td><span className={`kb-type-badge ${item.type === 'Image' ? 'excel' : 'video'}`}>{item.type}</span></td>
                        <td className="text-xs text-slate-600 max-w-xs truncate">{item.ocrText}</td>
                        <td className="font-bold">{item.chunksCount}</td>
                        <td><span className="kb-status-badge indexed">{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: DATA SOURCES */}
          {activeTab === 'datasources' && (
            <div className="agent-card-section">
              <h3 className="agent-section-title mb-2">Connected Enterprise Data Sources</h3>
              <p className="text-xs text-slate-500 mb-3">Sync live product inventory, CRM databases, Google Drive, and PostgreSQL.</p>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Source Name</th>
                      <th>Type</th>
                      <th>Auto Sync</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSources.map((source) => (
                      <tr key={source.id}>
                        <td className="font-semibold text-slate-800 flex-cell">
                          <Database size={16} className="text-blue" />
                          <span>{source.name}</span>
                        </td>
                        <td><span className="kb-type-badge pdf">{source.type}</span></td>
                        <td className="text-xs text-slate-600">{source.autoSyncSchedule}</td>
                        <td><span className="kb-status-badge indexed">{source.status}</span></td>
                        <td className="text-right">
                          <button type="button" className="btn-agent-secondary-action text-xs">Sync Now</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: TRAINING & INDEXING */}
          {activeTab === 'training' && (
            <div className="agent-card-section">
              <div className="agent-toolbar-row mb-3">
                <div>
                  <h3 className="agent-section-title mb-0">AI Training Center &amp; Vector Index Jobs</h3>
                  <p className="text-xs text-slate-500">Monitor live vector embedding jobs, chunking, and GPU training progress.</p>
                </div>
                <button type="button" onClick={handleReindexAll} className="btn-agent-create-primary">
                  <Cpu size={15} />
                  <span>Start Training Job</span>
                </button>
              </div>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Job Name</th>
                      <th>Chunks Processed</th>
                      <th>Embeddings</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="font-semibold text-slate-800">{job.jobName}</td>
                        <td>{job.chunksProcessed.toLocaleString()} chunks</td>
                        <td className="font-bold text-blue">{job.embeddingsGenerated.toLocaleString()}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="kb-used-bar-bg w-24"><div className="kb-used-bar-fill" style={{ width: `${job.progress}%` }} /></div>
                            <span className="text-xs font-bold">{job.progress}%</span>
                          </div>
                        </td>
                        <td><span className="kb-status-badge indexed">{job.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: VERSIONS */}
          {activeTab === 'versions' && (
            <div className="agent-card-section">
              <h3 className="agent-section-title mb-2">Knowledge Base Version History &amp; Audit Log</h3>
              <p className="text-xs text-slate-500 mb-3">Rollback or compare previous knowledge vector snapshots.</p>

              <div className="kb-documents-table-wrapper">
                <table className="kb-documents-table">
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Description</th>
                      <th>Document Count</th>
                      <th>Chunk Count</th>
                      <th>Created By</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((ver) => (
                      <tr key={ver.id}>
                        <td className="font-bold text-blue">{ver.version}</td>
                        <td className="text-slate-700">{ver.description}</td>
                        <td>{ver.documentCount} docs</td>
                        <td className="font-bold">{ver.chunkCount.toLocaleString()}</td>
                        <td className="text-xs text-slate-500">{ver.createdBy}</td>
                        <td className="text-right">
                          <button type="button" className="btn-agent-secondary-action text-xs">Restore</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar Cards */}
        <div className="agent-right-col">
          
          {/* Card 1: Training & Indexing Status */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title">Training &amp; Indexing Status</h3>
            
            <div className="kb-donut-status-wrapper">
              <div className="kb-donut-chart">
                <span className="kb-donut-val">85%</span>
                <span className="kb-donut-lbl">Indexed</span>
              </div>

              <div className="kb-donut-stats-list">
                <div className="kb-donut-stat-row">
                  <span>Total Documents</span>
                  <strong>{metrics.trainingStatus.totalDocuments}</strong>
                </div>
                <div className="kb-donut-stat-row">
                  <span>Indexed Documents</span>
                  <strong className="text-green">{metrics.trainingStatus.indexedDocuments}</strong>
                </div>
                <div className="kb-donut-stat-row">
                  <span>Pending Documents</span>
                  <strong className="text-orange">{metrics.trainingStatus.pendingDocuments}</strong>
                </div>
                <div className="kb-donut-stat-row">
                  <span>Failed Documents</span>
                  <strong className="text-red-500">{metrics.trainingStatus.failedDocuments}</strong>
                </div>
              </div>
            </div>

            <p className="kb-training-last-txt">
              Last training completed on <span className="text-blue font-semibold">{metrics.trainingStatus.lastTrainedCompleted}</span>
            </p>

            <button type="button" onClick={handleReindexAll} className="btn-kb-reindex">
              Re-index Knowledge Base
            </button>
          </div>

          {/* Card 2: Knowledge Categories */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title mb-2">Knowledge Categories</h3>

            <div className="kb-categories-list">
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-blue-500" />
                <span className="kb-cat-name">Brochure</span>
                <span className="kb-cat-pct">35% (120)</span>
              </div>
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-green-500" />
                <span className="kb-cat-name">Pricing</span>
                <span className="kb-cat-pct">20% (68)</span>
              </div>
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-purple-500" />
                <span className="kb-cat-name">Amenities</span>
                <span className="kb-cat-pct">15% (51)</span>
              </div>
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-orange-500" />
                <span className="kb-cat-name">Legal</span>
                <span className="kb-cat-pct">10% (34)</span>
              </div>
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-cyan-500" />
                <span className="kb-cat-name">Location</span>
                <span className="kb-cat-pct">10% (34)</span>
              </div>
              <div className="kb-cat-item">
                <span className="kb-cat-dot bg-slate-400" />
                <span className="kb-cat-name">Others</span>
                <span className="kb-cat-pct">10% (35)</span>
              </div>
            </div>

            <div className="kb-cat-footer-sub">Total 342 Documents</div>
          </div>

          {/* Card 3: Top Knowledge Used by AI */}
          <div className="agent-sidebar-card">
            <div className="agent-sidebar-header-row">
              <h3 className="agent-sidebar-title mb-0">Top Knowledge Used by AI</h3>
            </div>

            <div className="kb-top-used-list">
              
              <div className="kb-used-item">
                <div className="kb-used-title-row">
                  <span className="kb-used-doc-name">Sunshine Villas Brochure.pdf</span>
                  <span className="kb-used-pct">42%</span>
                </div>
                <span className="kb-used-sub">Used in 1,248 conversations</span>
                <div className="kb-used-bar-bg">
                  <div className="kb-used-bar-fill" style={{ width: '42%' }} />
                </div>
              </div>

              <div className="kb-used-item">
                <div className="kb-used-title-row">
                  <span className="kb-used-doc-name">Price List - May 2025.xlsx</span>
                  <span className="kb-used-pct">28%</span>
                </div>
                <span className="kb-used-sub">Used in 876 conversations</span>
                <div className="kb-used-bar-bg">
                  <div className="kb-used-bar-fill" style={{ width: '28%' }} />
                </div>
              </div>

              <div className="kb-used-item">
                <div className="kb-used-title-row">
                  <span className="kb-used-doc-name">Amenities &amp; Features.pdf</span>
                  <span className="kb-used-pct">22%</span>
                </div>
                <span className="kb-used-sub">Used in 654 conversations</span>
                <div className="kb-used-bar-bg">
                  <div className="kb-used-bar-fill" style={{ width: '22%' }} />
                </div>
              </div>

              <div className="kb-used-item">
                <div className="kb-used-title-row">
                  <span className="kb-used-doc-name">Payment Plan &amp; Offers.pdf</span>
                  <span className="kb-used-pct">12%</span>
                </div>
                <span className="kb-used-sub">Used in 432 conversations</span>
                <div className="kb-used-bar-bg">
                  <div className="kb-used-bar-fill" style={{ width: '12%' }} />
                </div>
              </div>

            </div>

            <button type="button" className="agent-link-btn mt-3">
              View all insights &rarr;
            </button>
          </div>

          {/* Card 4: Knowledge Health */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title">Knowledge Health</h3>

            <div className="kb-health-list">
              <div className="kb-health-item">
                <span className="kb-health-lbl">Freshness Score</span>
                <div className="kb-health-bar-row">
                  <div className="kb-health-bar-bg">
                    <div className="kb-health-bar-fill bg-green-500" style={{ width: '92%' }} />
                  </div>
                  <span className="kb-health-val font-bold">92 / 100</span>
                </div>
              </div>

              <div className="kb-health-item">
                <span className="kb-health-lbl">Accuracy Score</span>
                <div className="kb-health-bar-row">
                  <div className="kb-health-bar-bg">
                    <div className="kb-health-bar-fill bg-green-500" style={{ width: '90%' }} />
                  </div>
                  <span className="kb-health-val font-bold">90 / 100</span>
                </div>
              </div>

              <div className="kb-health-item">
                <span className="kb-health-lbl">Completeness Score</span>
                <div className="kb-health-bar-row">
                  <div className="kb-health-bar-bg">
                    <div className="kb-health-bar-fill bg-green-500" style={{ width: '88%' }} />
                  </div>
                  <span className="kb-health-val font-bold">88 / 100</span>
                </div>
              </div>

              <div className="kb-health-item">
                <span className="kb-health-lbl">Consistency Score</span>
                <div className="kb-health-bar-row">
                  <div className="kb-health-bar-bg">
                    <div className="kb-health-bar-fill bg-green-500" style={{ width: '94%' }} />
                  </div>
                  <span className="kb-health-val font-bold">94 / 100</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Create FAQ Modal */}
      {showFaqModal && (
        <div className="agent-modal-overlay" onClick={() => setShowFaqModal(false)}>
          <div className="agent-modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Add New FAQ to Knowledge Base</h3>
              <button type="button" onClick={() => setShowFaqModal(false)} className="agent-modal-close-btn">
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateFaq} className="p-4 flex flex-col gap-3">
              <div className="agent-form-group">
                <label className="agent-form-label">Question *</label>
                <input
                  type="text"
                  placeholder="e.g. What are the payment terms?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="agent-form-input"
                  required
                />
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Answer *</label>
                <textarea
                  rows={4}
                  placeholder="e.g. 20% down payment and 80% linked to construction..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="agent-form-textarea"
                  required
                />
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Category</label>
                <select
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Pricing">Pricing</option>
                  <option value="Payment Plan">Payment Plan</option>
                  <option value="Legal">Legal</option>
                  <option value="Amenities">Amenities</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="btn-agent-secondary-action"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-agent-create-primary">
                  Save &amp; Index FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// File type icon helper
function getFileIcon(type: string) {
  switch (type.toUpperCase()) {
    case 'PDF': return <FileText size={18} className="text-red-500" />;
    case 'EXCEL':
    case 'XLSX':
    case 'CSV': return <FileCode size={18} className="text-green-600" />;
    case 'VIDEO':
    case 'MP4': return <Film size={18} className="text-purple-600" />;
    case 'ZIP': return <Archive size={18} className="text-amber-600" />;
    default: return <File size={18} className="text-blue-500" />;
  }
}
