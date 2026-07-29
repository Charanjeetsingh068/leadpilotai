'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { DocumentsTab } from '@/components/knowledge-base/tabs/DocumentsTab';

export default function AgentKnowledgeDocumentsPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return (
    <KnowledgeLayout agentId={agentId}>
      <DocumentsTab agentId={agentId} />
    </KnowledgeLayout>
  );
}
