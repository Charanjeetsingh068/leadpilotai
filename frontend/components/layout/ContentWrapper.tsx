import React from 'react';

export interface ContentWrapperProps {
  children: React.ReactNode;
  fluid?: boolean;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, fluid }) => {
  return <div className={`page-content-wrapper ${fluid ? 'fluid' : ''}`}>{children}</div>;
};
