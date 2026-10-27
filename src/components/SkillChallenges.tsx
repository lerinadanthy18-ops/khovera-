import React, { useState } from 'react';
import ChallengeModal from './ChallengeModal';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category?: string;
  estimatedTime?: string;
  skills?: string[];
  level?: string;
}

const challengesList: Challenge[] = [
  {
    id: 'challenge-budget-1',
    title: 'Plan a Student-Club Event Budget',
    description: 'Compare costs, allocate a limited fictional budget, and explain how to handle a shortfall.',
    category: 'FINANCIAL LITERACY',
    estimatedTime: '60 minutes',
    level: 'Intermediate',
    skills: ['Budgeting', 'Decision making'],
  },
  {
    id: 'challenge-prototype-4',
    title: 'Prototype a Campus Service',
    description: 'Create a paper, design-tool, or coded prototype that helps students find campus services.',
    category: 'SOFTWARE & UI/UX',
    estimatedTime: '60 minutes',
    level: 'Intermediate',
    skills: ['Problem solving', 'UI/UX', 'Prototyping'],
  },
  {
    id: 'challenge-sensor-5',
    title: 'Analyze Campus Waste Data',
    description: 'Use a small fictional dataset to identify waste patterns and suggest one improvement.',
    category: 'DATA & ENVIRONMENT',
    estimatedTime: '45 minutes',
    level: 'Intermediate',
    skills: ['Data analysis', 'Sustainability'],
  },
  {
    id: 'challenge-error-2',
    title: "Improve an App's Error Messages",
    description: 'Rewrite three fictional confusing error messages with clear next actions.',
    category: 'COMMUNICATION',
    estimatedTime: '45 minutes',
    level: 'Beginner',
    skills: ['Copywriting', 'UX Writing'],
  },
  {
    id: 'challenge-catalogue-3',
    title: 'Design a Local Business Catalogue',
    description: 'Create a three-product catalogue for a fictional local business.',
    category: 'CREATIVE SKILLS',
    estimatedTime: '60 minutes',
    level: 'Intermediate',
    skills: ['Marketing', 'Design'],
  },
];

export const SkillChallenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Skill Challenges</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Select a challenge to complete and submit evidence for review.
        </p>

        {/* Card Grid Layout matching the screenshot */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challengesList.map((challenge) => (
            <div
              key={challenge.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                {/* Estimated Time and Level */}
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>⏱ {challenge.estimatedTime}</span>
                  <span>•</span>
                  <span>{challenge.level}</span>
                </div>

                {/* Skills list separated by diamonds */}
                {challenge.skills && challenge.skills.length > 0 && (
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Skills: {challenge.skills.join(' ◆ ')}
                  </div>
                )}

                {/* Category Header */}
                {challenge.category && (
                  <span className="mt-4 block text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    {challenge.category}
                  </span>
                )}

                {/* Challenge Title */}
                <h2 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {challenge.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {challenge.description}
                </p>
              </div>

              {/* Action Buttons Footer matching screenshot */}
              <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleOpenChallenge(challenge)}
                  className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  View challenge &rarr;
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  🔖 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase Submission Modal */}
      <ChallengeModal
        challenge={selectedChallenge}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SkillChallenges;