'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ConversationsPage from '../page';
import { useConversationStore } from '@/store/useConversationStore';

export default function SingleConversationPage() {
  const params = useParams();
  const leadId = String(params.leadId || '');
  const { setActiveConversationId } = useConversationStore();

  useEffect(() => {
    if (leadId) {
      setActiveConversationId(leadId);
    }
  }, [leadId, setActiveConversationId]);

  return <ConversationsPage />;
}
