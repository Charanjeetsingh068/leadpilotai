import React from 'react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {title ? (
          <div className="drawer-header">
            <h3>{title}</h3>
            <button className="btn-close" onClick={onClose}>&times;</button>
          </div>
        ) : null}
        <div className="drawer-body">{children}</div>
      </div>
    </>
  );
};
