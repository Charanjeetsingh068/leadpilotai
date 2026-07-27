import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullPage = false, text }) => {
  const content = (
    <div className={`loader-spinner loader-${size}`}>
      {text ? <span>{text}</span> : null}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{content}</div>;
  }

  return content;
};
