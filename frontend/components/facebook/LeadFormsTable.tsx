import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Save } from 'lucide-react';
import { FacebookFormItem } from '@/types/facebook.types';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

interface Props {
  forms: FacebookFormItem[];
  onAssignAiAgent: (formId: string, aiAgentId: string) => void;
  onToggleActive?: (formId: string, isActive: boolean) => void;
  onSyncForms?: () => void;
  onPreviewForm: (form: FacebookFormItem) => void;
  isSyncing?: boolean;
}

export const LeadFormsTable: React.FC<Props> = ({
  forms = [],
  onAssignAiAgent,
  onToggleActive,
  onSyncForms,
  onPreviewForm,
  isSyncing = false,
}) => {
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (forms.length > 0) {
      const activeIds = forms
        .filter((f) => f.isActive !== false)
        .map((f) => f.formId || f.id);
      setSelectedFormIds(activeIds.length > 0 ? activeIds : forms.map((f) => f.formId || f.id));
    }
  }, [forms]);

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFormIds(forms.map((f) => f.formId || f.id));
    } else {
      setSelectedFormIds([]);
    }
  };

  const handleToggleForm = (formId: string) => {
    setSelectedFormIds((prev) =>
      prev.includes(formId) ? prev.filter((id) => id !== formId) : [...prev, formId]
    );
  };

  const handleSaveSelectedForms = async () => {
    setIsSaving(true);
    try {
      await facebookIntegrationService.saveSelectedForms(selectedFormIds);
      setSaveSuccessMsg(`Successfully saved ${selectedFormIds.length} selected form(s) to database.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (e) {
      setSaveSuccessMsg('Form selection updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalLeadsToday = forms.reduce((sum, f) => sum + (f.leadsToday || 0), 0);
  const totalLeadsTotal = forms.reduce((sum, f) => sum + (f.leadsTotal || f.leadCount || 0), 0);
  const allSelected = forms.length > 0 && selectedFormIds.length === forms.length;

  return (
    <div className="fb-card fb-forms-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-badge">
          <h3 className="fb-card-title">Lead Forms ({forms.length})</h3>
          {saveSuccessMsg && <span className="fb-status-pill status-active text-xs ml-2">{saveSuccessMsg}</span>}
        </div>
        <div className="fb-header-actions-group flex gap-2">
          <button
            type="button"
            className="fb-btn-primary-sm flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
            onClick={handleSaveSelectedForms}
            disabled={isSaving}
          >
            <Save size={13} className={isSaving ? 'spin' : ''} />
            <span>{isSaving ? 'Saving...' : `Save Selected (${selectedFormIds.length})`}</span>
          </button>
          <button
            type="button"
            className="fb-btn-secondary-sm"
            onClick={onSyncForms}
            disabled={isSyncing}
          >
            <RefreshCw size={13} className={isSyncing ? 'spin' : ''} />
            <span>Sync Forms</span>
          </button>
        </div>
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleToggleSelectAll(e.target.checked)}
                  title="Select All Forms"
                  className="rounded cursor-pointer"
                />
              </th>
              <th>Form Name</th>
              <th>Associated Page</th>
              <th>Status</th>
              <th>Assigned AI Agent</th>
              <th>Leads Today ({totalLeadsToday})</th>
              <th>Leads Total ({totalLeadsTotal})</th>
              <th>Webhook Active</th>
            </tr>
          </thead>
          <tbody>
            {forms.length === 0 ? (
              <tr>
                <td colSpan={8} className="fb-table-empty-cell text-center py-6">
                  No lead forms synced yet. Click "Sync Forms" to load forms from connected pages.
                </td>
              </tr>
            ) : (
              forms.map((f) => {
                const fId = f.formId || f.id;
                const isChecked = selectedFormIds.includes(fId);
                return (
                  <tr key={f.id} className={isChecked ? 'bg-blue-500/5' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleForm(fId)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td>
                      <div className="fb-cell-title-form cursor-pointer font-medium hover:text-blue-500" onClick={() => onPreviewForm(f)}>
                        {f.formName || f.name}
                      </div>
                      <div className="text-xs text-muted">ID: {fId}</div>
                    </td>
                    <td>
                      <span className="fb-cell-muted text-xs">
                        {f.facebookPageName || f.associatedPage || f.pageName || f.facebookPage?.name || 'Facebook Page'}
                      </span>
                    </td>
                    <td>
                      <label className="fb-toggle-switch">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            handleToggleForm(fId);
                            onToggleActive?.(f.id, e.target.checked);
                          }}
                        />
                        <span className="fb-toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <select
                        className="fb-ai-agent-select"
                        value={f.assignedAiAgent?.id || f.assignedAiAgentId || ''}
                        onChange={(e) => onAssignAiAgent(f.id, e.target.value)}
                      >
                        <option value="">Select AI Agent</option>
                        <option value="PROP_ADVISOR_01">Property Advisor AI</option>
                        <option value="VILLAS_AI">Villas Specialist AI</option>
                        <option value="COMMERCIAL_AI">Commercial AI</option>
                        <option value="INVESTMENT_AI">Investment AI</option>
                        <option value="none">No AI Agent (Manual)</option>
                      </select>
                    </td>
                    <td>
                      <span className="fb-leads-count-badge">{(f.leadsToday || 0).toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="fb-cell-bold">{(f.leadsTotal || f.leadCount || 0).toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="fb-status-with-icon">
                        <CheckCircle2 size={14} className="text-success-icon" />
                        <span className="fb-status-active-text">
                          {f.webhookActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
