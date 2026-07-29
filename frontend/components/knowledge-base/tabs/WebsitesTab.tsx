'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Globe } from 'lucide-react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const WebsitesTab: React.FC<Props> = ({ agentId }) => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>('');

  const loadWebsites = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getWebsites({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setWebsites(res.data);
      }
    } catch {
      toast.error('Failed to load websites');
    }
  }, [agentId]);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebsiteUrl.trim()) return;
    try {
      const res = await KnowledgeClientService.addWebsite({
        agentId,
        url: newWebsiteUrl,
        depth: 3,
      });
      if (res.success) {
        toast.success('Website added and queued for crawling & vector indexing!');
        setNewWebsiteUrl('');
        loadWebsites();
      }
    } catch {
      toast.error('Failed to add website');
    }
  };

  return (
    <div className="agent-card-section">
      <h3 className="agent-section-title mb-2">Website Crawler &amp; URL Training</h3>
      <p className="text-xs text-slate-500 mb-3">Input your company website URL to automatically crawl pages and train AI.</p>

      <form onSubmit={handleAddWebsite} className="flex gap-2 mb-4">
        <input
          type="url"
          placeholder="https://sunshinevillas.com/inventory"
          value={newWebsiteUrl}
          onChange={(e) => setNewWebsiteUrl(e.target.value)}
          className="agent-search-input flex-1"
          required
        />
        <button type="submit" className="btn-agent-create-primary">
          <Globe size={15} />
          <span>Scan &amp; Train Website</span>
        </button>
      </form>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Website URL</th>
              <th>Pages</th>
              <th>Chunks</th>
              <th>Status</th>
              <th>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {websites.map((site) => (
              <tr key={site.id}>
                <td className="font-semibold text-blue flex-cell">
                  <Globe size={16} />
                  <span>{site.url}</span>
                </td>
                <td>{site.pagesCount} pages</td>
                <td className="font-bold">{site.chunksCount}</td>
                <td><span className="kb-status-badge indexed">{site.status}</span></td>
                <td className="text-xs text-slate-500">
                  {new Date(site.lastSyncAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
