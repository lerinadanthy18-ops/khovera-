import { useEffect, useState } from 'react';
import { Link2, FileText, Lightbulb, Save, X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { Challenge } from '@/data/challenges';
import { useSubmissions } from '@/context/SubmissionContext';
import { STORAGE_KEYS, loadJSON, saveJSON, removeKey } from '@/lib/storage';

interface SubmissionFormProps {
  challenge: Challenge;
  onCancel: () => void;
  onSaved: () => void;
}

interface DraftFields {
  evidenceLink: string;
  description: string;
  reflection: string;
}

const EMPTY_DRAFT: DraftFields = { evidenceLink: '', description: '', reflection: '' };

const loadDraft = (challengeId: string): DraftFields => {
  const all = loadJSON<Record<string, DraftFields>>(STORAGE_KEYS.draft, {});
  const d = all[challengeId];
  if (!d || typeof d !== 'object') return { ...EMPTY_DRAFT };
  return {
    evidenceLink: typeof d.evidenceLink === 'string' ? d.evidenceLink : '',
    description: typeof d.description === 'string' ? d.description : '',
    reflection: typeof d.reflection === 'string' ? d.reflection : '',
  };
};

const saveDraft = (challengeId: string, fields: DraftFields) => {
  const all = loadJSON<Record<string, DraftFields>>(STORAGE_KEYS.draft, {});
  all[challengeId] = fields;
  saveJSON(STORAGE_KEYS.draft, all);
};

const clearDraft = (challengeId: string) => {
  const all = loadJSON<Record<string, DraftFields>>(STORAGE_KEYS.draft, {});
  delete all[challengeId];
  if (Object.keys(all).length === 0) {
    removeKey(STORAGE_KEYS.draft);
  } else {
    saveJSON(STORAGE_KEYS.draft, all);
  }
};

export default function SubmissionForm({ challenge, onCancel, onSaved }: SubmissionFormProps) {
  const { addSubmission } = useSubmissions();
  const initial = loadDraft(challenge.id);
  const [evidenceLink, setEvidenceLink] = useState(initial.evidenceLink);
  const [description, setDescription] = useState(initial.description);
  const [reflection, setReflection] = useState(initial.reflection);
  const [errors, setErrors] = useState<{ link?: string; description?: string; reflection?: string }>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveDraft(challenge.id, { evidenceLink, description, reflection });
  }, [challenge.id, evidenceLink, description, reflection]);

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
    addSubmission({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      challengeCategory: challenge.category,
      categoryTagClass: challenge.categoryTagClass,
      description: description.trim(),
      evidenceLink: evidenceLink.trim(),
      reflection: reflection.trim(),
    });
    clearDraft(challenge.id);
    setSaved(true);
    setTimeout(() => onSaved(), 1400);
  };

  const handleCancel = () => {
    clearDraft(challenge.id);
    onCancel();
  };

  if (saved) {
    return (
      <div className="submission-success">
        <div className="submission-success-icon">
          <CheckCircle2 />
        </div>
        <h3 className="submission-success-title">Local demo submission saved</h3>
        <p className="submission-success-text">
          Your work for "{challenge.title}" has been added to this browser's My Submissions list. This is not a server submission.
        </p>
      </div>
    );
  }

  const Icon = challenge.icon;

  return (
    <form className="submission-form" onSubmit={handleSubmit} noValidate>
      <div className="submission-form-header">
        <div className="submission-form-challenge">
          <div style={{ width: 40, height: 40, borderRadius: 10, background: challenge.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon style={{ width: 20, height: 20, color: 'var(--gold)' }} />
          </div>
          <div>
            <p className="submission-form-label">Submitting for</p>
            <h3 className="submission-form-challenge-title">{challenge.title}</h3>
          </div>
        </div>
        <button type="button" className="modal-close" onClick={handleCancel} aria-label="Close">
          <X />
        </button>
      </div>

      <div className="submission-demo-banner">
        <Info />
        Prototype only: submissions are saved in this browser and are not sent to Supabase. Do not use this demo with private or sensitive data.
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="evidence-link">
          <Link2 /> Evidence link
        </label>
        <input
          id="evidence-link"
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
        <label className="form-label" htmlFor="description">
          <FileText /> What did you create?
        </label>
        <textarea
          id="description"
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
        <label className="form-label" htmlFor="reflection">
          <Lightbulb /> What was difficult, and what did you change?
        </label>
        <textarea
          id="reflection"
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
        <button type="button" className="modal-btn-secondary" onClick={handleCancel}>Cancel</button>
        <button type="submit" className="modal-btn-primary">
          <Save style={{ width: 16, height: 16, display: 'inline', marginRight: 6 }} />
          Save Local Demo
        </button>
      </div>
    </form>
  );
}
