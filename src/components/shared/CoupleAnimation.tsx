import React from 'react';
import { cn } from '../../lib/utils';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoupleAnimation: React.FC<Props> = ({ className, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-32 h-32' : size === 'lg' ? 'w-72 h-72' : 'w-48 h-48';
  
  return (
    <div className={cn('relative', sizeClass, className)}>
      {/* Floating hearts */}
      {[...Array(6)].map((_, i) => (
        <svg
          key={i}
          className="absolute text-pink-400/60"
          style={{
            width: 12 + Math.random() * 10,
            height: 12 + Math.random() * 10,
            left: `${15 + i * 14}%`,
            bottom: '40%',
            animation: `couple-float-heart ${2.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
      
      {/* Main couple illustration */}
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow circle behind */}
        <circle cx="100" cy="110" r="65" fill="url(#couple-glow)" opacity="0.15" />
        
        {/* Person 1 (left) */}
        <g className="couple-person-1">
          {/* Head */}
          <circle cx="80" cy="75" r="14" stroke="url(#couple-gradient)" strokeWidth="2.5" fill="none" />
          {/* Hair */}
          <path d="M66 72 Q68 58 80 55 Q92 58 94 72" stroke="url(#couple-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Body */}
          <path d="M80 89 L80 130" stroke="url(#couple-gradient)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left arm */}
          <path d="M80 100 L62 115" stroke="url(#couple-gradient)" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm (reaching to partner) */}
          <path d="M80 100 Q90 98 98 102" stroke="url(#couple-gradient)" strokeWidth="2" strokeLinecap="round" />
          {/* Left leg */}
          <path d="M80 130 L70 155" stroke="url(#couple-gradient)" strokeWidth="2" strokeLinecap="round" />
          {/* Right leg */}
          <path d="M80 130 L90 155" stroke="url(#couple-gradient)" strokeWidth="2" strokeLinecap="round" />
          {/* Skirt/dress detail */}
          <path d="M72 115 Q80 120 88 115" stroke="url(#couple-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        
        {/* Person 2 (right) */}
        <g className="couple-person-2">
          {/* Head */}
          <circle cx="120" cy="70" r="14" stroke="url(#couple-gradient-2)" strokeWidth="2.5" fill="none" />
          {/* Short hair */}
          <path d="M106 67 Q108 54 120 51 Q132 54 134 67" stroke="url(#couple-gradient-2)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Body */}
          <path d="M120 84 L120 130" stroke="url(#couple-gradient-2)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left arm (reaching to partner) */}
          <path d="M120 100 Q110 98 102 102" stroke="url(#couple-gradient-2)" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm */}
          <path d="M120 100 L138 115" stroke="url(#couple-gradient-2)" strokeWidth="2" strokeLinecap="round" />
          {/* Left leg */}
          <path d="M120 130 L110 155" stroke="url(#couple-gradient-2)" strokeWidth="2" strokeLinecap="round" />
          {/* Right leg */}
          <path d="M120 130 L130 155" stroke="url(#couple-gradient-2)" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Held hands (connection point) */}
        <circle cx="100" cy="102" r="3" fill="url(#couple-gradient)" opacity="0.8" className="couple-heart-pulse" />
        
        {/* Small heart above */}
        <g className="couple-heart-float">
          <path d="M100 45 C100 42 96 38 93 40 C90 42 90 46 93 49 L100 55 L107 49 C110 46 110 42 107 40 C104 38 100 42 100 45Z" 
            fill="url(#couple-gradient)" opacity="0.6" />
        </g>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="couple-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="couple-gradient-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <radialGradient id="couple-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Inline animation styles */}
      <style>{`
        @keyframes couple-float-heart {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.3; }
        }
        .couple-heart-float {
          animation: couple-heart-bob 3s ease-in-out infinite;
        }
        @keyframes couple-heart-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .couple-heart-pulse {
          animation: couple-pulse 2s ease-in-out infinite;
        }
        @keyframes couple-pulse {
          0%, 100% { r: 3; opacity: 0.8; }
          50% { r: 5; opacity: 0.4; }
        }
        .couple-person-1 {
          animation: couple-sway-1 4s ease-in-out infinite;
          transform-origin: 80px 130px;
        }
        .couple-person-2 {
          animation: couple-sway-2 4s ease-in-out infinite;
          transform-origin: 120px 130px;
        }
        @keyframes couple-sway-1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes couple-sway-2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  );
};
