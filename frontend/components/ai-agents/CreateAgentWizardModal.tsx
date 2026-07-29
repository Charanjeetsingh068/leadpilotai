'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Bot, Sliders, BookOpen, Sparkles, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AgentClientService } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAgentWizardModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Real Estate',
    description: '',
    department: 'Sales & Support',
    model: 'GPT-4o',
    temperature: 0.7,
    maxTokens: 1000,
    connectedWhatsapp: '+91 98765 43210',
    knowledgeBaseName: 'Real Estate Standard Inventory',
    welcomeMessage: 'Hi! 👋 How can I help you find your dream property today?',
    autoApproval: false,
    confidenceThreshold: 80,
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 7));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Agent Name is required');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await AgentClientService.createAgent(formData);
      if (res.success) {
        toast.success('AI Agent created successfully!');
        onSuccess();
        onClose();
      }
    } catch {
      toast.error('Failed to create AI Agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="agent-modal-backdrop">
      <div className="agent-modal-container">
        
        {/* Header */}
        <div className="agent-modal-header">
          <div className="agent-modal-title-row">
            <div className="agent-modal-icon-box">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="agent-modal-title">Create New AI Agent</h2>
              <p className="agent-modal-subtitle">Step {step} of 7 — {getStepTitle(step)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="agent-modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="agent-wizard-progress-bar">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`agent-wizard-progress-step ${s === step ? 'active' : s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="agent-modal-body">
          {step === 1 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Basic Information & Persona</h3>
              <div className="agent-form-group">
                <label className="agent-form-label">Agent Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Property Advisor AI"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="agent-form-input"
                />
              </div>

              <div className="agent-form-grid-2">
                <div className="agent-form-group">
                  <label className="agent-form-label">Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="agent-form-select"
                  >
                    <option value="Real Estate">Real Estate</option>
                    <option value="Pharma">Pharma</option>
                    <option value="Education">Education</option>
                    <option value="Automobile">Automobile</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>

                <div className="agent-form-group">
                  <label className="agent-form-label">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="agent-form-input"
                  />
                </div>
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Agent Description & Objective</label>
                <textarea
                  placeholder="Describe what this AI agent does and its primary sales/support goal..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="agent-form-textarea"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Model Engine & Intelligence Config</h3>
              <div className="agent-form-grid-2">
                <div className="agent-form-group">
                  <label className="agent-form-label">LLM Model</label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="agent-form-select"
                  >
                    <option value="GPT-4o">GPT-4o (Recommended)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="agent-form-group">
                  <label className="agent-form-label">Creativity / Temperature ({formData.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="agent-form-range"
                  />
                </div>
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Max Token Limit per Response</label>
                <select
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  className="agent-form-select"
                >
                  <option value={500}>500 Tokens (Concise)</option>
                  <option value={1000}>1000 Tokens (Standard)</option>
                  <option value={2000}>2000 Tokens (Detailed)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Knowledge Base Attachment</h3>
              <div className="agent-form-group">
                <label className="agent-form-label">Knowledge Base Source</label>
                <input
                  type="text"
                  value={formData.knowledgeBaseName}
                  onChange={(e) => setFormData({ ...formData, knowledgeBaseName: e.target.value })}
                  className="agent-form-input"
                />
              </div>
              <div className="agent-kb-box">
                <BookOpen size={24} className="text-blue" />
                <div>
                  <h4 className="agent-kb-box-title">Attached Knowledge Pipeline</h4>
                  <p className="agent-kb-box-desc">PDF, DOCX, FAQs, and pricing catalogues will be indexed using vector embeddings for accurate RAG retrieval.</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Qualification Flow Engine</h3>
              <div className="agent-kb-box">
                <Sparkles size={24} className="text-purple" />
                <div>
                  <h4 className="agent-kb-box-title">Industry Standard Qualification Flow</h4>
                  <p className="agent-kb-box-desc">Auto-extracts intent, budget range, timeline, location preferences, and loan requirements.</p>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">WhatsApp Business Connection</h3>
              <div className="agent-form-group">
                <label className="agent-form-label">Connected WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.connectedWhatsapp}
                  onChange={(e) => setFormData({ ...formData, connectedWhatsapp: e.target.value })}
                  className="agent-form-input"
                />
              </div>
              <div className="agent-form-group">
                <label className="agent-form-label">Initial Welcome Message</label>
                <textarea
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  className="agent-form-textarea"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Human Approval & Escalation Rules</h3>
              <div className="agent-form-group-checkbox">
                <input
                  type="checkbox"
                  id="autoApproval"
                  checked={formData.autoApproval}
                  onChange={(e) => setFormData({ ...formData, autoApproval: e.target.checked })}
                  className="agent-checkbox"
                />
                <label htmlFor="autoApproval" className="agent-form-label mb-0">Enable Full Autopilot (Skip Human Approval Queue)</label>
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Escalation Confidence Threshold ({formData.confidenceThreshold}%)</label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={formData.confidenceThreshold}
                  onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                  className="agent-form-range"
                />
                <p className="agent-kb-box-desc mt-1">AI replies with confidence scores below {formData.confidenceThreshold}% will be routed to the Human Approval Queue.</p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="agent-wizard-step-content">
              <h3 className="agent-step-heading">Review & Launch AI Agent</h3>
              <div className="agent-review-summary">
                <div className="agent-review-row">
                  <span>Agent Name:</span> <strong>{formData.name || 'Untitled Agent'}</strong>
                </div>
                <div className="agent-review-row">
                  <span>Industry:</span> <strong>{formData.industry}</strong>
                </div>
                <div className="agent-review-row">
                  <span>Model Engine:</span> <strong>{formData.model}</strong>
                </div>
                <div className="agent-review-row">
                  <span>WhatsApp Number:</span> <strong>{formData.connectedWhatsapp}</strong>
                </div>
                <div className="agent-review-row">
                  <span>Confidence Threshold:</span> <strong>{formData.confidenceThreshold}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="agent-modal-footer">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn-agent-secondary">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 7 ? (
            <button type="button" onClick={handleNext} className="btn-agent-primary">
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="btn-agent-launch">
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Launch AI Agent'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

function getStepTitle(step: number): string {
  switch (step) {
    case 1: return 'Basic Persona';
    case 2: return 'LLM Model';
    case 3: return 'Knowledge Base';
    case 4: return 'Qualification Flow';
    case 5: return 'WhatsApp Connection';
    case 6: return 'Approval Rules';
    case 7: return 'Review & Launch';
    default: return '';
  }
}
