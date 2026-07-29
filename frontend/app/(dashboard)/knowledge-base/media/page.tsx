import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { MediaTab } from '@/components/knowledge-base/tabs/MediaTab';

export default function GlobalKnowledgeMediaPage() {
  return (
    <KnowledgeLayout>
      <MediaTab />
    </KnowledgeLayout>
  );
}
