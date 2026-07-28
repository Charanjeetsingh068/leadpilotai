'use client';

import React from 'react';
import { Activity, Bot, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ActivityLogTabProps {
  conversationId?: string;
}

export const ActivityLogTab: React.FC<ActivityLogTabProps> = () => {
  const logs = [
    {
      id: '1',
      time: '10:27 AM',
      type: 'AI_REPLY',
      actor: 'Property Advisor Agent (GPT-4o)',
      desc: 'Shared price range details for 2BHK options in Vijay Nagar and Scheme 78.',
      confidence: '98%',
      icon: <Bot size={16} className="icon-blue" />,
    },
    {
      id: '2',
      time: '10:26 AM',
      type: 'LEAD_INTENT',
      actor: 'Intent Recognition Model',
      desc: 'Identified customer preference: "2BHK in Indore near Vijay Nagar". Lead score updated to 85.',
      confidence: '95%',
      icon: <Activity size={16} className="icon-green" />,
    },
    {
      id: '3',
      time: '10:25 AM',
      type: 'WHATSAPP_WEBHOOK',
      actor: 'WhatsApp Cloud API',
      desc: 'Received incoming message from +91 98765 43210 (Rohit Sharma). Message status: SEEN.',
      confidence: '100%',
      icon: <CheckCircle2 size={16} className="icon-green" />,
    },
    {
      id: '4',
      time: '10:24 AM',
      type: 'AI_GREETING',
      actor: 'Property Advisor Agent',
      desc: 'Initiated automated conversation welcome template.',
      confidence: '99%',
      icon: <Bot size={16} className="icon-blue" />,
    },
    {
      id: '5',
      time: '10:23 AM',
      type: 'LEAD_ASSIGNMENT',
      actor: 'Auto Routing Engine',
      desc: 'Assigned lead to Salesperson Neha Singh (Client Admin monitored).',
      confidence: '100%',
      icon: <UserCheck size={16} className="icon-purple" />,
    },
  ];

  return (
    <div className="conv-activity-log-container">
      <div className="conv-activity-log-header">
        <h4 className="conv-activity-title">Real-time Activity & AI Execution Audit</h4>
        <span className="conv-activity-sub">All system events, Webhook payloads, and AI model decisions</span>
      </div>

      <div className="conv-activity-list">
        {logs.map((log) => (
          <div key={log.id} className="conv-activity-item">
            <div className="conv-activity-icon-col">
              <div className="conv-activity-icon-badge">{log.icon}</div>
              <div className="conv-activity-line" />
            </div>

            <div className="conv-activity-content">
              <div className="conv-activity-meta-row">
                <span className="conv-activity-actor">{log.actor}</span>
                <span className="conv-activity-badge">{log.type}</span>
                <span className="conv-activity-time">{log.time}</span>
              </div>
              <p className="conv-activity-desc">{log.desc}</p>
              <div className="conv-activity-foot">
                <span className="conv-confidence-tag">AI Confidence: <strong>{log.confidence}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
