'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { TrainingTab } from '@/components/knowledge-base/tabs/TrainingTab';

export default function AgentKnowledgeTrainingPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <TrainingTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
