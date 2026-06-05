import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuroraBackground } from '../components/shared/AuroraBackground';
import { CoupleAnimation } from '../components/shared/CoupleAnimation';
import { Loader2, Mail, User, ArrowRight, Lock } from 'lucide-react';

interface Props {
  mode: 'login' | 'signup';
}

// Inline SVG icons for social providers
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <defs>
      <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#feda75"/>
        <stop offset="25%" stopColor="#fa7e1e"/>
        <stop offset="50%" stopColor="#d62976"/>
        <stop offset="75%" stopColor="#962fbf"/>
        <stop offset="100%" stopColor="#4f5bd5"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="5" stroke="url(#ig-grad)" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-grad)"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const AuthPage: React.FC<Props> = ({ mode }) => {
  const { login, register, loginWithProvider } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setLoadingProvider(provider);
    setError('');
    try {
      await loginWithProvider(provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-stretch relative overflow-hidden">
      <AuroraBackground theme="midnight-glow" />

      {/* Left: Brand Section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="relative z-10 text-center px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <CoupleAnimation size="lg" className="mx-auto mb-8" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold text-white mb-4 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-400">
              Make Them Say Yes
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            Create stunning, interactive pages your crush can't refuse. Literally.
          </motion.p>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Right: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile-only brand header */}
          <div className="lg:hidden text-center mb-8">
            <CoupleAnimation size="sm" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
                TrapCrush
              </span>
            </h2>
          </div>

          {/* Auth Card */}
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {mode === 'login' ? 'Log in to manage your pages.' : 'Sign up to start creating.'}
            </p>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-pink-400 hover:text-pink-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300">Privacy Policy</Link>
              </label>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={!!loadingProvider}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50"
              >
                {loadingProvider === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">or continue with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
                    placeholder="Your name"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm flex justify-center items-center gap-2 transition-all hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Log In' : 'Sign Up'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === 'login' ? (
                <p>Don't have an account? <Link to="/signup" className="text-pink-400 hover:text-pink-300 font-medium">Sign up</Link></p>
              ) : (
                <p>Already have an account? <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium">Log in</Link></p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
