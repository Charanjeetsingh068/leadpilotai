'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/dashboard" className="breadcrumb-item">
        Home
      </Link>
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const formattedLabel = segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={url}>
            <ChevronRight size={14} className="breadcrumb-separator" />
            {isLast ? (
              <span className="breadcrumb-item is-current">{formattedLabel}</span>
            ) : (
              <Link href={url} className="breadcrumb-item">
                {formattedLabel}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
