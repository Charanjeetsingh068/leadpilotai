import React from 'react';
import { X, FileText, Bot, CheckCircle, Clock } from 'lucide-react';
import { FacebookFormItem } from '@/types/facebook.types';

interface Props {
  form: FacebookFormItem | null;
  onClose: () => void;
}

export const FormPreviewModal: React.FC<Props> = ({ form, onClose }) => {
  if (!form) return null;

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div className="fb-modal-header-left">
            <FileText className="text-brand-blue" size={20} />
            <h3 className="fb-modal-title">{form.name}</h3>
          </div>
          <button type="button" className="fb-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="fb-modal-body">
          <div className="fb-form-preview-grid">
            <div className="fb-fp-row">
              <span className="fb-fp-label">Form ID:</span>
              <span className="fb-fp-value font-mono">{form.formId}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Connected Page:</span>
              <span className="fb-fp-value">{form.pageName}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Campaign:</span>
              <span className="fb-fp-value">{form.campaign || 'Performance Ads 2025'}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Leads Captured:</span>
              <span className="fb-fp-value font-semibold text-brand-blue">{form.leadCount.toLocaleString()}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Assigned AI Agent:</span>
              <span className="fb-fp-value">{form.assignedAiAgent?.name || 'Villas Specialist AI'}</span>
            </div>
          </div>

          <div className="fb-fp-fields-section">
            <h4 className="fb-fp-section-title">Form Question Schema</h4>
            <div className="fb-fp-field-item">1. Full Name (System Field)</div>
            <div className="fb-fp-field-item">2. Phone Number (System Field)</div>
            <div className="fb-fp-field-item">3. Email Address (System Field)</div>
            <div className="fb-fp-field-item">4. Preferred Property Type (Custom Field)</div>
            <div className="fb-fp-field-item">5. Budget Range (Custom Field)</div>
          </div>
        </div>

        <div className="fb-modal-footer">
          <button type="button" className="fb-btn-secondary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
