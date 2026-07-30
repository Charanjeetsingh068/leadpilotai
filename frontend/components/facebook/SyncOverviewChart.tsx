import React from 'react';

interface DayMetric {
  day: string;
  leads: string;
  heightClass: string;
}

export const SyncOverviewChart: React.FC = () => {
  const chartData: DayMetric[] = [
    { day: 'May 14', leads: '1.2K', heightClass: 'h-60' },
    { day: 'May 15', leads: '1.5K', heightClass: 'h-75' },
    { day: 'May 16', leads: '1.7K', heightClass: 'h-85' },
    { day: 'May 17', leads: '1.3K', heightClass: 'h-65' },
    { day: 'May 18', leads: '1.6K', heightClass: 'h-80' },
    { day: 'May 19', leads: '1.4K', heightClass: 'h-70' },
    { day: 'May 20', leads: '1.8K', heightClass: 'h-90' },
  ];

  return (
    <div className="fb-card fb-chart-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">8. Sync Overview (Last 7 Days)</h3>
      </div>

      <div className="fb-chart-legend-row">
        <div className="fb-legend-item">
          <span className="fb-legend-dot dot-blue" />
          <span>Leads Received</span>
        </div>
        <div className="fb-legend-item">
          <span className="fb-legend-dot dot-grey" />
          <span>Duplicates</span>
        </div>
        <div className="fb-legend-item">
          <span className="fb-legend-dot dot-red" />
          <span>Failed</span>
        </div>
      </div>

      <div className="fb-bar-chart-container">
        <div className="fb-bars-group">
          {chartData.map((d) => (
            <div key={d.day} className="fb-bar-column">
              <div className="fb-bar-stack">
                <span className="fb-bar-value-top">{d.leads}</span>
                <div className={`fb-bar-fill fill-blue ${d.heightClass}`} />
              </div>
              <span className="fb-bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
