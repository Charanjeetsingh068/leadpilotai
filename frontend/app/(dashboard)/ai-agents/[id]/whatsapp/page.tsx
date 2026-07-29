'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { WhatsAppAutomationView } from '@/components/whatsapp/WhatsAppAutomationView';

export default function AgentWhatsAppAutomationPage() {
  const params = useParams();
  const agentId = (params?.id as string) || '';

  return <WhatsAppAutomationView agentId={agentId} />;
}
