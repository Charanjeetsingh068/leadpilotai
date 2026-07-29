'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { FaqsTab } from '@/components/knowledge-base/tabs/FaqsTab';

export default function AgentKnowledgeFaqsPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <FaqsTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
