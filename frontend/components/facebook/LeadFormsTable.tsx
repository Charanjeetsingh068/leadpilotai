import React from 'react';
import { RefreshCw } from 'lucide-react';
import { FacebookFormItem } from '@/types/facebook.types';

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
  const totalLeads = forms.reduce((sum, f) => sum + (f.leadCount || 0), 0);

  return (
    <div className="fb-card fb-forms-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">5. Lead Forms</h3>
        <div className="flex items-center gap-2">
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
              <th>Form Name</th>
              <th>Page</th>
              <th>Active</th>
              <th>Leads ({totalLeads})</th>
              <th>Last Sync</th>
              <th>Assigned AI Agent</th>
            </tr>
          </thead>
          <tbody>
            {forms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted">
                  No lead forms synced yet. Click "Sync Forms" to load forms from connected pages.
                </td>
              </tr>
            ) : (
              forms.map((f) => (
                <tr key={f.id}>
                  <td>
                    <div className="fb-cell-title-form" onClick={() => onPreviewForm(f)}>
                      {f.name}
                    </div>
                  </td>
                  <td>
                    <span className="fb-cell-muted">{f.pageName || f.facebookPage?.name || 'Luxury Villas'}</span>
                  </td>
                  <td>
                    <label className="fb-toggle-switch">
                      <input
                        type="checkbox"
                        checked={f.isActive}
                        onChange={(e) => onToggleActive?.(f.id, e.target.checked)}
                      />
                      <span className="fb-toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <span className="fb-leads-count-badge">{(f.leadCount || 0).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="fb-cell-muted">{f.lastSync || '2 min ago'}</span>
                  </td>
                  <td>
                    <select
                      className="fb-ai-agent-select"
                      value={f.assignedAiAgent?.id || 'PROP_ADVISOR_01'}
                      onChange={(e) => onAssignAiAgent(f.id, e.target.value)}
                    >
                      <option value="PROP_ADVISOR_01">Villas Specialist AI</option>
                      <option value="PROP_ADVISOR_02">Property Advisor AI</option>
                      <option value="COMMERCIAL_AI">Commercial AI</option>
                      <option value="INVESTMENT_AI">Investment AI</option>
                      <option value="none">No AI Agent (Manual)</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
