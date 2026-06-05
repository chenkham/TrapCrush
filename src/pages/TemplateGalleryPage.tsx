import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { PURPOSES, THEMES } from '../lib/types';
import { AuroraBackground } from '../components/shared/AuroraBackground';

export const TemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#0a0a1a] text-white">
      <AuroraBackground theme="dreamy-rose" className="opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-[var(--font-heading)]">
            Choose Your <span className="text-pink-400">Trap</span>
          </h1>
          <p className="text-lg text-gray-400">
            Select a purpose to get started with a beautiful pre-designed template, or build your own from scratch.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Wand2 className="text-pink-500" /> Purposes
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PURPOSES.map((p, i) => {
            const IconComponent = (Icons as any)[p.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate('/create')}
                className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-[0_0_30px_rgba(255,0,127,0.15)] transition-all group"
              >
                <div className="mb-4 text-pink-400 transform group-hover:scale-110 transition-transform">
                  <IconComponent className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <p className="text-gray-400 text-sm">{p.description}</p>
              </motion.div>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Icons.Palette className="text-cyan-500" /> Themes
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden rounded-2xl group cursor-pointer hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all"
              onClick={() => navigate('/create')}
            >
              <div className="h-24 w-full relative">
                <div className="absolute inset-0 flex">
                  <div className="flex-1" style={{ backgroundColor: t.preview.bg }} />
                  <div className="w-1/4" style={{ backgroundColor: t.preview.accent }} />
                  <div className="w-1/4" style={{ backgroundColor: t.preview.text }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-xl font-bold font-[var(--font-heading)]">{t.name}</h3>
              </div>
              <div className="p-4 bg-black/40">
                <p className="text-gray-400 text-sm mb-4">{t.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                  <span>H: {t.fontHeading}</span>
                  <span>B: {t.fontBody}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
