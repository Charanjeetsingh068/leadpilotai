'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Eye,
  Download,
  MoreVertical,
  UploadCloud,
  CheckCircle2,
  FileText,
  FileCode,
  Film,
  Archive,
  File,
} from 'lucide-react';
import { KnowledgeClientService, KnowledgeDocumentItem, KnowledgeOverviewMetrics } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const OverviewTab: React.FC<Props> = ({ agentId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [sortBy, setSortBy] = useState<string>('newest');
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

  const loadData = useCallback(async () => {
    try {
      const [docsRes, metricsRes] = await Promise.all([
        KnowledgeClientService.getDocuments({
          agentId,
          category: selectedCategory,
          status: selectedStatus,
          search: searchQuery,
          sortBy,
        }),
        KnowledgeClientService.getOverviewMetrics({ agentId }),
      ]);
      if (docsRes.success && Array.isArray(docsRes.data)) setDocuments(docsRes.data);
      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
    } catch {
      toast.error('Failed to load Overview data');
    }
  }, [agentId, selectedCategory, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        toast.success(`Uploaded & indexed "${file.name}"!`);
        loadData();
      }
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Card 1: Knowledge Overview */}
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
                      <button type="button" className="kb-action-icon-btn" title="Preview"><Eye size={15} /></button>
                      <button type="button" className="kb-action-icon-btn" title="Download"><Download size={15} /></button>
                      <button type="button" className="kb-action-icon-btn" title="More"><MoreVertical size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 3: Drag & Drop Upload Zone */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
      <div className="kb-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
        <div className="kb-dropzone-icon-box">
          <UploadCloud size={32} className="text-blue" />
        </div>
        <h4 className="kb-dropzone-title">
          {isUploading ? 'Uploading & Indexing...' : <>Drag &amp; drop files here or <span className="text-blue cursor-pointer">click to upload</span></>}
        </h4>
        <p className="kb-dropzone-sub">Supported formats: PDF, DOCX, XLSX, CSV, PPTX, TXT, ZIP, MP4, PNG</p>
      </div>
    </>
  );
};

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
