import React from 'react';
import { Building, CheckCircle2, ExternalLink, ChevronDown, Layers, MessageSquare } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { FacebookBusinessItem } from '@/types/facebook.types';

interface Props {
  businesses: FacebookBusinessItem[];
  selectedBusinessId: string;
  onBusinessChange: (businessId: string) => void;
}

export const BusinessManagerCard: React.FC<Props> = ({
  businesses = [],
  selectedBusinessId,
  onBusinessChange,
}) => {
  const currentBusiness =
    businesses.find((b) => b.businessId === selectedBusinessId) ||
    businesses[0] || null;

  return (
    <div className="fb-card fb-business-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Business Portfolio</h3>
        {currentBusiness && (
          <span className="fb-status-pill status-active">
            {currentBusiness.verificationStatus || currentBusiness.verification || 'VERIFIED'}
          </span>
        )}
      </div>
      <p className="fb-card-subtitle">
        Select the Meta Business Portfolio whose assets you want to manage.
      </p>

      <div className="fb-business-select-wrapper">
        <div className="fb-select-icon-left">
          <Building size={18} className="text-muted" />
        </div>
        <select
          className="fb-business-select"
          value={selectedBusinessId}
          onChange={(e) => onBusinessChange(e.target.value)}
        >
          {businesses.length === 0 ? (
            <option value="">
              No Meta Business Portfolio Discovered
            </option>
          ) : (
            businesses.map((b) => (
              <option key={b.id} value={b.businessId}>
                {b.name} (ID: {b.businessId})
              </option>
            ))
          )}
        </select>
        <div className="fb-select-icon-right">
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>

      {currentBusiness ? (
        <>
          <div className="fb-business-assets-grid">
            <div className="fb-b-asset-item">
              <Layers size={14} className="text-brand-blue" />
              <span className="fb-b-asset-label">Owned Pages:</span>
              <span className="fb-b-asset-val">{currentBusiness.ownedPagesCount || 10}</span>
            </div>
            <div className="fb-b-asset-item">
              <InstagramIcon size={14} className="fb-ig-icon" />
              <span className="fb-b-asset-label">Owned Instagram:</span>
              <span className="fb-b-asset-val">{currentBusiness.ownedInstagramCount || 0}</span>
            </div>
            <div className="fb-b-asset-item">
              <MessageSquare size={14} className="fb-wa-icon" />
              <span className="fb-b-asset-label">Owned WhatsApp:</span>
              <span className="fb-b-asset-val">{currentBusiness.ownedWhatsAppCount || 0}</span>
            </div>
          </div>

          <div className="fb-business-access-status">
            <div className="fb-access-message">
              <CheckCircle2 size={16} className="text-success-icon" />
              <span>Full Access Verified</span>
            </div>
            <a
              href={`https://business.facebook.com/settings?business_id=${currentBusiness.businessId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fb-business-link"
            >
              <span>Manage Business Settings</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </>
      ) : (
        <div className="fb-table-empty-cell">
          No Meta Business Manager portfolios connected yet.
        </div>
      )}
    </div>
  );
};
