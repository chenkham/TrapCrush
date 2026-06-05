import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Copy, ExternalLink, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useWizard } from '../contexts/CreateWizardContext';
import { useAuth } from '../contexts/AuthContext';
import { createPage } from '../lib/mockDb';
import { PURPOSES, THEMES, getDefaultScreens } from '../lib/types';
import type { PurposeType, ThemeType } from '../lib/types';
import { AuroraBackground } from '../components/shared/AuroraBackground';
import { cn } from '../lib/utils';
import { CustomEditor } from '../components/editor/CustomEditor';

const STEPS = ['Purpose', 'Theme', 'Details & Design', 'Preview', 'Publish'];

export const CreateWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { state, setPurpose, setTheme, setSenderName, setRecipientName, setScreens, reset } = useWizard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  const handleNext = () => {
    // If entering details step, initialize screens if empty
    if (currentStep === 1 && state.purpose && state.screens.length === 0) {
      setScreens(getDefaultScreens(state.purpose, state.senderName || 'Me', state.recipientName || 'You'));
    }
    if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handlePublish = async () => {
    if (!user || !state.purpose || !state.theme) return;
    setIsPublishing(true);
    try {
      const page = await createPage({
        user_id: user.id,
        purpose: state.purpose,
        theme: state.theme,
        sender_name: state.senderName,
        recipient_name: state.recipientName,
        screens: state.screens,
        target_ratio: state.targetRatio,
      });
      setPublishedSlug(page.slug);
      handleNext();
    } catch (error) {
      console.error(error);
      alert('Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const finish = () => {
    reset();
    navigate('/dashboard');
  };

  const isStepValid = () => {
    if (currentStep === 0) return !!state.purpose;
    if (currentStep === 1) return !!state.theme;
    if (currentStep === 2) return !!state.senderName && !!state.recipientName && state.screens.length > 0;
    return true;
  };

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PURPOSES.map(p => {
        const IconComponent = (Icons as any)[p.icon] || Icons.HelpCircle;
        return (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPurpose(p.id as PurposeType)}
            className={cn(
              "p-6 rounded-2xl cursor-pointer transition-all border-2",
              state.purpose === p.id 
                ? "border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(255,0,127,0.2)]" 
                : "border-white/10 bg-white/5 hover:border-white/30"
            )}
          >
            <div className="mb-4 text-pink-400">
              <IconComponent className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
            <p className="text-sm text-gray-400">{p.description}</p>
          </motion.div>
        );
      })}
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {THEMES.map(t => (
        <motion.div
          key={t.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme(t.id as ThemeType)}
          className={cn(
            "p-5 rounded-2xl cursor-pointer transition-all border-2 flex flex-col",
            state.theme === t.id 
              ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]" 
              : "border-white/10 bg-white/5 hover:border-white/30"
          )}
        >
          <div className="flex rounded-lg overflow-hidden h-16 mb-4 shadow-inner">
            <div className="flex-1" style={{ backgroundColor: t.preview.bg }} />
            <div className="w-1/4" style={{ backgroundColor: t.preview.accent }} />
            <div className="w-1/4" style={{ backgroundColor: t.preview.text }} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
          <p className="text-xs text-gray-400">{t.description}</p>
        </motion.div>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Your Name</label>
          <input
            type="text"
            value={state.senderName}
            onChange={e => setSenderName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Recipient's Name</label>
          <input
            type="text"
            value={state.recipientName}
            onChange={e => setRecipientName(e.target.value)}
            placeholder="e.g. Sam"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      {state.senderName && state.recipientName && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Visual Editor</h3>
            <span className="text-sm text-gray-400">Design your screens and connect them</span>
          </div>
          <CustomEditor screens={state.screens} onChange={setScreens} />
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Review Your Trap</h2>
      <p className="text-gray-400 mb-8">
        You have created {state.screens.length} interconnected screens. 
        <br/>Make sure all your buttons link to the correct pages!
      </p>

      <div className="glass-card p-6 text-left relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-cyan-500" />
        <p className="text-sm text-gray-500 mb-2">PAGE SUMMARY</p>
        <div className="space-y-2 text-white font-medium">
          <p>For: <span className="text-pink-400">{state.recipientName}</span></p>
          <p>From: <span className="text-pink-400">{state.senderName}</span></p>
          <p>Theme: <span className="text-cyan-400">{THEMES.find(t=>t.id===state.theme)?.name}</span></p>
          <p>Screens: {state.screens.length}</p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>
      <h2 className="text-4xl font-bold mb-4">It's Alive!</h2>
      <p className="text-gray-400 text-lg mb-8">
        Your interactive page has been created.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <div className="px-6 py-4 bg-black/50 border border-white/20 rounded-xl font-mono text-pink-400 truncate max-w-full">
          {window.location.origin}/p/{publishedSlug}
        </div>
        <button
          onClick={async () => {
            if (!publishedSlug) return;
            const url = `${window.location.origin}/p/${publishedSlug}`;
            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                alert('Copied to clipboard!');
              } else {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);
                if (successful) alert('Copied to clipboard!');
                else alert('Failed to copy. Please copy manually: ' + url);
              }
            } catch (err) {
              alert('Failed to copy. Please copy manually: ' + url);
            }
          }}
          className="flex items-center gap-2 px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shrink-0"
        >
          <Copy className="w-5 h-5" /> Copy
        </button>
      </div>

      <div className="flex gap-4 justify-center">
        <a
          href={`/p/${publishedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> View Live
        </a>
        <button
          onClick={finish}
          className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] text-white relative">
      <AuroraBackground theme={state.theme || 'midnight-glow'} className="opacity-20" />
      
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Progress Bar */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-pink-500 z-0 transition-all duration-500" 
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2",
                  index <= currentStep ? "bg-pink-500 border-pink-500 text-white" : "bg-[#0a0a1a] border-white/20 text-gray-500"
                )}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium absolute -bottom-6 whitespace-nowrap transition-colors duration-300",
                  index <= currentStep ? "text-white" : "text-gray-500"
                )}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && renderStep1()}
              {currentStep === 1 && renderStep2()}
              {currentStep === 2 && renderStep3()}
              {currentStep === 3 && renderStep4()}
              {currentStep === 4 && renderStep5()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10 max-w-4xl mx-auto">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            {currentStep === 3 ? (
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || (user && !user.emailVerification)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,0,127,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish!'}
                </button>
                {user && !user.emailVerification && (
                  <span className="text-xs text-orange-400 font-medium px-4 bg-orange-500/10 py-1 rounded-full border border-orange-500/20">Verify email to publish</span>
                )}
              </div>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
