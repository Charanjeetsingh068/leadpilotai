'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Video } from 'lucide-react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const MediaTab: React.FC<Props> = ({ agentId }) => {
  const [mediaList, setMediaList] = useState<any[]>([]);

  const loadMedia = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getMedia({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setMediaList(res.data);
      }
    } catch {
      toast.error('Failed to load media items');
    }
  }, [agentId]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  return (
    <div className="agent-card-section">
      <h3 className="agent-section-title mb-2">Media &amp; Transcripts (OCR &amp; Audio)</h3>
      <p className="text-xs text-slate-500 mb-3">Processed images, videos, 3D floor plans, and audio transcripts.</p>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Media Title</th>
              <th>Type</th>
              <th>OCR / Transcript Preview</th>
              <th>Chunks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold text-slate-800 flex-cell">
                  {item.type === 'Image' ? <FileText size={16} className="text-blue" /> : <Video size={16} className="text-purple" />}
                  <span>{item.title}</span>
                </td>
                <td><span className={`kb-type-badge ${item.type === 'Image' ? 'excel' : 'video'}`}>{item.type}</span></td>
                <td className="text-xs text-slate-600 max-w-xs truncate">{item.ocrText}</td>
                <td className="font-bold">{item.chunksCount}</td>
                <td><span className="kb-status-badge indexed">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
