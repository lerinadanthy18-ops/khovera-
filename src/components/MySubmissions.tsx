import { useState } from 'react';
import {
  FileText, ExternalLink, Clock, Info, Tag, CheckCircle, AlertCircle, MessageSquare,
  Edit3, Link2, Lightbulb, Save, X, History,
} from 'lucide-react';
import { useSubmissions, type Submission, type SubmissionStatus } from '@/context/SubmissionContext';

const statusConfig: Record<SubmissionStatus, { icon: typeof Clock; className: string; label: string }> = {
  'Pending Review': { icon: Clock, className: 'pending', label: 'Pending Review' },
  'Demo Approved': { icon: CheckCircle, className: 'approved', label: 'Demo Approved' },
  'Changes Requested': { icon: AlertCircle, className: 'changes', label: 'Changes Requested' },
};

export default function MySubmissions() {
  const { submissions, resubmitSubmission } = useSubmissions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<{ id: number } | null>(null);

  return (
    <div className="view-enter">
      <header className="main-header">
        <p className="page-breadcrumb">My Submissions</p>
        <h1 className="welcome-heading">Your submitted work</h1>
        <p className="welcome-desc">
          A list of challenges you have submitted evidence for. Each item shows your description,
          evidence link, and reflection, along with the current review status and any teacher feedback.
        </p>
      </header>

      <div className="submission-demo-banner" style={{ marginBottom: '1.5rem' }}>
        <Info />
        Your submissions stay saved in this browser across refreshes and restarts. Use "Reset demo data" in the menu to clear everything.
      </div>

      {successToast && (
        <div className="success-toast" role="status">
          <CheckCircle />
          Resubmitted for review and saved.
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="placeholder-view">
          <div className="placeholder-icon">
            <FileText />
          </div>
          <h3 className="placeholder-title">No submissions yet</h3>
          <p className="placeholder-text">
            Open a challenge from the Dashboard or Skill Challenges page, then click "Try This Challenge"
            to submit your work. Your submissions will appear here with a "Pending Review" status.
          </p>
        </div>
      ) : (
        <div className="submission-list">
          {submissions.map((sub) => {
            const cfg = statusConfig[sub.status];
            const StatusIcon = cfg.icon;
            const isEditing = editingId === sub.id;
            return (
              <SubmissionCard
                key={sub.id}
                sub={sub}
                StatusIcon={StatusIcon}
                cfg={cfg}
                isEditing={isEditing}
                onEditToggle={() => setEditingId(isEditing ? null : sub.id)}
                onResubmit={(updates) => {
                  resubmitSubmission(sub.id, updates);
                  setEditingId(null);
                  const toast = { id: Date.now() };
                  setSuccessToast(toast);
                  setTimeout(() => {
                    setSuccessToast((prev) => (prev && prev.id === toast.id ? null : prev));
                  }, 2500);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SubmissionCardProps {
  sub: Submission;
  StatusIcon: typeof Clock;
  cfg: { className: string; label: string };
  isEditing: boolean;
  onEditToggle: () => void;
  onResubmit: (updates: { description: string; evidenceLink: string; reflection: string }) => void;
}

function SubmissionCard({ sub, StatusIcon, cfg, isEditing, onEditToggle, onResubmit }: SubmissionCardProps) {
  if (isEditing) {
    return <EditResubmitForm sub={sub} onCancel={onEditToggle} onResubmit={onResubmit} />;
  }

  return (
    <div className="submission-card">
      <div className="submission-card-header">
        <div>
          <span className={`challenge-tag ${sub.categoryTagClass}`}>
            <Tag style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
            {sub.challengeCategory}
          </span>
          <h3 className="submission-card-title">{sub.challengeTitle}</h3>
        </div>
        <span className={`status-badge ${cfg.className}`}>
          <StatusIcon />
          {cfg.label}
        </span>
      </div>

      <div className="submission-card-body">
        <div className="submission-field">
          <span className="submission-field-label">What you created</span>
          <p className="submission-field-text">{sub.description}</p>
        </div>

        <div className="submission-field">
          <span className="submission-field-label">What was difficult and what you changed</span>
          <p className="submission-field-text">{sub.reflection}</p>
        </div>

        <div className="submission-field">
          <span className="submission-field-label">Evidence link</span>
          <a href={sub.evidenceLink} target="_blank" rel="noopener noreferrer" className="submission-evidence-link">
            <ExternalLink />
            {sub.evidenceLink}
          </a>
        </div>

        {sub.reviewFeedback && (
          <div className="submission-field">
            <span className="submission-field-label">
              <MessageSquare style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px', color: 'var(--gold)' }} />
              Teacher feedback
            </span>
            <p className="submission-field-text submission-feedback-text">{sub.reviewFeedback}</p>
          </div>
        )}

        {sub.reviewHistory.length > 0 && (
          <div className="submission-field">
            <span className="submission-field-label">
              <History style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px', color: 'var(--gold)' }} />
              Review history
            </span>
            <div className="review-history-list">
              {sub.reviewHistory.map((entry, i) => {
                const histCfg = statusConfig[entry.status];
                const HistIcon = histCfg.icon;
                return (
                  <div key={i} className="review-history-entry">
                    <div className="review-history-meta">
                      <span className={`status-badge ${histCfg.className} review-history-badge`}>
                        <HistIcon />
                        {histCfg.label}
                      </span>
                      <span className="review-history-date">{entry.reviewedAt}</span>
                    </div>
                    <p className="review-history-feedback">{entry.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="submission-card-footer">
        
        <span className="submission-footer-sep">&middot;</span>
        Submitted {sub.submittedAt}
        {sub.resubmittedAt && (
          <>
            <span className="submission-footer-sep">&middot;</span>
            Resubmitted {sub.resubmittedAt}
          </>
        )}
        {sub.reviewedAt && !sub.resubmittedAt && (
          <>
            <span className="submission-footer-sep">&middot;</span>
            Reviewed {sub.reviewedAt}
          </>
        )}
      </div>

      {sub.status === 'Changes Requested' && (
        <div className="submission-card-actions">
          <button className="resubmit-btn" onClick={onEditToggle}>
            <Edit3 />
            Edit and Resubmit
          </button>
        </div>
      )}
    </div>
  );
}

interface EditResubmitFormProps {
  sub: Submission;
  onCancel: () => void;
  onResubmit: (updates: { description: string; evidenceLink: string; reflection: string }) => void;
}

function EditResubmitForm({ sub, onCancel, onResubmit }: EditResubmitFormProps) {
  const [evidenceLink, setEvidenceLink] = useState(sub.evidenceLink);
  const [description, setDescription] = useState(sub.description);
  const [reflection, setReflection] = useState(sub.reflection);
  const [errors, setErrors] = useState<{ link?: string; description?: string; reflection?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    const link = evidenceLink.trim();
    if (!link) {
      next.link = 'Please enter an evidence link.';
    } else if (!/^https?:\/\/.+/i.test(link)) {
      next.link = 'Link must start with http:// or https://';
    }
    if (!description.trim()) next.description = 'Please describe what you created.';
    if (!reflection.trim()) next.reflection = 'Please share what was difficult and what you changed.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onResubmit({
      description: description.trim(),
      evidenceLink: evidenceLink.trim(),
      reflection: reflection.trim(),
    });
  };

  return (
    <div className="submission-card resubmit-card">
      <div className="submission-form-header">
        <div className="submission-form-challenge">
          <div>
            <p className="submission-form-label">Editing and resubmitting</p>
            <h3 className="submission-form-challenge-title">{sub.challengeTitle}</h3>
          </div>
        </div>
        <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">
          <X />
        </button>
      </div>

      <div className="submission-demo-banner">
        <Info />
        Your resubmission stays saved in this browser. Use "Reset demo data" in the menu to clear everything.
      </div>

      {sub.reviewFeedback && (
        <div className="resubmit-prior-feedback">
          <span className="submission-field-label">
            <MessageSquare style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px', color: 'var(--gold)' }} />
            Previous reviewer feedback
          </span>
          <p className="submission-field-text submission-feedback-text">{sub.reviewFeedback}</p>
        </div>
      )}

      {sub.reviewHistory.length > 0 && (
        <div className="resubmit-prior-feedback">
          <span className="submission-field-label">
            <History style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px', color: 'var(--gold)' }} />
            Review history
          </span>
          <div className="review-history-list">
            {sub.reviewHistory.map((entry, i) => {
              const histCfg = statusConfig[entry.status];
              const HistIcon = histCfg.icon;
              return (
                <div key={i} className="review-history-entry">
                  <div className="review-history-meta">
                    <span className={`status-badge ${histCfg.className} review-history-badge`}>
                      <HistIcon />
                      {histCfg.label}
                    </span>
                    <span className="review-history-date">{entry.reviewedAt}</span>
                  </div>
                  <p className="review-history-feedback">{entry.feedback}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form className="submission-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="edit-evidence-link">
            <Link2 /> Evidence link
          </label>
          <input
            id="edit-evidence-link"
            type="url"
            className={`form-input ${errors.link ? 'error' : ''}`}
            placeholder="https://docs.google.com/... or https://your-link.com"
            value={evidenceLink}
            onChange={(e) => setEvidenceLink(e.target.value)}
          />
          {errors.link && (
            <span className="form-error"><AlertCircle /> {errors.link}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="edit-description">
            <FileText /> What did you create?
          </label>
          <textarea
            id="edit-description"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Describe what you made, how you approached it, and what it shows..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          {errors.description && (
            <span className="form-error"><AlertCircle /> {errors.description}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="edit-reflection">
            <Lightbulb /> What was difficult, and what did you change?
          </label>
          <textarea
            id="edit-reflection"
            className={`form-textarea ${errors.reflection ? 'error' : ''}`}
            placeholder="Share what you found tricky and any changes or improvements you made..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
          />
          {errors.reflection && (
            <span className="form-error"><AlertCircle /> {errors.reflection}</span>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="modal-btn-primary">
            <Save style={{ width: 16, height: 16, display: 'inline', marginRight: 6 }} />
            Resubmit for Review
          </button>
        </div>
      </form>
    </div>
  );
}
