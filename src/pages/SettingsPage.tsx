import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Settings, User, Bell, Palette, Shield, Trash2, LogOut, Save, Mail, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { Navigate, useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout, isLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications' | 'privacy'>('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Privacy & Data States
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [connections, setConnections] = useState({
    google: true,
    instagram: false,
    whatsapp: true
  });

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      await updateUserProfile(name);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setSaveError(e.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    // Mock deletion logic - clear localStorage data for mock user
    logout();
    navigate('/');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: '2024'
      },
      exportedAt: new Date().toISOString(),
      platform: 'TrapCrush'
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trapcrush_data_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 immersive-section section-bg-6">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 shrink-0 space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-pink-500" /> Settings
              </h1>
              
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        activeTab === tab.id
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", activeTab === tab.id ? "text-pink-400" : "")} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl min-h-[500px]">
              
              <AnimatePresence mode="wait">
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">Account Settings</h2>
                      <p className="text-sm text-gray-400">Manage your profile information and security.</p>
                    </div>

                    <div className="space-y-6 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                          />
                          <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed"
                          />
                          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Email address cannot be changed.</p>
                      </div>

                      {saveSuccess && (
                        <div className="text-sm text-green-400 font-medium animate-pulse">Changes saved successfully!</div>
                      )}
                      {saveError && (
                        <div className="text-sm text-red-400 font-medium">{saveError}</div>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium rounded-xl transition-all cursor-pointer shadow-md hover:shadow-pink-500/20"
                      >
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <hr className="border-white/10" />

                    <div>
                      <h3 className="text-lg font-medium text-red-400 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Danger Zone
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all associated data.</p>
                      
                      {showDeleteConfirm ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-md">
                          <p className="text-sm text-white mb-4">Are you absolutely sure? This action cannot be undone.</p>
                          <div className="flex gap-3">
                            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-colors">
                              Yes, Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-sm transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl border border-red-500/20 transition-colors text-sm">
                          <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}


                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">Notifications</h2>
                      <p className="text-sm text-gray-400">Manage how we contact you.</p>
                    </div>
                    
                    <div className="space-y-3 max-w-md">
                      {[
                        { title: 'New Features', desc: 'Updates about new themes and tools' },
                        { title: 'Page Views', desc: 'When someone views your traps' },
                        { title: 'Marketing', desc: 'Promotions and offers' }
                      ].map((item, i) => (
                        <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors">
                          <div>
                            <div className="text-white text-sm font-medium mb-1">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.desc}</div>
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${i === 0 ? 'bg-pink-500' : 'bg-white/10'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${i === 0 ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">Privacy & Data</h2>
                      <p className="text-sm text-gray-400">Manage your privacy preferences and data connections.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Privacy toggles */}
                      <div className="space-y-3 max-w-md">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Privacy Preferences</h3>
                        <div 
                          onClick={() => setRequirePasscode(!requirePasscode)}
                          className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors"
                        >
                          <div>
                            <div className="text-white text-sm font-medium mb-1">Passcode Protection</div>
                            <div className="text-xs text-gray-400">Require password to view interactive pages</div>
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${requirePasscode ? 'bg-pink-500' : 'bg-white/10'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${requirePasscode ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                        </div>
                      </div>

                      {/* Connected Accounts */}
                      <div className="space-y-3 max-w-md">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Connected Accounts</h3>
                        {(['google', 'instagram', 'whatsapp'] as const).map((provider) => (
                          <div key={provider} className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-semibold capitalize text-white">
                                {provider.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium capitalize">{provider}</div>
                                <div className="text-xs text-gray-400">{connections[provider] ? 'Connected' : 'Not connected'}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setConnections(prev => ({ ...prev, [provider]: !prev[provider] }))}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer animate-none",
                                connections[provider]
                                  ? "bg-white/5 text-gray-300 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                                  : "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20"
                              )}
                            >
                              {connections[provider] ? 'Disconnect' : 'Connect'}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Data Export */}
                      <div className="space-y-3 max-w-md">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Data Portability</h3>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                          <div>
                            <div className="text-white text-sm font-medium mb-1">Export Profile Data</div>
                            <div className="text-xs text-gray-400">Download a complete backup of your profile settings and created pages as a JSON file.</div>
                          </div>
                          <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Export Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
