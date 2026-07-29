'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { OverviewTab } from '@/components/knowledge-base/tabs/OverviewTab';

export default function AgentKnowledgeOverviewPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <OverviewTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
