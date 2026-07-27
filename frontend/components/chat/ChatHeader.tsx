import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bot, UserCheck, ExternalLink, Phone } from 'lucide-react';
import Link from 'next/link';

export interface ChatHeaderProps {
  leadId: string;
  leadName: string;
  leadPhone: string;
  isAiAutomated: boolean;
  leadScore?: number;
  onToggleAi: () => void;
  isToggling?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  leadId,
  leadName,
  leadPhone,
  isAiAutomated,
  leadScore = 85,
  onToggleAi,
  isToggling = false,
}) => {
  return (
    <div className="chat-room-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar name={leadName} size="sm" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ margin: 0 }}>{leadName}</h4>
            <Badge variant="neutral" label={`Score ${leadScore}`} />
          </div>
          <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Phone size={12} /> {leadPhone}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Button
          variant={isAiAutomated ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={isAiAutomated ? <Bot size={16} style={{ color: 'var(--color-success-main)' }} /> : <UserCheck size={16} />}
          onClick={onToggleAi}
          isLoading={isToggling}
        >
          {isAiAutomated ? 'AI Auto-Pilot Active' : 'Human Takeover Active'}
        </Button>

        <Link href={`/lead/${leadId}`} className="btn btn-outline btn-sm" title="View Profile">
          <ExternalLink size={14} />
          Profile
        </Link>
      </div>
    </div>
  );
};
