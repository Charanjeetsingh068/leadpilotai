import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  isPositive,
  icon,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="stat-kpi-card">
      <div>
        <div className="stat-kpi-header">
          <div
            className="stat-icon-circle"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            {icon}
          </div>
          <span className="stat-title">{title}</span>
        </div>
        <div className="stat-value">{value}</div>
      </div>

      <div className={`stat-trend-bar ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
      </div>
    </div>
  );
};
