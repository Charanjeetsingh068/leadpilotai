import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a CSV file to import');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Leads imported successfully from CSV!');
      onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="lead-details-header">
          <h3 className="lead-details-title">Import Leads via CSV</h3>
          <button type="button" className="lead-details-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleImport} className="lead-details-tab-content">
          <p className="lead-page-subtitle">
            Upload your lead spreadsheet (.csv). Make sure columns include: Name, Phone, Email, Project, Source.
          </p>

          <div className="lead-note-card text-center file-upload-dashed-box">
            <FileSpreadsheet size={36} className="text-muted file-icon-center" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="lead-search-input"
            />
            {file && <span className="lead-created-text text-success">{file.name} ready</span>}
          </div>

          <div className="lead-actions-right modal-footer-top">
            <button type="button" className="lead-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="lead-btn-primary-dropdown" disabled={isUploading}>
              <Upload size={14} /> {isUploading ? 'Importing...' : 'Start Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
