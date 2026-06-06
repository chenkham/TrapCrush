import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getPagesByUser } from '../lib/mockDb';
import type { Page } from '../lib/types';
import { Mail, Calendar, FileText, ExternalLink, Save, Settings, Heart } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, isLoading, updateUserProfile } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user) {
      getPagesByUser(user.id).then(setPages);
      setName(user.name);
    }
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async () => {
    try {
      await updateUserProfile(name);
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 immersive-section section-bg-5">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 p-1 shrink-0 shadow-xl shadow-pink-500/20">
              <div className="w-full h-full bg-[#1a1a2e] rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white font-semibold text-2xl outline-none focus:border-pink-500 w-full max-w-sm"
                  />
                  <button onClick={handleSave} className="p-2.5 bg-pink-500 hover:bg-pink-600 rounded-xl text-white transition-colors">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-400 text-sm font-medium">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0"><Calendar className="w-4 h-4 text-cyan-400" /> Member since 2024</div>
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors hidden md:block">
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
            
            <button onClick={() => setIsEditing(true)} className="md:hidden absolute top-0 right-0 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" /> Your Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{pages.length}</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pages Built</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-1">
                    {pages.reduce((acc, page) => acc + page.screens.length, 0)}
                  </div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Screens</div>
                </div>
              </div>
            </div>


          </motion.div>

          {/* Recent Pages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Recent Creations
                </h2>
                <Link to="/dashboard" className="text-sm !text-pink-400 hover:!text-pink-300 font-medium">View All</Link>
              </div>

              {pages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No pages yet</h3>
                  <p className="text-gray-400 text-sm mb-6">Start building your first interactive page.</p>
                  <Link to="/create" className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 !text-white font-medium rounded-xl transition-colors inline-block">
                    Create New
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {pages.slice(0, 5).map((page, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                      key={page.id}
                      className="group bg-black/40 border border-white/5 hover:border-pink-500/30 rounded-xl p-4 flex items-center justify-between transition-all"
                    >
                      <div>
                        <h4 className="text-white font-medium mb-1 group-hover:text-pink-400 transition-colors">{page.purpose}</h4>
                        <div className="text-xs text-gray-500">For {page.recipient_name} • {new Date(page.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/p/${page.slug}`} target="_blank" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="View Live">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
