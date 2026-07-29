import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { FaqsTab } from '@/components/knowledge-base/tabs/FaqsTab';

export default function GlobalKnowledgeFaqsPage() {
  return (
    <KnowledgeLayout>
      <FaqsTab />
    </KnowledgeLayout>
  );
}
