import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LeadSourceIcon } from './LeadSourceIcon';
import { Lead } from '@/types/lead.types';
import { MessageSquare, ExternalLink, UserPlus } from 'lucide-react';
import Link from 'next/link';

export interface LeadPreviewDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (leadId: string) => void;
}

export const LeadPreviewDrawer: React.FC<LeadPreviewDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onAssign,
}) => {
  if (!lead) return null;

  const assignedUser = lead.assignedSalesUser?.name || 'Unassigned';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Lead Overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Profile Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <Avatar name={lead.name} size="lg" />
          <div>
            <h3 style={{ margin: 0 }}>{lead.name}</h3>
            <p className="text-muted" style={{ margin: '0.15rem 0 0 0' }}>{lead.phone}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <LeadSourceIcon source={lead.source} />
              <Badge variant="success" label={lead.status} />
            </div>
          </div>
        </div>

        {/* Lead Attributes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Project</span>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{lead.project || 'General Inquiry'}</span>
          </div>

          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>AI Score</span>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: lead.qualificationScore >= 70 ? 'var(--color-success-main)' : 'var(--color-text-main)' }}>
              {lead.qualificationScore} / 100
            </span>
          </div>

          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Assigned Sales Executive</span>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{assignedUser}</span>
          </div>

          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Created Date</span>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* AI Conversation Snippet */}
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
          <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            LAST AI CONVERSATION ACTIVITY
          </span>
          <p style={{ fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
            &ldquo;Hi {lead.name}, thank you for your interest in {lead.project || 'our project'}. Would you like to schedule a site visit this Saturday at 3:00 PM?&rdquo;
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          <Link href={`/conversation/${lead.id}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <MessageSquare size={16} />
            Open Conversation
          </Link>

          <Link href={`/lead/${lead.id}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <ExternalLink size={16} />
            Open Full Lead Profile
          </Link>

          {onAssign ? (
            <Button variant="secondary" onClick={() => onAssign(lead.id)} leftIcon={<UserPlus size={16} />}>
              Assign Sales Executive
            </Button>
          ) : null}
        </div>
      </div>
    </Drawer>
  );
};
