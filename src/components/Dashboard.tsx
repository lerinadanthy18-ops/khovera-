import React, { useState } from 'react';
import ChallengeModal from './ChallengeModal';
import { useSubmissions } from '@/context/SubmissionContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category?: string;
  estimatedTime?: string;
}

const Dashboard: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { submissions } = useSubmissions();

  const handleOpenChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Welcome back! Track your challenges and submissions below.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Plan a Student-Club Event Budget
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Compare costs, allocate a limited fictional budget, and explain how to handle a shortfall.
          </p>
          <button
            onClick={() =>
              handleOpenChallenge({
                id: 'challenge-budget-1',
                title: 'Plan a Student-Club Event Budget',
                description: 'Compare costs, allocate a limited fictional budget, and explain how to handle a shortfall.',
              })
            }
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            View Challenge
          </button>
        </div>
      </div>

      <ChallengeModal
        challenge={selectedChallenge}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;