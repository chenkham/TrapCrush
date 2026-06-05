import React from 'react';
import type { ThemeType } from '../../lib/types';
import { cn } from '../../lib/utils';

interface Props {
  theme?: ThemeType;
  className?: string;
}

const themeColors: Record<ThemeType, [string, string, string]> = {
  'dreamy-rose': ['#FF3E6C', '#B76E79', '#c77dff'],
  'midnight-glow': ['#FF007F', '#00F0FF', '#7B2FBE'],
  'sunny-chaos': ['#FFDE00', '#00F5D4', '#FF2A2A'],
  'vintage-film': ['#B76E79', '#D4AF37', '#F3E5D8'],
  'arcade-retro': ['#FF007F', '#00F0FF', '#7B2FBE'],
  'garden-party': ['#2d6a4f', '#b7e4c7', '#d8f3dc'],
};

export const AuroraBackground: React.FC<Props> = ({ theme = 'midnight-glow', className }) => {
  const [color1, color2, color3] = themeColors[theme];

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-30", className)}>
      <div 
        className="aurora-blob aurora-blob-1 w-[45vw] h-[45vw] top-[-10%] left-[-10%]"
        style={{ backgroundColor: color1 }}
      />
      <div 
        className="aurora-blob aurora-blob-2 w-[40vw] h-[40vw] top-[40%] right-[-10%]"
        style={{ backgroundColor: color2 }}
      />
      <div 
        className="aurora-blob aurora-blob-3 w-[50vw] h-[50vw] bottom-[-20%] left-[20%]"
        style={{ backgroundColor: color3 }}
      />
      
      {/* Noise overlay for cinematic effect */}
      <div className="absolute inset-0 noise-overlay opacity-50" />
    </div>
  );
};
