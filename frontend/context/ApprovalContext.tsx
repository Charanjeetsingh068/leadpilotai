'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApprovalService, ApprovalItem, ApprovalActivity } from '@/services/approval.service';
import toast from 'react-hot-toast';

interface ApprovalStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  avgTime: string;
}

interface ApprovalContextType {
  approvals: ApprovalItem[];
  activities: ApprovalActivity[];
  selectedApproval: ApprovalItem | null;
  isLoading: boolean;
  stats: ApprovalStats;
  selectApproval: (id: string) => void;
  approveApproval: (id: string) => Promise<void>;
  rejectApproval: (id: string, reason: string) => Promise<void>;
  editAndSendApproval: (id: string, replyText: string) => Promise<void>;
  assignSalesperson: (id: string, salesUserId: string, name: string) => Promise<void>;
  pauseAiAgent: (id: string) => Promise<void>;
  refreshQueue: () => Promise<void>;
}

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

export const ApprovalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [activities, setActivities] = useState<ApprovalActivity[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<ApprovalStats>({
    pendingCount: 14,
    approvedCount: 23,
    rejectedCount: 5,
    avgTime: '18m 24s',
  });

  const refreshQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const [apprRes, actRes] = await Promise.all([
        ApprovalService.getApprovals(),
        ApprovalService.getActivities(),
      ]);

      if (apprRes.success && apprRes.data) {
        setApprovals(apprRes.data);
        if (apprRes.data.length > 0) {
          // Default to first item if none is selected
          setSelectedApproval((prev) => {
            if (prev) {
              const stillExists = apprRes.data?.find((a) => a.id === prev.id);
              if (stillExists) return stillExists;
            }
            return apprRes.data ? apprRes.data[0] : null;
          });
        }
      }

      if (actRes.success && actRes.data) {
        setActivities(actRes.data);
      }
    } catch (e) {
      toast.error('Failed to load approvals queue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const selectApproval = (id: string) => {
    const found = approvals.find((a) => a.id === id);
    if (found) {
      setSelectedApproval(found);
    }
  };

  const approveApproval = async (id: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    try {
      const res = await ApprovalService.approve(id);
      if (res.success) {
        toast.success(`Approved and sent to ${target.customerName}!`);
        
        // Remove from list
        setApprovals((prev) => prev.filter((a) => a.id !== id));
        
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingCount: Math.max(0, prev.pendingCount - 1),
          approvedCount: prev.approvedCount + 1,
        }));

        // Log activity
        const newActivity: ApprovalActivity = {
          id: `act-${Date.now()}`,
          customerName: target.customerName,
          action: 'approved',
          actorName: 'Neha Singh',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          details: `AI recommendation approved: ${target.aiRecommendation}`,
          timestamp: 'Today',
        };
        setActivities((prev) => [newActivity, ...prev]);

        // Auto select next item
        setApprovals((prevList) => {
          const remaining = prevList.filter((a) => a.id !== id);
          setSelectedApproval(remaining.length > 0 ? remaining[0] : null);
          return remaining;
        });
      }
    } catch {
      toast.error('Failed to approve request.');
    }
  };

  const rejectApproval = async (id: string, reason: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    try {
      const res = await ApprovalService.reject(id, reason);
      if (res.success) {
        toast.success(`Decision rejected. AI auto-pilot paused.`);
        
        setApprovals((prev) => prev.filter((a) => a.id !== id));
        
        setStats((prev) => ({
          ...prev,
          pendingCount: Math.max(0, prev.pendingCount - 1),
          rejectedCount: prev.rejectedCount + 1,
        }));

        const newActivity: ApprovalActivity = {
          id: `act-${Date.now()}`,
          customerName: target.customerName,
          action: 'rejected',
          actorName: 'Neha Singh',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          details: `Reason: ${reason}`,
          timestamp: 'Today',
        };
        setActivities((prev) => [newActivity, ...prev]);

        setApprovals((prevList) => {
          const remaining = prevList.filter((a) => a.id !== id);
          setSelectedApproval(remaining.length > 0 ? remaining[0] : null);
          return remaining;
        });
      }
    } catch {
      toast.error('Failed to reject request.');
    }
  };

  const editAndSendApproval = async (id: string, replyText: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    try {
      const res = await ApprovalService.editAndSend(id, replyText);
      if (res.success) {
        toast.success('Edited reply sent via WhatsApp!');
        
        setApprovals((prev) => prev.filter((a) => a.id !== id));
        
        setStats((prev) => ({
          ...prev,
          pendingCount: Math.max(0, prev.pendingCount - 1),
          approvedCount: prev.approvedCount + 1,
        }));

        const newActivity: ApprovalActivity = {
          id: `act-${Date.now()}`,
          customerName: target.customerName,
          action: 'approved',
          actorName: 'Neha Singh',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          details: `Edited reply sent: ${replyText.substring(0, 50)}...`,
          timestamp: 'Today',
        };
        setActivities((prev) => [newActivity, ...prev]);

        setApprovals((prevList) => {
          const remaining = prevList.filter((a) => a.id !== id);
          setSelectedApproval(remaining.length > 0 ? remaining[0] : null);
          return remaining;
        });
      }
    } catch {
      toast.error('Failed to send edited reply.');
    }
  };

  const assignSalesperson = async (id: string, salesUserId: string, name: string) => {
    try {
      const res = await ApprovalService.assignToSales(id, salesUserId);
      if (res.success) {
        toast.success(`Assigned to ${name}`);
        setApprovals((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  assignedTo: {
                    name,
                    avatarUrl:
                      name === 'Neha Singh'
                        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
                  },
                }
              : a
          )
        );
        setSelectedApproval((prev) =>
          prev && prev.id === id
            ? {
                ...prev,
                assignedTo: {
                  name,
                  avatarUrl:
                    name === 'Neha Singh'
                      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
                },
              }
            : prev
        );
      }
    } catch {
      toast.error('Failed to assign salesperson.');
    }
  };

  const pauseAiAgent = async (id: string) => {
    try {
      const res = await ApprovalService.pauseAi(id);
      if (res.success) {
        toast.success('AI automation paused for this lead.');
      }
    } catch {
      toast.error('Failed to pause AI.');
    }
  };

  return (
    <ApprovalContext.Provider
      value={{
        approvals,
        activities,
        selectedApproval,
        isLoading,
        stats,
        selectApproval,
        approveApproval,
        rejectApproval,
        editAndSendApproval,
        assignSalesperson,
        pauseAiAgent,
        refreshQueue,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  const context = useContext(ApprovalContext);
  if (!context) {
    throw new Error('useApproval must be used within an ApprovalProvider');
  }
  return context;
};
