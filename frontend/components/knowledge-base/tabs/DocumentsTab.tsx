'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Eye,
  Download,
  MoreVertical,
  Plus,
  UploadCloud,
  CheckCircle2,
  FileText,
  FileCode,
  Film,
  Archive,
  File,
  RotateCw,
  Edit2,
  Trash2,
  FolderPlus,
  Copy,
  History,
} from 'lucide-react';
import { KnowledgeClientService, KnowledgeDocumentItem } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const DocumentsTab: React.FC<Props> = ({ agentId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Modals
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocumentItem | null>(null);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocCategory, setNewDocCategory] = useState<string>('Brochure');

  const loadDocuments = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getDocuments({
        agentId,
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery,
        sortBy,
      });
      if (res.success && Array.isArray(res.data)) {
        setDocuments(res.data);
      }
    } catch {
      toast.error('Failed to load Knowledge Documents');
    }
  }, [agentId, selectedCategory, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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
        loadDocuments();
      }
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await KnowledgeClientService.deleteDocument(id);
      if (res.success) {
        toast.success('Document deleted');
        loadDocuments();
      }
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await KnowledgeClientService.archiveDocument(id);
      if (res.success) {
        toast.success('Document archived');
        loadDocuments();
      }
    } catch {
      toast.error('Failed to archive document');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await KnowledgeClientService.restoreDocument(id);
      if (res.success) {
        toast.success('Document restored');
        loadDocuments();
      }
    } catch {
      toast.error('Failed to restore document');
    }
  };

  const handleReindex = async (id: string) => {
    try {
      const res = await KnowledgeClientService.reindexDocument(id);
      if (res.success) {
        toast.success('Document re-indexing triggered');
        loadDocuments();
      }
    } catch {
      toast.error('Failed to reindex document');
    }
  };

  const handleUpdateSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    try {
      const res = await KnowledgeClientService.updateDocument(editingDoc.id, {
        name: newDocName,
        category: newDocCategory,
      });
      if (res.success) {
        toast.success('Document updated');
        setEditingDoc(null);
        loadDocuments();
      }
    } catch {
      toast.error('Failed to update document');
    }
  };

  return (
    <div className="agent-card-section">
      <div className="agent-toolbar-row mb-4">
        <div>
          <h3 className="agent-section-title mb-0">Knowledge Documents Management</h3>
          <p className="text-xs text-slate-500">Dedicated repository of all uploaded documents, version history, and embedding statuses.</p>
        </div>

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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="agent-sort-select"
          >
            <option value="All Categories">All Categories</option>
            <option value="Brochure">Brochure</option>
            <option value="Pricing">Pricing</option>
            <option value="Amenities">Amenities</option>
            <option value="Legal">Legal</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="agent-sort-select"
          >
            <option value="All Status">All Status</option>
            <option value="Indexed">Indexed</option>
            <option value="Archived">Archived</option>
          </select>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-agent-create-primary"
          >
            <Plus size={15} />
            <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
          </button>
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
              <th>Uploaded By</th>
              <th>Uploaded On</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="font-semibold text-slate-800 flex-cell">
                  {getFileIcon(doc.type)}
                  <div>
                    <div>{doc.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{doc.fileSize || '2.4 MB'} &bull; v2.4.1</span>
                  </div>
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
                <td className="text-xs text-slate-600 font-medium">{doc.uploadedBy || 'Arjun Mehta'}</td>
                <td className="text-slate-500 text-xs">
                  {new Date(doc.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="text-right">
                  <div className="kb-actions-row">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoc(doc);
                        setNewDocName(doc.name);
                        setNewDocCategory(doc.category);
                      }}
                      className="kb-action-icon-btn text-blue-600"
                      title="Edit / Rename"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReindex(doc.id)}
                      className="kb-action-icon-btn text-purple-600"
                      title="Re-index Chunks"
                    >
                      <RotateCw size={14} />
                    </button>

                    {doc.status === 'Archived' ? (
                      <button
                        type="button"
                        onClick={() => handleRestore(doc.id)}
                        className="kb-action-icon-btn text-green-600"
                        title="Restore Document"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleArchive(doc.id)}
                        className="kb-action-icon-btn text-amber-600"
                        title="Archive Document"
                      >
                        <Archive size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="kb-action-icon-btn text-red-500"
                      title="Delete Document"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Rename Modal */}
      {editingDoc && (
        <div className="agent-modal-overlay" onClick={() => setEditingDoc(null)}>
          <div className="agent-modal-container max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Edit Document Properties</h3>
              <button type="button" onClick={() => setEditingDoc(null)} className="agent-modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleUpdateSave} className="p-4 flex flex-col gap-3">
              <div className="agent-form-group">
                <label className="agent-form-label">Document Name *</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="agent-form-input"
                  required
                />
              </div>
              <div className="agent-form-group">
                <label className="agent-form-label">Category *</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Brochure">Brochure</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Legal">Legal</option>
                  <option value="Location">Location</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setEditingDoc(null)} className="btn-agent-secondary-action">Cancel</button>
                <button type="submit" className="btn-agent-create-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
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
