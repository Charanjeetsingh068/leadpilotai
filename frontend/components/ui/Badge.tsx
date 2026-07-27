import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', label, dot = false }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {dot ? <span className="badge-dot" /> : null}
      {label}
    </span>
  );
};
