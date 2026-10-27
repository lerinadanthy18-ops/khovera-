import { useState } from 'react';
import { ClipboardCheck, ExternalLink, Info, Tag, CheckCircle, AlertCircle, Clock, Lock, MessageSquare } from 'lucide-react';
import { useSubmissions, type Submission } from '@/context/SubmissionContext';
import { challenges } from '@/data/challenges';

interface ReviewState {
  checklist: Record<string, boolean>;
  feedback: string;
  error: string | null;
}

interface SuccessToast {
  id: number;
  message: string;
}

export default function TeacherReview() {
  const { submissions, reviewSubmission } = useSubmissions();
  const [reviewStates, setReviewStates] = useState<Record<string, ReviewState>>({});
  const [successToast, setSuccessToast] = useState<SuccessToast | null>(null);

  const pending = submissions.filter((s) => s.status === 'Pending Review');

  const getReviewState = (subId: string, checklistItems: string[]): ReviewState => {
    if (!reviewStates[subId]) {
      const initialChecks: Record<string, boolean> = {};
      checklistItems.forEach((_, i) => { initialChecks[i] = false; });
      return { checklist: initialChecks, feedback: '', error: null };
    }
    return reviewStates[subId];
  };

  const updateChecklist = (subId: string, index: number, checked: boolean) => {
    setReviewStates((prev) => ({
      ...prev,
      [subId]: {
        ...getReviewState(subId, getChecklist(subId)),
        checklist: { ...getReviewState(subId, getChecklist(subId)).checklist, [index]: checked },
        error: null,
      },
    }));
  };

  const updateFeedback = (subId: string, feedback: string) => {
    setReviewStates((prev) => ({
      ...prev,
      [subId]: {
        ...getReviewState(subId, getChecklist(subId)),
        feedback,
        error: null,
      },
    }));
  };

  const getChecklist = (sub: Submission | string): string[] => {
    let challengeId: string;
    if (typeof sub === 'string') {
      const found = submissions.find((s) => s.id === sub);
      challengeId = found?.challengeId ?? '';
    } else {
      challengeId = sub.challengeId;
    }
    const challenge = challenges.find((c) => c.id === challengeId);
    return challenge?.instructions.teacherChecklist ?? [];
  };

  const handleApprove = (sub: Submission) => {
    const checklistItems = getChecklist(sub);
    const state = getReviewState(sub.id, checklistItems);
    const allChecked = checklistItems.every((_, i) => state.checklist[i]);
    if (!allChecked) {
      setReviewStates((prev) => ({
        ...prev,
        [sub.id]: { ...state, error: 'All checklist items must be checked before approving.' },
      }));
      return;
    }
    if (!state.feedback.trim()) {
      setReviewStates((prev) => ({
        ...prev,
        [sub.id]: { ...state, error: 'Written feedback is required before approving.' },
      }));
      return;
    }
    reviewSubmission(sub.id, 'Demo Approved', state.feedback.trim());
    setReviewStates((prev) => {
      const next = { ...prev };
      delete next[sub.id];
      return next;
    });
    showSuccessToast('Submission approved and saved.');
  };

  const handleRequestChanges = (sub: Submission) => {
    const state = getReviewState(sub.id, getChecklist(sub));
    if (!state.feedback.trim()) {
      setReviewStates((prev) => ({
        ...prev,
        [sub.id]: { ...state, error: 'Written feedback is required to request changes.' },
      }));
      return;
    }
    reviewSubmission(sub.id, 'Changes Requested', state.feedback.trim());
    setReviewStates((prev) => {
      const next = { ...prev };
      delete next[sub.id];
      return next;
    });
    showSuccessToast('Changes requested and feedback saved.');
  };

  const showSuccessToast = (message: string) => {
    const toast = { id: Date.now(), message };
    setSuccessToast(toast);
    setTimeout(() => {
      setSuccessToast((prev) => (prev && prev.id === toast.id ? null : prev));
    }, 2500);
  };

  return (
    <div className="view-enter">
      <header className="main-header">
        <p className="page-breadcrumb">Demo Teacher Review</p>
        <h1 className="welcome-heading">Review pending submissions</h1>
        <p className="welcome-desc">
          Review each pending submission using the challenge's checklist. Approve a submission only when
          every checklist item is met and written feedback is provided.
        </p>
      </header>

      <div className="review-demo-banner">
        <Info />
        Demo only — this screen simulates teacher review. It is not authenticated verification. Review actions are saved in this browser.
      </div>

      {successToast && (
        <div className="success-toast" role="status">
          <CheckCircle />
          {successToast.message}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="placeholder-view">
          <div className="placeholder-icon">
            <ClipboardCheck />
          </div>
          <h3 className="placeholder-title">No pending submissions</h3>
          <p className="placeholder-text">
            Submissions awaiting review will appear here. Submit work from the Skill Challenges page first.
          </p>
        </div>
      ) : (
        <div className="review-list">
          {pending.map((sub) => {
            const checklistItems = getChecklist(sub);
            const state = getReviewState(sub.id, checklistItems);
            return (
              <div key={sub.id} className="review-card">
                <div className="review-card-header">
                  <div>
                    <span className={`challenge-tag ${sub.categoryTagClass}`}>
                      <Tag style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                      {sub.challengeCategory}
                    </span>
                    <h3 className="review-card-title">{sub.challengeTitle}</h3>
                    
                    <span className="submission-footer-sep">&middot;</span>
                    <span className="review-submitted">Submitted {sub.submittedAt}</span>
                  </div>
                  <span className="status-badge pending">
                    <Clock />
                    Pending Review
                  </span>
                </div>

                <div className="review-card-body">
                  <div className="submission-field">
                    <span className="submission-field-label">Submitted work description</span>
                    <p className="submission-field-text">{sub.description}</p>
                  </div>

                  <div className="submission-field">
                    <span className="submission-field-label">Reflection</span>
                    <p className="submission-field-text">{sub.reflection}</p>
                  </div>

                  <div className="submission-field">
                    <span className="submission-field-label">Evidence link</span>
                    <a href={sub.evidenceLink} target="_blank" rel="noopener noreferrer" className="submission-evidence-link">
                      <ExternalLink />
                      {sub.evidenceLink}
                    </a>
                  </div>
                </div>

                <div className="review-checklist-section">
                  <h4 className="review-section-title">
                    <CheckCircle style={{ width: 16, height: 16, display: 'inline', marginRight: 6, verticalAlign: '-2px', color: 'var(--gold)' }} />
                    Review checklist
                  </h4>
                  <ul className="checklist-list">
                    {checklistItems.map((item, i) => (
                      <li key={i}>
                        <label className="review-checklist-item">
                          <input
                            type="checkbox"
                            checked={!!state.checklist[i]}
                            onChange={(e) => updateChecklist(sub.id, i, e.target.checked)}
                          />
                          <span className="review-checklist-box" />
                          <span>{item}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="review-feedback-section">
                  <label className="form-label">
                    <MessageSquare />
                    Written feedback
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Write feedback for the student…"
                    value={state.feedback}
                    onChange={(e) => updateFeedback(sub.id, e.target.value)}
                  />
                </div>

                {state.error && (
                  <p className="review-error">
                    <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                    {state.error}
                  </p>
                )}

                <div className="review-actions">
                  <button
                    className="review-btn review-btn-changes"
                    onClick={() => handleRequestChanges(sub)}
                  >
                    <AlertCircle />
                    Request Changes
                  </button>
                  <button
                    className="review-btn review-btn-approve"
                    onClick={() => handleApprove(sub)}
                  >
                    <CheckCircle />
                    Approve Demo Submission
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="review-lock-note">
        <Lock style={{ width: 14, height: 14, flexShrink: 0 }} />
        Once a submission is approved or sent back for changes, it cannot be reviewed again from this page. Reviews are saved in this browser until you reset demo data.
      </div>
    </div>
  );
}
