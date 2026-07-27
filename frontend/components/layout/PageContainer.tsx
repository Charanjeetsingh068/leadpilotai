import React from 'react';
import { PageHeader } from './PageHeader';
import { ContentWrapper } from './ContentWrapper';

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="page-container">
      {title ? <PageHeader title={title} subtitle={subtitle} action={action} /> : null}
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
};
