'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { VersionsTab } from '@/components/knowledge-base/tabs/VersionsTab';

export default function AgentKnowledgeVersionsPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <VersionsTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
