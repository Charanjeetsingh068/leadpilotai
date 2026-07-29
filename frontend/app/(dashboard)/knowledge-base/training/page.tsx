import React from 'react';
import { KnowledgeLayout } from '@/components/knowledge-base/KnowledgeLayout';
import { TrainingTab } from '@/components/knowledge-base/tabs/TrainingTab';

export default function GlobalKnowledgeTrainingPage() {
  return (
    <KnowledgeLayout>
      <TrainingTab />
    </KnowledgeLayout>
  );
}
