import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { DocumentsTab } from '@/components/knowledge-base/tabs/DocumentsTab';

export default function GlobalKnowledgeDocumentsPage() {
  return (
    <KnowledgeLayout>
      <DocumentsTab />
    </KnowledgeLayout>
  );
}
