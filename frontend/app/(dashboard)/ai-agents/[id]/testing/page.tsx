'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AITestingPlaygroundView } from '@/components/testing/AITestingPlaygroundView';

export default function AgentTestingPage() {
  const params = useParams();
  const agentId = String(params.id || '');

  return <AITestingPlaygroundView agentId={agentId} />;
}
