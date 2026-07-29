'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface AgentContextType {
  currentAgent: AIAgentItem | null;
  agentsList: AIAgentItem[];
  isLoading: boolean;
  workspaceId: string;
  companyId: string;
  selectAgent: (agentId: string) => Promise<void>;
  refreshCurrentAgent: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode; initialAgentId?: string }> = ({
  children,
  initialAgentId,
}) => {
  const [currentAgent, setCurrentAgent] = useState<AIAgentItem | null>(null);
  const [agentsList, setAgentsList] = useState<AIAgentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const workspaceId = 'ws-acme-realestate-01';
  const companyId = 'comp-acme-01';

  const loadAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await AgentClientService.getAgents();
      if (res && res.success && Array.isArray(res.data)) {
        setAgentsList(res.data);

        // Determine current agent
        if (initialAgentId) {
          const match = res.data.find((a) => a.id === initialAgentId);
          if (match) {
            setCurrentAgent(match);
          } else if (res.data.length > 0) {
            setCurrentAgent(res.data[0]);
          }
        } else if (res.data.length > 0) {
          setCurrentAgent(res.data[0]);
        }
      }
    } catch {
      toast.error('Failed to initialize AI Agent Context');
    } finally {
      setIsLoading(false);
    }
  }, [initialAgentId]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const selectAgent = async (agentId: string) => {
    const match = agentsList.find((a) => a.id === agentId);
    if (match) {
      setCurrentAgent(match);
      toast.success(`Switched to agent: ${match.name}`);
    } else {
      try {
        const res = await AgentClientService.getAgentById(agentId);
        if (res && res.success && res.data) {
          setCurrentAgent(res.data);
          toast.success(`Switched to agent: ${res.data.name}`);
        }
      } catch {
        toast.error('Failed to load selected agent details');
      }
    }
  };

  const refreshCurrentAgent = async () => {
    if (!currentAgent) return;
    try {
      const res = await AgentClientService.getAgentById(currentAgent.id);
      if (res && res.success && res.data) {
        setCurrentAgent(res.data);
      }
    } catch {
      toast.error('Failed to refresh agent state');
    }
  };

  return (
    <AgentContext.Provider
      value={{
        currentAgent,
        agentsList,
        isLoading,
        workspaceId,
        companyId,
        selectAgent,
        refreshCurrentAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = (): AgentContextType => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};
