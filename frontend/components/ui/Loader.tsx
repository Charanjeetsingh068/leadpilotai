import React from 'react';
import { Bot } from 'lucide-react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullPage = false, text }) => {
  const content = (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-brand-icon">
        <Bot size={22} className="loader-bot-icon" />
        <div className="loader-spinner" />
      </div>
      {text ? <span className="loader-text">{text}</span> : null}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{content}</div>;
  }

  return content;
};
