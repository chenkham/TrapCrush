import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, Heart, Target, Wand2, Users, Zap } from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Flame, Heart, Target, Wand2, Users, Zap,
};

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: string;
}

interface Props {
  stats: Stat[];
}

const AnimatedNumber: React.FC<{ value: number; suffix?: string; prefix?: string; inView: boolean }> = ({ value, suffix = '', prefix = '', inView }) => {
  const [count, setCount] = useState(0);
  const duration = 2000;

  useEffect(() => {
    if (!inView) return;
    if (value === 0) { setCount(0); return; }
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, inView]);

  const formatted = value === 0 ? 'Zero' : `${prefix}${count.toLocaleString()}${suffix}`;
  return <span>{formatted}</span>;
};

export const StatsCounter: React.FC<Props> = ({ stats }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <div
        className="grid grid-cols-3 gap-4 sm:gap-8 p-6 sm:p-8 rounded-2xl border border-white/10"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Wand2;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <Icon className="w-5 h-5 text-pink-400 mb-1" />
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} inView={isInView} />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
