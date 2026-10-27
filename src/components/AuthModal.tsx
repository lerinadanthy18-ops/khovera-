import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signUp, signIn } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) setErrorMessage(error.message);
      else onClose();
    } else {
      const { error } = await signIn(email, password);
      if (error) setErrorMessage(error.message);
      else onClose();
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '360px' }}>
        <h2>{isSignUp ? 'Student Registration' : 'Student Login'}</h2>
        
        {errorMessage && (
          <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name / Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.6rem', backgroundColor: '#000', color: '#fff',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {isSignUp ? (
            <p>Already have an account? <button onClick={() => setIsSignUp(false)} style={{ textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Sign In</button></p>
          ) : (
            <p>New student? <button onClick={() => setIsSignUp(true)} style={{ textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Register here</button></p>
          )}
          <button onClick={onClose} style={{ marginTop: '0.5rem', color: '#666', border: 'none', background: 'none', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};