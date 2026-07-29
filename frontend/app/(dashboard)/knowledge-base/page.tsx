import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { OverviewTab } from '@/components/knowledge-base/tabs/OverviewTab';

export default function GlobalKnowledgeOverviewPage() {
  return (
    <KnowledgeLayout>
      <OverviewTab />
    </KnowledgeLayout>
  );
}
