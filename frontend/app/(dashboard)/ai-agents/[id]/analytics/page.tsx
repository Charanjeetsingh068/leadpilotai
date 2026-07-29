'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AIAnalyticsView } from '@/components/analytics/AIAnalyticsView';

export default function AgentAnalyticsPage() {
  const params = useParams();
  const agentId = String(params.id || '');

  return <AIAnalyticsView agentId={agentId} />;
}
