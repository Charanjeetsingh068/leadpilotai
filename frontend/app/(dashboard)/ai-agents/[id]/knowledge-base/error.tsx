'use client';

import React from 'react';

export default function AgentKnowledgeError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
      <h3 className="text-lg font-bold text-red-600 mb-2">Agent Knowledge Base Error</h3>
      <p className="text-sm text-slate-600 mb-4">{error?.message || 'Failed to load Knowledge Engine data for this AI Agent.'}</p>
      <button type="button" onClick={() => reset()} className="btn-agent-create-primary">
        Try Again
      </button>
    </div>
  );
}
