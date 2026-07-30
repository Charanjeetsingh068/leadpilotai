import React from 'react';
import { X, ShieldCheck, RefreshCw } from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting?: boolean;
}

export const AddAccountModal: React.FC<Props> = ({ isOpen, onClose, onConnect, isConnecting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div className="fb-modal-header-left">
            <FacebookIcon className="fb-modal-icon" size={20} />
            <h3 className="fb-modal-title">Connect Facebook Account</h3>
          </div>
          <button type="button" className="fb-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="fb-modal-body">
          <p className="fb-modal-text">
            Authenticate your Meta account to connect Facebook Pages, Lead Forms, and Business Managers to LeadPilot AI.
          </p>

          <div className="fb-modal-permissions-box">
            <h4 className="fb-modal-perm-title">Permissions Requested:</h4>
            <ul className="fb-modal-perm-list">
              <li>✔ Access Lead Generation Forms (`leads_retrieval`)</li>
              <li>✔ View & Read Facebook Pages (`pages_show_list`, `pages_read_engagement`)</li>
              <li>✔ Access Business Manager assets (`business_management`)</li>
            </ul>
          </div>

          <div className="fb-modal-security">
            <ShieldCheck size={16} className="text-success-icon" />
            <span>LeadPilot AI uses encrypted OAuth 2.0. We never publish on your behalf.</span>
          </div>
        </div>

        <div className="fb-modal-footer">
          <button type="button" className="fb-btn-cancel" onClick={onClose} disabled={isConnecting}>
            Cancel
          </button>
          <button type="button" className="fb-btn-facebook-connect" onClick={onConnect} disabled={isConnecting}>
            {isConnecting ? <RefreshCw size={18} className="spin" /> : <FacebookIcon size={18} />}
            <span>{isConnecting ? 'Authenticating...' : 'Login with Facebook'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
