import React from 'react';
import { Building, CheckCircle2, ExternalLink, ChevronDown } from 'lucide-react';
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
    businesses[0] || {
      id: 'b1',
      businessId: '987654321098765',
      name: 'LeadPilot Marketing',
      hasFullAccess: true,
    };

  return (
    <div className="fb-card fb-business-card">
      <h3 className="fb-card-title">3. Business Manager</h3>
      <p className="fb-card-subtitle">
        Select the Business Manager whose assets you want to manage.
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
            <option value="987654321098765">
              LeadPilot Marketing (ID: 987654321098765)
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

      <div className="fb-business-access-status">
        <div className="fb-access-message">
          <CheckCircle2 size={16} className="text-success-icon" />
          <span>You have full access to this business.</span>
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
    </div>
  );
};
