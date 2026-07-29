'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Cpu } from 'lucide-react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const TrainingTab: React.FC<Props> = ({ agentId }) => {
  const [trainingJobs, setTrainingJobs] = useState<any[]>([]);

  const loadTrainingJobs = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getTrainingJobs({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setTrainingJobs(res.data);
      }
    } catch {
      toast.error('Failed to load training jobs');
    }
  }, [agentId]);

  useEffect(() => {
    loadTrainingJobs();
  }, [loadTrainingJobs]);

  const handleStartJob = async () => {
    try {
      const res = await KnowledgeClientService.reindexAll();
      if (res.success) {
        toast.success('Vector re-indexing training job queued!');
        loadTrainingJobs();
      }
    } catch {
      toast.error('Failed to start training job');
    }
  };

  return (
    <div className="agent-card-section">
      <div className="agent-toolbar-row mb-3">
        <div>
          <h3 className="agent-section-title mb-0">AI Training Center &amp; Vector Index Jobs</h3>
          <p className="text-xs text-slate-500">Monitor live vector embedding jobs, chunking, and GPU training progress.</p>
        </div>
        <button type="button" onClick={handleStartJob} className="btn-agent-create-primary">
          <Cpu size={15} />
          <span>Start Training Job</span>
        </button>
      </div>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Chunks Processed</th>
              <th>Embeddings</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trainingJobs.map((job) => (
              <tr key={job.id}>
                <td className="font-semibold text-slate-800">{job.jobName}</td>
                <td>{job.chunksProcessed.toLocaleString()} chunks</td>
                <td className="font-bold text-blue">{job.embeddingsGenerated.toLocaleString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="kb-used-bar-bg w-24"><div className="kb-used-bar-fill" style={{ width: `${job.progress}%` }} /></div>
                    <span className="text-xs font-bold">{job.progress}%</span>
                  </div>
                </td>
                <td><span className="kb-status-badge indexed">{job.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
