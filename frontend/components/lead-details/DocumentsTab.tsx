'use client';

import React, { useState } from 'react';
import { FileText, Download, Upload, Trash2, Eye, Plus } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const DocumentsTab: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useLeadDetailsStore();
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addDocument({
        name: file.name,
        uploadedAt: `Uploaded on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: 'pdf',
        downloadUrl: '#',
      });
      setSelectedFileName('');
    }
  };

  return (
    <div className="documents-tab-container">
      {/* Upload Header Box */}
      <div className="doc-upload-banner">
        <div>
          <h3 className="doc-banner-title">Lead KYC & Project Documents</h3>
          <p className="doc-banner-subtitle">
            Upload and manage PAN, Aadhaar, Income Proofs, Cost Quotations & Booking Receipts.
          </p>
        </div>

        <label className="btn-upload-file">
          <Upload size={14} /> Upload Document
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden-file-input" />
        </label>
      </div>

      {/* Documents Grid List */}
      <div className="documents-grid-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-card-item">
            <div className="doc-icon-box">
              <FileText size={24} className="text-primary" />
            </div>

            <div className="doc-card-info">
              <h4 className="doc-card-title">{doc.name}</h4>
              <span className="doc-card-meta">{doc.uploadedAt} • {doc.fileSize}</span>
            </div>

            <div className="doc-card-actions">
              <a href={doc.downloadUrl} className="doc-action-icon-btn" title="Download Document">
                <Download size={16} />
              </a>
              <button
                type="button"
                className="doc-action-icon-btn text-danger"
                onClick={() => deleteDocument(doc.id)}
                title="Delete Document"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
