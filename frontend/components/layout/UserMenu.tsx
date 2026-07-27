'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || 'Client Admin';
  const userEmail = user?.email || 'admin@leadpilot.ai';
  const userRole = user?.role || 'CLIENT_ADMIN';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu-wrapper" ref={dropdownRef}>
      <button className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Avatar name={userName} size="sm" />
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block' }}>{userName}</span>
          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{userRole}</span>
        </div>
        <ChevronDown size={14} className="text-muted" />
      </button>

      {isOpen ? (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <p>{userName}</p>
            <span>{userEmail}</span>
          </div>

          <Link href="/profile" className="user-menu-item" onClick={() => setIsOpen(false)}>
            <UserIcon size={16} />
            <span>My Profile</span>
          </Link>

          <Link href="/settings" className="user-menu-item" onClick={() => setIsOpen(false)}>
            <Settings size={16} />
            <span>Account Settings</span>
          </Link>

          <button
            className="user-menu-item danger"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
