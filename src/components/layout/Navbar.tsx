import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, Settings, ChevronDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { usePWA } from '../../contexts/PWAContext';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isInstallable, installApp } = usePWA();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkFullscreen = () => {
      setIsEditorFullscreen(document.documentElement.classList.contains('editor-fullscreen'));
    };
    
    const observer = new MutationObserver(checkFullscreen);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    checkFullscreen();
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (isEditorFullscreen) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-[#0a0a1a]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="TrapCrush Logo" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold text-white tracking-tight">TrapCrush</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">Home</Link>
          {isLanding && (
            <>
              <button onClick={() => scrollTo('features')} className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">Features</button>
              <button onClick={() => scrollTo('themes')} className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">Themes</button>
              <button onClick={() => scrollTo('faq')} className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">FAQ</button>
            </>
          )}
          {!isLanding && (
            <Link to="/templates" className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">
              Templates
            </Link>
          )}
          <Link to="/create" className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">
            Create
          </Link>
          
          <div className="w-px h-4 bg-white/20" />

          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium !text-white hover:!text-pink-400 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", profileDropdownOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm !text-white hover:bg-white/5 transition-colors">
                        <UserIcon className="w-4 h-4 text-pink-400" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm !text-white hover:bg-white/5 transition-colors">
                        <UserIcon className="w-4 h-4 text-cyan-400" /> Profile
                      </Link>
                      <Link to="/settings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm !text-white hover:bg-white/5 transition-colors">
                        <Settings className="w-4 h-4 text-gray-400" /> Settings
                      </Link>
                      <div className="border-t border-white/10" />
                      <button
                        onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium !text-white hover:!text-pink-400 transition-colors">
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden !text-white hover:!text-pink-400 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-full left-0 w-full bg-[#0a0a1a] border-b border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 py-6 px-6">
              <Link to="/" className="text-left text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {isLanding && (
                <>
                  <button onClick={() => scrollTo('features')} className="text-left text-lg font-medium !text-white hover:!text-pink-400">Features</button>
                  <button onClick={() => scrollTo('themes')} className="text-left text-lg font-medium !text-white hover:!text-pink-400">Themes</button>
                  <button onClick={() => scrollTo('faq')} className="text-left text-lg font-medium !text-white hover:!text-pink-400">FAQ</button>
                </>
              )}
              {!isLanding && (
                <Link to="/templates" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                  Templates
                </Link>
              )}
              <Link to="/create" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                Create
              </Link>
              
              <AnimatePresence>
                {isInstallable && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => {
                      installApp();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-lg font-medium text-cyan-400 hover:text-cyan-300 mt-2 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20"
                  >
                    <Download className="w-5 h-5" /> Install App
                  </motion.button>
                )}
              </AnimatePresence>

              <hr className="border-white/10 my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard ({user.name})
                  </Link>
                  <Link to="/profile" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/settings" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                    Settings
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-left text-lg font-medium text-pink-400 hover:text-pink-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-lg font-medium !text-white hover:!text-pink-400" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/signup" className="text-lg font-medium text-pink-400 hover:text-pink-300" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
