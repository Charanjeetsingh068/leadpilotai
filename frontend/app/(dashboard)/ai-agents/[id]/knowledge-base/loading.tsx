import React from 'react';

export default function AgentKnowledgeLoading() {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
      <p className="text-sm font-semibold text-slate-600">Loading Agent Knowledge Base &amp; Training Data...</p>
    </div>
  );
}
