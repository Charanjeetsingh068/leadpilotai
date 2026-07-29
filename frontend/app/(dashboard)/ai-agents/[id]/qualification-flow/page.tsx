'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { QualificationFlowBuilderView } from '@/components/qualification-flow/QualificationFlowBuilderView';

export default function AgentQualificationFlowPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return <QualificationFlowBuilderView agentId={agentId} />;
}
