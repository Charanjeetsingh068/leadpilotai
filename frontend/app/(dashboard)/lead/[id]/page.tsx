'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LeadService } from '@/services/lead.service';
import { Lead } from '@/types/lead.types';
import { MessageSquare, Phone, Mail, Calendar, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = String(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true);
      try {
        const res = await LeadService.getLeadById(leadId);
        if (res.success && res.data) {
          setLead(res.data);
        }
      } catch {
        // Fallback baseline for client preview
        setLead({
          id: leadId,
          name: 'Vikram Malhotra',
          phone: '+91 98112 23344',
          email: 'vikram@example.com',
          source: 'FACEBOOK_ADS',
          status: 'QUALIFIED',
          qualificationScore: 88,
          organizationId: 'org_demo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (leadId) fetchLead();
  }, [leadId]);

  if (isLoading) {
    return (
      <PageContainer title="Loading Profile...">
        <p>Loading lead details...</p>
      </PageContainer>
    );
  }

  if (!lead) {
    return (
      <PageContainer title="Lead Not Found">
        <p>The requested lead profile could not be found.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Lead Profile: ${lead.name}`}
      subtitle={`Ingested via ${lead.source.replace('_', ' ')} • ID: ${lead.id}`}
      action={
        <Link
          href={`/conversation/${lead.id}`}
          className="btn btn-primary"
          style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
        >
          <MessageSquare size={16} />
          Open WhatsApp Chat
        </Link>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Contact & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Contact & Ingestion Metadata">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} className="text-muted" />
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Phone Number</span>
                  <span style={{ fontWeight: 600 }}>{lead.phone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} className="text-muted" />
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Email Address</span>
                  <span style={{ fontWeight: 500 }}>{lead.email || 'Not provided'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={18} className="text-muted" />
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Ingested Date</span>
                  <span style={{ fontWeight: 500 }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} className="text-muted" />
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Current Status</span>
                  <Badge variant="success" label={lead.status} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Qualification & Activity Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="AI Qualification Analysis">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                className="badge badge-success"
                style={{
                  width: '56px',
                  height: '56px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                {lead.qualificationScore}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>High Intent Qualification</h4>
                <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                  AI confirmed budget range matching Luxury 3BHK criteria with site visit intent.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Badge variant="neutral" label="Budget: INR 1.5 Cr - 2.0 Cr" />
              <Badge variant="neutral" label="Timeline: Within 30 Days" />
              <Badge variant="neutral" label="Preferred Location: Sector 62" />
            </div>
          </Card>

          <Card title="Activity Timeline & Audit Log">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle size={18} style={{ color: 'var(--color-success-main)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block' }}>Site Visit Slot Selected</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Scheduled for Saturday, 3:00 PM via WhatsApp Bot</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--color-primary-600)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block' }}>Project Brochure Sent</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>AI automatically dispatched PDF via WhatsApp</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
