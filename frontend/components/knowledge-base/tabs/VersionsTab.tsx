'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const VersionsTab: React.FC<Props> = ({ agentId }) => {
  const [versions, setVersions] = useState<any[]>([]);

  const loadVersions = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getVersions({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setVersions(res.data);
      }
    } catch {
      toast.error('Failed to load version history');
    }
  }, [agentId]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  return (
    <div className="agent-card-section">
      <h3 className="agent-section-title mb-2">Knowledge Base Version History &amp; Audit Log</h3>
      <p className="text-xs text-slate-500 mb-3">Rollback or compare previous knowledge vector snapshots.</p>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Description</th>
              <th>Document Count</th>
              <th>Chunk Count</th>
              <th>Created By</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((ver) => (
              <tr key={ver.id}>
                <td className="font-bold text-blue">{ver.version}</td>
                <td className="text-slate-700">{ver.description}</td>
                <td>{ver.documentCount} docs</td>
                <td className="font-bold">{ver.chunkCount.toLocaleString()}</td>
                <td className="text-xs text-slate-500">{ver.createdBy}</td>
                <td className="text-right">
                  <button type="button" className="btn-agent-secondary-action text-xs">Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
