import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { VersionsTab } from '@/components/knowledge-base/tabs/VersionsTab';

export default function GlobalKnowledgeVersionsPage() {
  return (
    <KnowledgeLayout>
      <VersionsTab />
    </KnowledgeLayout>
  );
}
