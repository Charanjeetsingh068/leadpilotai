'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart2,
  Bot,
  UserCheck,
  Mail,
  CheckCircle2,
  Clock,
  Calendar,
  Zap,
  Circle,
  FileCheck,
  UserPlus,
  PauseCircle,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ConversationRightWidgets: React.FC = () => {
  const overviewStats = [
    { label: 'Total Conversations', val: '23', icon: <BarChart2 size={15} className="text-blue" /> },
    { label: 'AI Active', val: '12', icon: <Bot size={15} className="text-green" /> },
    { label: 'Human Active', val: '3', icon: <UserCheck size={15} className="text-purple" /> },
    { label: 'Unread', val: '8', icon: <Mail size={15} className="text-blue" /> },
    { label: 'Qualified', val: '6', icon: <CheckCircle2 size={15} className="text-green" /> },
    { label: 'Pending Approval', val: '4', icon: <Clock size={15} className="text-orange" /> },
    { label: 'Site Visits Scheduled', val: '4', icon: <Calendar size={15} className="text-purple" /> },
    { label: 'Avg. Response Time', val: '2m 35s', icon: <Zap size={15} className="text-gold" /> },
  ];

  const recentActivities = [
    { id: '1', text: 'AI replied to Rohit Sharma', time: '2m ago', icon: <Circle size={12} className="text-blue" /> },
    { id: '2', text: 'Priya Verma replied', time: '5m ago', icon: <Mail size={12} className="text-green" /> },
    { id: '3', text: 'Conversation paused by Neha', time: '18m ago', icon: <PauseCircle size={12} className="text-orange" /> },
    { id: '4', text: 'Amit Kumar took over chat', time: '12m ago', icon: <UserCheck size={12} className="text-purple" /> },
    { id: '5', text: 'Lead qualified successfully', time: '45m ago', icon: <CheckCircle2 size={12} className="text-green" /> },
    { id: '6', text: 'Site visit booked for Sneha Iyer', time: '1h ago', icon: <Calendar size={12} className="text-purple" /> },
  ];

  return (
    <div className="conv-widgets-column">
      {/* Widget 1: Conversation Overview */}
      <div className="conv-widget-card">
        <div className="conv-widget-header">
          <div className="conv-widget-title-wrap">
            <BarChart2 size={16} className="text-blue" />
            <h3 className="conv-widget-title">Conversation Overview</h3>
          </div>
        </div>

        <div className="conv-overview-list">
          {overviewStats.map((item, idx) => (
            <div key={idx} className="conv-overview-row">
              <div className="conv-overview-left">
                {item.icon}
                <span className="conv-overview-label">{item.label}</span>
              </div>
              <span className="conv-overview-val">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Recent Activity */}
      <div className="conv-widget-card">
        <div className="conv-widget-header">
          <h3 className="conv-widget-title text-sm">Recent Activity</h3>
          <button type="button" className="conv-widget-link-btn">View all</button>
        </div>

        <div className="conv-activity-feed">
          {recentActivities.map((act) => (
            <div key={act.id} className="conv-activity-feed-item">
              <div className="conv-activity-left-group">
                {act.icon}
                <span className="conv-activity-feed-text">{act.text}</span>
              </div>
              <span className="conv-activity-feed-time">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Quick Actions */}
      <div className="conv-widget-card">
        <div className="conv-widget-header mb-xs">
          <h3 className="conv-widget-title text-sm">Quick Actions</h3>
        </div>

        <div className="conv-quick-actions-list">
          <Link href="/ai-whatsapp-conversation" className="conv-quick-btn">
            <Bot size={15} className="text-blue" />
            <span>Open AI Conversation</span>
          </Link>

          <button
            type="button"
            className="conv-quick-btn"
            onClick={() => toast.success('Reassigned to Salesperson')}
          >
            <UserPlus size={15} className="text-gray" />
            <span>Assign Salesperson</span>
          </button>

          <button
            type="button"
            className="conv-quick-btn"
            onClick={() => toast.success('AI Auto-reply Paused')}
          >
            <PauseCircle size={15} className="text-orange" />
            <span>Pause AI</span>
          </button>

          <button
            type="button"
            className="conv-quick-btn"
            onClick={() => toast.success('AI Auto-reply Resumed')}
          >
            <PlayCircle size={15} className="text-green" />
            <span>Resume AI</span>
          </button>

          <button
            type="button"
            className="conv-quick-btn"
            onClick={() => toast.success('Site Visit Booking Modal Opened')}
          >
            <Calendar size={15} className="text-purple" />
            <span>Book Site Visit</span>
          </button>

          <button
            type="button"
            className="conv-quick-btn"
            onClick={() => toast.success('AI Replies Approved')}
          >
            <CheckCircle size={15} className="text-green" />
            <span>Approve Replies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
