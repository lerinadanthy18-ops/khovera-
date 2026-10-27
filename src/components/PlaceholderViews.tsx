import { BadgeCheck, Tag, MessageSquare, Info, ExternalLink } from 'lucide-react';
import { useSubmissions } from '@/context/SubmissionContext';

export function SkillPassport() {
  const { submissions } = useSubmissions();
  const approved = submissions.filter((s) => s.status === 'Demo Approved');

  return (
    <div className="view-enter">
      <header className="main-header">
        <p className="page-breadcrumb">Skill Passport</p>
        <h1 className="welcome-heading">Your Skill Passport</h1>
        <p className="welcome-desc">
          A record of challenges you have completed and received demo approval for. Each card shows the
          challenge title, skill category, evidence links and reviewer feedback.
        </p>
      </header>

      <div className="submission-demo-banner" style={{ marginBottom: '1.5rem' }}>
        <Info />
        Demo only — this passport is not independently verified. Demo approval means a simulated review
        was completed, not authenticated verification.
      </div>

      {approved.length === 0 ? (
        <div className="placeholder-view">
          <div className="placeholder-icon">
            <BadgeCheck />
          </div>
          <h3 className="placeholder-title">No demo-approved skills yet</h3>
          <p className="placeholder-text">
            Skills that receive demo approval from the Demo Teacher Review page will appear here as passport cards.
            Submit a challenge and review it to get started.
          </p>
        </div>
      ) : (
        <div className="passport-grid">
          {approved.map((sub) => (
            <div key={sub.id} className="passport-card">
              <div className="passport-card-header">
                <span className={`challenge-tag ${sub.categoryTagClass}`}>
                  <Tag style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                  {sub.challengeCategory}
                </span>
                <div className="passport-card-approved-icon">
                  <BadgeCheck />
                </div>
              </div>

              <h3 className="passport-card-title">{sub.challengeTitle}</h3>


              {sub.reviewFeedback && (
                <div className="passport-card-feedback">
                  <span className="submission-field-label">
                    <MessageSquare style={{ width: 12, height: 12, display: 'inline', marginRight: 4, verticalAlign: '-1px', color: 'var(--gold)' }} />
                    Teacher feedback
                  </span>
                  <p className="passport-feedback-text">{sub.reviewFeedback}</p>
                </div>
              )}

              {sub.evidenceLink && (
                <a
                  href={sub.evidenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="submission-evidence-link passport-evidence-link"
                >
                  <ExternalLink />
                  View evidence
                </a>
              )}

              <div className="passport-card-footer">
                <span className="passport-demo-badge">
                  <Info style={{ width: 12, height: 12 }} />
                  Demo approval — not independently verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
