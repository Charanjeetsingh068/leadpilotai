'use client';

import React from 'react';
import { AgentProvider } from '@/context/AgentContext';

export default function AIAgentsLayout({ children }: { children: React.ReactNode }) {
  return <AgentProvider>{children}</AgentProvider>;
}
