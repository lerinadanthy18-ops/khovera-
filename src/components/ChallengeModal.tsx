import React, { useState } from 'react';
import { useSubmissions } from '@/context/SubmissionContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category?: string;
  estimatedTime?: string;
}

interface ChallengeModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, isOpen, onClose }) => {
  const { addSubmission } = useSubmissions();
  
  const [evidenceLink, setEvidenceLink] = useState('');
  const [whatCreated, setWhatCreated] = useState('');
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const evidenceText = `Evidence Link: ${evidenceLink}\n\nWhat Was Created:\n${whatCreated}\n\nReflection:\n${reflection}`;

    const result = await addSubmission(challenge.id, evidenceText);

    setIsSubmitting(false);

    if (result.success) {
      setEvidenceLink('');
      setWhatCreated('');
      setReflection('');
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to submit evidence. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {challenge.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {challenge.description}
        </p>

        {errorMessage && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Evidence link
            </label>
            <input
              type="url"
              required
              value={evidenceLink}
              onChange={(e) => setEvidenceLink(e.target.value)}
              placeholder="https://docs.google.com/document/d/example"
              className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              What did you create?
            </label>
            <textarea
              required
              rows={3}
              value={whatCreated}
              onChange={(e) => setWhatCreated(e.target.value)}
              placeholder="Describe what you made, how you approached it, and what it shows..."
              className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              What was difficult, and what did you change?
            </label>
            <textarea
              required
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share what you found tricky and any changes or improvements you made..."
              className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit to Supabase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeModal;