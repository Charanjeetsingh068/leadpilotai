'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import AIWhatsAppConversationPage from '../page';
import { useConversationStore } from '@/store/useConversationStore';

export default function SingleAIWhatsAppConversationPage() {
  const params = useParams();
  const leadId = String(params.leadId || '');
  const { setActiveConversationId } = useConversationStore();

  useEffect(() => {
    if (leadId) {
      setActiveConversationId(leadId);
    }
  }, [leadId, setActiveConversationId]);

  return <AIWhatsAppConversationPage />;
}
