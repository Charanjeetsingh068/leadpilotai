'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

export const FacebookInsightsTab: React.FC = () => {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');

  const chartData = [
    { day: 'Mon', leads: 42, spend: 280, ctr: 6.2, reach: 12400 },
    { day: 'Tue', leads: 58, spend: 340, ctr: 6.8, reach: 15800 },
    { day: 'Wed', leads: 65, spend: 390, ctr: 7.1, reach: 18200 },
    { day: 'Thu', leads: 72, spend: 410, ctr: 7.4, reach: 21000 },
    { day: 'Fri', leads: 89, spend: 480, ctr: 8.2, reach: 24500 },
    { day: 'Sat', leads: 94, spend: 520, ctr: 8.6, reach: 28900 },
    { day: 'Sun', leads: 105, spend: 580, ctr: 9.1, reach: 31200 },
  ];

  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Meta Graph API Analytics & Insights</h3>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`fb-pill-btn ${period === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <div className="fb-metric-card">
          <div className="fb-metric-icon-box fb-icon-purple">
            <Users width={20} height={20} />
          </div>
          <div className="fb-metric-content">
            <span className="fb-metric-label">Avg Daily Leads</span>
            <span className="fb-metric-value">75</span>
            <span className="fb-metric-sub">+18.4% vs last week</span>
          </div>
        </div>

        <div className="fb-metric-card">
          <div className="fb-metric-icon-box fb-icon-blue">
            <DollarSign width={20} height={20} />
          </div>
          <div className="fb-metric-content">
            <span className="fb-metric-label">Total Spend</span>
            <span className="fb-metric-value">$3,000</span>
            <span className="fb-metric-sub">Across active campaigns</span>
          </div>
        </div>

        <div className="fb-metric-card">
          <div className="fb-metric-icon-box fb-icon-green">
            <TrendingUp width={20} height={20} />
          </div>
          <div className="fb-metric-content">
            <span className="fb-metric-label">Avg CTR</span>
            <span className="fb-metric-value">7.6%</span>
            <span className="fb-metric-sub">Above benchmark</span>
          </div>
        </div>

        <div className="fb-metric-card">
          <div className="fb-metric-icon-box fb-icon-cyan">
            <Target width={20} height={20} />
          </div>
          <div className="fb-metric-content">
            <span className="fb-metric-label">Cost Per Lead (CPL)</span>
            <span className="fb-metric-value">$5.71</span>
            <span className="fb-metric-sub">Optimized AI targeting</span>
          </div>
        </div>
      </div>

      {/* CHART BARS SIMULATION WITH GLOBAL CSS */}
      <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#ffffff' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
          Daily Lead Velocity (Last 7 Days)
        </h4>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          {chartData.map((item) => (
            <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>{item.leads}</span>
              <div
                style={{
                  width: '32px',
                  height: `${item.leads * 1.6}px`,
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                }}
              ></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
