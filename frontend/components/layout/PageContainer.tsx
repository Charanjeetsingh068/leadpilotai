import React from 'react';
import { PageHeader } from './PageHeader';
import { ContentWrapper } from './ContentWrapper';

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  fluid?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  children,
  fluid = false,
}) => {
  return (
    <div className={`page-container ${fluid ? 'fluid' : ''}`}>
      {title ? <PageHeader title={title} subtitle={subtitle} action={action} /> : null}
      <ContentWrapper fluid={fluid}>{children}</ContentWrapper>
    </div>
  );
};
