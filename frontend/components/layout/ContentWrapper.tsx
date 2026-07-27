import React from 'react';

export interface ContentWrapperProps {
  children: React.ReactNode;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return <div className="page-content-wrapper">{children}</div>;
};
