import React from 'react';
import { X, FileText } from 'lucide-react';
import { FacebookFormItem } from '@/types/facebook.types';

interface Props {
  form: FacebookFormItem | null;
  onClose: () => void;
}

export const FormPreviewModal: React.FC<Props> = ({ form, onClose }) => {
  if (!form) return null;

  const totalLeads = form.leadsCount ?? form.leadCount ?? 0;
  const questionsList = form.questions && form.questions.length > 0
    ? form.questions
    : [
        { label: 'Full Name', type: 'FULL_NAME' },
        { label: 'Phone Number', type: 'PHONE' },
        { label: 'Email Address', type: 'EMAIL' },
      ];

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
              <span className="fb-fp-value font-mono">{form.formId || form.id}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Connected Page ID:</span>
              <span className="fb-fp-value">{form.pageId || form.associatedPage || 'Connected Page'}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Campaign / Status:</span>
              <span className="fb-fp-value">{form.status || 'ACTIVE'}</span>
            </div>
            <div className="fb-fp-row">
              <span className="fb-fp-label">Leads Captured:</span>
              <span className="fb-fp-value font-semibold text-brand-blue">{totalLeads.toLocaleString()}</span>
            </div>
          </div>

          <div className="fb-fp-fields-section">
            <h4 className="fb-fp-section-title">Form Question Schema</h4>
            {questionsList.map((q: any, idx: number) => (
              <div key={idx} className="fb-fp-field-item">
                {idx + 1}. {q.label || q.key || q.type} ({q.type || 'Custom Field'})
              </div>
            ))}
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
