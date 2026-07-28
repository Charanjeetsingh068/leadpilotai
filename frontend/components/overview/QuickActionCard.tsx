import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variantClass?: string;
  onClick?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  variantClass = 'stat-icon-blue',
  onClick,
}) => {
  return (
    <div className="quick-action-box" onClick={onClick}>
      <div className={`quick-action-icon-bg ${variantClass}`}>{icon}</div>
      <div className="quick-action-content">
        <h4 className="quick-action-title">{title}</h4>
        <p className="quick-action-desc">{description}</p>
      </div>
      <ArrowRight size={14} className="text-muted arrow-icon-offset" />
    </div>
  );
};
