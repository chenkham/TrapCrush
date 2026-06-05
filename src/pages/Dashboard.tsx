import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPagesByUser, deletePage } from '../lib/mockDb';
import type { Page } from '../lib/types';
import { timeAgo } from '../lib/utils';
import { PURPOSES, THEMES } from '../lib/types';

export const Dashboard: React.FC = () => {
  const { user, sendVerificationEmail } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (user) {
      loadPages();
    }
  }, [user]);

  const loadPages = async () => {
    if (!user) return;
    const data = await getPagesByUser(user.id);
    setPages(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await deletePage(id);
      setPages(pages.filter(p => p.id !== id));
    }
  };

  const handleCopy = (slug: string, id: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleResendVerification = async () => {
    setSendingEmail(true);
    try {
      await sendVerificationEmail();
      setEmailSent(true);
    } catch (e) {
      alert("Failed to send verification email. Please try again later.");
    } finally {
      setSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading your traps...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] text-white p-6 pb-24 immersive-section section-bg-4">
      <div className="max-w-6xl mx-auto pt-8 relative z-10">
        
        {user && !user.emailVerification && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-orange-200">
              <Icons.AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Please verify your email address to publish Traps.</p>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={sendingEmail || emailSent}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
            >
              {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {emailSent ? 'Email Sent!' : 'Resend Email'}
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Pages</h1>
            <p className="text-gray-400">Manage your created traps here.</p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-colors w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card text-center py-20 px-6 border-dashed border-white/20"
          >
            <div className="text-6xl mb-6">👻</div>
            <h3 className="text-2xl font-bold mb-2">It's quiet in here...</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't created any pages yet. Time to build something beautiful and devious.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 !text-white font-bold rounded-full hover:bg-pink-600 transition-colors"
            >
              Start Building
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {pages.map((page, i) => {
                const purpose = PURPOSES.find(p => p.id === page.purpose);
                const theme = THEMES.find(t => t.id === page.theme);
                
                return (
                  <motion.div
                    key={page.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="glass-card overflow-hidden flex flex-col"
                  >
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: theme?.preview.bg || '#ff3e6c' }}
                    />
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-pink-400">
                            {purpose ? (() => {
                              const IconComp = (Icons as any)[purpose.icon] || Icons.HelpCircle;
                              return <IconComp className="w-8 h-8" />;
                            })() : null}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold truncate pr-4">For {page.recipient_name}</h3>
                            <p className="text-xs text-gray-400">{timeAgo(page.created_at)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-6">
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                          {purpose?.name}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/5" style={{ color: theme?.preview.accent }}>
                          {theme?.name}
                        </span>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                        <div className="text-xs text-gray-400 truncate mr-3">
                          /p/{page.slug}
                        </div>
                        <Link to={`/p/${page.slug}`} target="_blank" className="text-gray-400 hover:text-white p-1">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/5 flex">
                      <button
                        onClick={() => handleCopy(page.slug, page.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                      >
                        {copiedId === page.id ? (
                          <span className="text-green-400">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Link
                          </>
                        )}
                      </button>
                      <div className="w-px bg-white/5" />
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
