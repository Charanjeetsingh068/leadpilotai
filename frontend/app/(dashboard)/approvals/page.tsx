import React from 'react';
import { ApprovalProvider } from '@/context/ApprovalContext';
import { ApprovalsView } from '@/components/approvals/ApprovalsView';

export default function ApprovalsPage() {
  return (
    <ApprovalProvider>
      <ApprovalsView />
    </ApprovalProvider>
  );
}
