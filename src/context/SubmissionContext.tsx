import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  evidence_text: string;
  status: 'submitted' | 'approved' | 'rejected';
  teacher_feedback?: string;
  created_at: string;
}

interface SubmissionContextType {
  submissions: Submission[];
  loading: boolean;
  addSubmission: (challengeId: string, evidenceText: string) => Promise<{ success: boolean; error?: string }>;
  refreshSubmissions: () => Promise<void>;
  resetData: () => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Fetch student submissions from Supabase when logged in
  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error.message);
    } else if (data) {
      setSubmissions(data as Submission[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  // Insert new submission into Supabase database
  const addSubmission = async (challengeId: string, evidenceText: string) => {
    if (!user) {
      return { success: false, error: 'User is not authenticated' };
    }

    const newSubmission = {
      user_id: user.id,
      challenge_id: challengeId,
      evidence_text: evidenceText,
      status: 'submitted',
    };

    const { data, error } = await supabase
      .from('submissions')
      .insert([newSubmission])
      .select();

    if (error) {
      console.error('Error submitting evidence:', error.message);
      return { success: false, error: error.message };
    }

    if (data && data.length > 0) {
      setSubmissions((prev) => [data[0] as Submission, ...prev]);
    }

    return { success: true };
  };

  const resetData = () => {
    setSubmissions([]);
  };

  return (
    <SubmissionContext.Provider
      value={{
        submissions,
        loading,
        addSubmission,
        refreshSubmissions: fetchSubmissions,
        resetData,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissions = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error('useSubmissions must be used within a SubmissionProvider');
  }
  return context;
};