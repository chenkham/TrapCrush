import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuroraBackground } from '../components/shared/AuroraBackground';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setStatus('error');
      setErrorMessage('Invalid verification link.');
      return;
    }

    verifyEmail(userId, secret)
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Verification failed.');
      });
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
            <p className="text-gray-400">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">Your email has been successfully verified. You can now publish Traps!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-red-400 mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
