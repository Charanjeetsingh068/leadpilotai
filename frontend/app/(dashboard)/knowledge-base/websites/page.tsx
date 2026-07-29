import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { WebsitesTab } from '@/components/knowledge-base/tabs/WebsitesTab';

export default function GlobalKnowledgeWebsitesPage() {
  return (
    <KnowledgeLayout>
      <WebsitesTab />
    </KnowledgeLayout>
  );
}
