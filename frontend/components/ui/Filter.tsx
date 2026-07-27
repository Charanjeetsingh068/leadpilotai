import React from 'react';

export interface FilterProps {
  title?: string;
  children: React.ReactNode;
  onReset?: () => void;
}

export const Filter: React.FC<FilterProps> = ({ title = 'Filters', children, onReset }) => {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h4>{title}</h4>
        {onReset ? (
          <button className="btn btn-ghost btn-sm" onClick={onReset}>
            Reset
          </button>
        ) : null}
      </div>
      <div className="filter-body">{children}</div>
    </div>
  );
};
