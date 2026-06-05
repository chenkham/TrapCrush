import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../../lib/types';

export const ThemeShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-8 sm:px-16 pb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {THEMES.map((theme, i) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="shrink-0 snap-center group"
          >
            {/* Mini Phone Mockup */}
            <div className="w-[180px] sm:w-[200px]">
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-full aspect-[9/16] rounded-[24px] p-[6px] cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg, #2a2a3e, #1a1a2e)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                }}
              >
                {/* Screen */}
                <div
                  className="w-full h-full rounded-[20px] overflow-hidden flex flex-col items-center justify-center p-4 relative"
                  style={{ background: theme.preview.bg }}
                >
                  {/* Accent blob */}
                  <div
                    className="absolute top-[-30%] right-[-30%] w-[80%] h-[60%] rounded-full opacity-20"
                    style={{ background: `radial-gradient(circle, ${theme.preview.accent} 0%, transparent 70%)`, filter: 'blur(25px)' }}
                  />
                  
                  {/* Mini content */}
                  <div className="relative z-10 text-center">
                    <div
                      className="text-[11px] font-bold mb-1 opacity-60"
                      style={{ color: theme.preview.text, fontFamily: theme.fontHeading }}
                    >
                      Will you...
                    </div>
                    <div
                      className="text-[14px] font-bold mb-4 leading-tight"
                      style={{ color: theme.preview.accent, fontFamily: theme.fontHeading }}
                    >
                      Go on a date<br />with me?
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white"
                        style={{ background: theme.preview.accent }}
                      >
                        Yes! 💕
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold border"
                        style={{ color: theme.preview.text, borderColor: theme.preview.accent + '40' }}
                      >
                        No
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-white/15 rounded-full" />
              </motion.div>

              {/* Theme info */}
              <div className="mt-4 text-center">
                <h4 className="text-white font-semibold text-sm">{theme.name}</h4>
                <p className="text-gray-500 text-xs mt-1">{theme.description}</p>
                {/* Color dots */}
                <div className="flex gap-2 justify-center mt-3">
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: theme.preview.bg }} />
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: theme.preview.accent }} />
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: theme.preview.text }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
