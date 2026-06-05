import React from 'react';
import { cn } from '../../lib/utils';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

export const CupidLoader: React.FC<Props> = ({ className, size = 'md', text }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", sizeMap[size])}>
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full animate-pulse" />
        
        {/* Cupid SVG Animation */}
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 animate-cupid-fly overflow-visible">
          <defs>
            <linearGradient id="cupid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Speed trails/clouds passing by */}
          <g className="animate-speed-lines" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="2" strokeLinecap="round">
            <line x1="80" y1="20" x2="120" y2="20" />
            <line x1="60" y1="80" x2="100" y2="80" />
            <line x1="90" y1="50" x2="140" y2="50" />
          </g>

          {/* The Cupid */}
          <g transform="translate(10, 10)">
            {/* Back Wing */}
            <path 
              d="M30,40 C15,20 10,35 25,50 Z" 
              fill="rgba(255,255,255,0.7)" 
              className="animate-wing-back"
              transform-origin="25px 45px"
            />
            
            {/* Body/Head (Minimalist Blob) */}
            <path 
              d="M40,25 C50,25 55,35 55,45 C55,60 45,65 35,65 C25,65 20,55 20,40 C20,30 30,25 40,25 Z" 
              fill="url(#cupid-grad)" 
              filter="url(#glow)"
            />
            
            {/* Front Wing */}
            <path 
              d="M35,45 C20,25 15,40 30,55 Z" 
              fill="white" 
              className="animate-wing-front"
              transform-origin="30px 50px"
            />

            {/* Bow */}
            <path 
              d="M50,30 C65,30 70,45 60,60" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            {/* Arrow */}
            <line x1="30" y1="45" x2="75" y2="45" stroke="white" strokeWidth="2" strokeLinecap="round" />
            {/* Arrowhead */}
            <polygon points="75,45 68,41 70,45 68,49" fill="white" />
          </g>
        </svg>
      </div>

      {text && (
        <p className="text-pink-400 font-medium animate-pulse tracking-wide text-sm">
          {text}
        </p>
      )}
    </div>
  );
};
