import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { DataSourcesTab } from '@/components/knowledge-base/tabs/DataSourcesTab';

export default function GlobalKnowledgeDataSourcesPage() {
  return (
    <KnowledgeLayout>
      <DataSourcesTab />
    </KnowledgeLayout>
  );
}
