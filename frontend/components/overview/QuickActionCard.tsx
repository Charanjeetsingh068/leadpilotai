import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  onClick,
}) => {
  return (
    <div className="quick-action-box" onClick={onClick}>
      <div
        className="quick-action-icon-bg"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        {icon}
      </div>
      <div className="quick-action-content">
        <h4 className="quick-action-title">{title}</h4>
        <p className="quick-action-desc">{description}</p>
      </div>
      <ArrowRight size={14} className="text-muted arrow-icon-offset" />
    </div>
  );
};
