import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Props {
  name: string;
  quote: string;
  avatar: string;
  role: string;
  rating: number;
  delay?: number;
}

export const TestimonialCard: React.FC<Props> = ({ name, quote, avatar, role, rating, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(236,72,153,0.15)' }}
      className="p-6 rounded-2xl border border-white/10 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Quote mark */}
      <div className="text-4xl text-pink-500/20 font-serif leading-none mb-3">"</div>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[60px]">{quote}</p>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-lg">
          {avatar}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};
