import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  style,
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '16px',
        borderRadius: borderRadius || 'var(--radius-sm)',
        ...style,
      }}
    />
  );
};

export const TableSkeletonRow: React.FC<{ columnsCount?: number }> = ({ columnsCount = 11 }) => {
  return (
    <tr>
      {Array.from({ length: columnsCount }).map((_, idx) => (
        <td key={idx} style={{ padding: '0.75rem 1rem' }}>
          <Skeleton height={20} />
        </td>
      ))}
    </tr>
  );
};
