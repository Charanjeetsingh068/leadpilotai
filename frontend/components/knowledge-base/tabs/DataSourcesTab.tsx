'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Database } from 'lucide-react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const DataSourcesTab: React.FC<Props> = ({ agentId }) => {
  const [dataSources, setDataSources] = useState<any[]>([]);

  const loadDataSources = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getDataSources({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setDataSources(res.data);
      }
    } catch {
      toast.error('Failed to load data sources');
    }
  }, [agentId]);

  useEffect(() => {
    loadDataSources();
  }, [loadDataSources]);

  return (
    <div className="agent-card-section">
      <h3 className="agent-section-title mb-2">Connected Enterprise Data Sources</h3>
      <p className="text-xs text-slate-500 mb-3">Sync live product inventory, CRM databases, Google Drive, and PostgreSQL.</p>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Type</th>
              <th>Auto Sync</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map((source) => (
              <tr key={source.id}>
                <td className="font-semibold text-slate-800 flex-cell">
                  <Database size={16} className="text-blue" />
                  <span>{source.name}</span>
                </td>
                <td><span className="kb-type-badge pdf">{source.type}</span></td>
                <td className="text-xs text-slate-600">{source.autoSyncSchedule}</td>
                <td><span className="kb-status-badge indexed">{source.status}</span></td>
                <td className="text-right">
                  <button type="button" className="btn-agent-secondary-action text-xs">Sync Now</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
