'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { MediaTab } from '@/components/knowledge-base/tabs/MediaTab';

export default function AgentKnowledgeMediaPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <MediaTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
