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
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';
import { KnowledgeClientService, KnowledgeOverviewMetrics } from '@/services/knowledge.service';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
  children: React.ReactNode;
}

export const KnowledgeLayout: React.FC<Props> = ({ agentId, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [agent, setAgent] = useState<AIAgentItem | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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

  const loadMetrics = useCallback(async () => {
    try {
      const [metricsRes, agentRes] = await Promise.all([
        KnowledgeClientService.getOverviewMetrics({ agentId }),
        agentId ? AgentClientService.getAgentById(agentId) : Promise.resolve(null),
      ]);
      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
      if (agentRes && agentRes.success && agentRes.data) setAgent(agentRes.data);
    } catch {
      // fallback metrics
    }
  }, [agentId]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const handleReindexAll = async () => {
    try {
      const res = await KnowledgeClientService.reindexAll();
      if (res.success) {
        toast.success('Re-indexing task started for all documents!');
        loadMetrics();
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
        agentId,
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
        loadMetrics();
        router.refresh();
      }
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getTabFromPath = () => {
    if (pathname?.includes('/documents')) return 'documents';
    if (pathname?.includes('/faqs')) return 'faqs';
    if (pathname?.includes('/websites') || pathname?.includes('/urls')) return 'urls';
    if (pathname?.includes('/media')) return 'media';
    if (pathname?.includes('/data-sources') || pathname?.includes('/datasources')) return 'datasources';
    if (pathname?.includes('/training')) return 'training';
    if (pathname?.includes('/versions')) return 'versions';
    return 'kb';
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

  return (
    <div className="agent-page-workspace">
      
      {/* Top Breadcrumb Navigation preserving agentId */}
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

      {/* Navigation Tabs Bar (8 Independent Route Tabs) */}
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
        
        {/* LEFT COLUMN: Route Child Content Slot */}
        <div className="agent-left-col">
          {children}
        </div>

        {/* RIGHT COLUMN: Persistent Sidebar Cards */}
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

    </div>
  );
};
