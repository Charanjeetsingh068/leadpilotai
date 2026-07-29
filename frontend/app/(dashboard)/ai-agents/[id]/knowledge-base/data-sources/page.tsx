'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { DataSourcesTab } from '@/components/knowledge-base/tabs/DataSourcesTab';

export default function AgentKnowledgeDataSourcesPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <DataSourcesTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
