'use client';

import React from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import { User, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const ProfileMenu: React.FC = () => {
  const { profile, isProfileMenuOpen, toggleProfileMenu, closeProfileMenu } = useUserStore();
  const { logout } = useAuthStore();

  return (
    <div className="pos-relative">
      <button
        type="button"
        className="profile-avatar-btn"
        onClick={toggleProfileMenu}
        title={profile.name}
      >
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={36}
          height={36}
          className="profile-avatar-img"
        />
      </button>

      {isProfileMenuOpen ? (
        <div className="header-profile-dropdown-card">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-name">
              {profile.name}
            </div>
            <div className="profile-dropdown-email">
              {profile.email}
            </div>
          </div>

          <Link
            href="/settings"
            onClick={closeProfileMenu}
            className="profile-dropdown-link"
          >
            <User size={14} />
            <span>Profile Settings</span>
          </Link>

          <div
            onClick={() => {
              closeProfileMenu();
              logout();
            }}
            className="profile-dropdown-signout"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
