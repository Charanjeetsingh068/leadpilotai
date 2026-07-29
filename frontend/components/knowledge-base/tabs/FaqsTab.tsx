'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KnowledgeClientService } from '@/services/knowledge.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const FaqsTab: React.FC<Props> = ({ agentId }) => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showFaqModal, setShowFaqModal] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newFaqCategory, setNewFaqCategory] = useState<string>('Pricing');

  const loadFaqs = useCallback(async () => {
    try {
      const res = await KnowledgeClientService.getFaqs({ agentId });
      if (res.success && Array.isArray(res.data)) {
        setFaqs(res.data);
      }
    } catch {
      toast.error('Failed to load FAQs');
    }
  }, [agentId]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Please enter both question and answer');
      return;
    }
    try {
      const res = await KnowledgeClientService.createFaq({
        agentId,
        question: newQuestion,
        answer: newAnswer,
        category: newFaqCategory,
        priority: 'High',
      });
      if (res.success) {
        toast.success('FAQ created & vector indexed!');
        setShowFaqModal(false);
        setNewQuestion('');
        setNewAnswer('');
        loadFaqs();
      }
    } catch {
      toast.error('Failed to create FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await KnowledgeClientService.deleteFaq(id);
      if (res.success) {
        toast.success('FAQ deleted');
        loadFaqs();
      }
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="agent-card-section">
      <div className="agent-toolbar-row mb-3">
        <div>
          <h3 className="agent-section-title mb-0">Frequently Asked Questions (FAQs)</h3>
          <p className="text-xs text-slate-500">Add questions and answers to train AI responses instantly.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowFaqModal(true)}
          className="btn-agent-create-primary"
        >
          <Plus size={15} />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="kb-documents-table-wrapper">
        <table className="kb-documents-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Confidence</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>
                  <div className="font-bold text-slate-800">{faq.question}</div>
                  <div className="text-xs text-slate-500 mt-1">{faq.answer}</div>
                </td>
                <td><span className="kb-type-badge pdf">{faq.category}</span></td>
                <td><span className="font-semibold text-xs text-orange">{faq.priority}</span></td>
                <td><span className="font-bold text-xs text-green">{faq.confidence || 98}%</span></td>
                <td><span className="kb-status-badge indexed">Active</span></td>
                <td className="text-right">
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="kb-action-icon-btn text-red-500"
                    title="Delete FAQ"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFaqModal && (
        <div className="agent-modal-overlay" onClick={() => setShowFaqModal(false)}>
          <div className="agent-modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Add New FAQ</h3>
              <button type="button" onClick={() => setShowFaqModal(false)} className="agent-modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleCreateFaq} className="p-4 flex flex-col gap-3">
              <div className="agent-form-group">
                <label className="agent-form-label">Question *</label>
                <input
                  type="text"
                  placeholder="e.g. What is the starting price for 3 BHK Sunshine Villas?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="agent-form-input"
                  required
                />
              </div>
              <div className="agent-form-group">
                <label className="agent-form-label">Answer *</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Starting price for 3 BHK is ₹1.45 Cr onwards..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="agent-form-textarea"
                  required
                />
              </div>
              <div className="agent-form-group">
                <label className="agent-form-label">Category</label>
                <select
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Pricing">Pricing</option>
                  <option value="Payment Plan">Payment Plan</option>
                  <option value="Legal">Legal</option>
                  <option value="Amenities">Amenities</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowFaqModal(false)} className="btn-agent-secondary-action">Cancel</button>
                <button type="submit" className="btn-agent-create-primary">Save &amp; Index FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
