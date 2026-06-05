import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  className?: string;
}

export const PhoneMockup: React.FC<Props> = ({ className = '' }) => {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Track mouse for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;
      const rect = phoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tiltX = ((e.clientY - centerY) / rect.height) * 8;
      const tiltY = ((e.clientX - centerX) / rect.width) * -8;
      setTilt({ x: tiltX, y: tiltY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNoHover = () => {
    const maxX = 120;
    const maxY = 80;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setNoPos({ x: newX, y: newY });
    setAttempts(a => a + 1);
  };

  const getNoText = () => {
    if (attempts >= 8) return 'Yes! 💕';
    if (attempts >= 6) return '404: No Not Found';
    if (attempts >= 4) return 'Think again...';
    if (attempts >= 2) return 'Are you sure?';
    return 'No';
  };

  return (
    <motion.div
      ref={phoneRef}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Phone Frame */}
        <div
          className="relative w-[260px] h-[520px] sm:w-[280px] sm:h-[560px] rounded-[36px] p-[10px] mx-auto"
          style={{
            background: 'linear-gradient(145deg, #2a2a3e, #1a1a2e)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(236,72,153,0.1), inset 0 1px 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* Notch */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-[#0a0a14] rounded-b-[14px] z-20 flex items-center justify-center gap-2">
            <div className="w-[8px] h-[8px] rounded-full bg-gray-700" />
            <div className="w-[40px] h-[4px] rounded-full bg-gray-800" />
          </div>

          {/* Screen */}
          <div className="w-full h-full rounded-[28px] overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #0f0f2a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}
          >
            {/* Aurora glow inside phone */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[60%] rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #ff007f 0%, transparent 70%)', filter: 'blur(40px)' }}
              />
              <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)', filter: 'blur(40px)' }}
              />
            </div>

            {/* Phone Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
              {/* Floating mini hearts */}
              {[...Array(4)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-pink-500/30 pointer-events-none select-none"
                  style={{ left: `${20 + i * 20}%`, top: `${15 + i * 12}%`, fontSize: `${10 + i * 3}px` }}
                  animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
                >
                  ♥
                </motion.span>
              ))}

              <motion.p
                className="text-[11px] text-pink-400/60 uppercase tracking-[3px] font-bold mb-3"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                TrapCrush
              </motion.p>

              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Will you go on a<br />date with me?
              </h3>
              <p className="text-gray-400 text-[11px] mb-8">— from someone special 💫</p>

              {/* Buttons */}
              <div className="flex gap-3 items-center relative">
                <motion.button
                  className="px-6 py-2.5 rounded-full font-bold text-sm text-white shadow-lg cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: '0 4px 20px rgba(236,72,153,0.4)' }}
                  animate={{ scale: 1 + attempts * 0.03 }}
                  whileHover={{ scale: 1.08 + attempts * 0.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes! 💕
                </motion.button>

                <motion.button
                  className="px-5 py-2.5 rounded-full font-bold text-sm border border-white/20 text-gray-300 cursor-pointer hover:border-white/40 transition-colors"
                  style={{ background: attempts >= 8 ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255,255,255,0.05)' }}
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoHover}
                >
                  {getNoText()}
                </motion.button>
              </div>

              {attempts > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-gray-500 mt-4 italic"
                >
                  {attempts >= 8 ? '😏 Resistance is futile' : `Attempts: ${attempts}`}
                </motion.p>
              )}
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
        </div>

        {/* Reflection glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[40px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #ec4899 0%, transparent 70%)', filter: 'blur(20px)' }}
        />
      </motion.div>
    </motion.div>
  );
};
