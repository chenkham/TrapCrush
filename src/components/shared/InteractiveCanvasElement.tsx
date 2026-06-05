import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';
import type { CanvasElement } from '../../lib/types';

interface Props {
  element: CanvasElement;
  onAction: (action: CanvasElement['action']) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  isMobileView?: boolean;
  fontSizeMultiplier?: number;
}

export const InteractiveCanvasElement: React.FC<Props> = ({ element, onAction, canvasWidth = 360, canvasHeight = 640, isMobileView = false, fontSizeMultiplier = 1 }) => {
  if (element.visible === false) return null;

  const isNormalized = element.isNormalized ?? true;
  const useMobileOverride = isMobileView && element.mobileOverrides;
  
  const activeX = useMobileOverride ? element.mobileOverrides!.x : element.x;
  const activeY = useMobileOverride ? element.mobileOverrides!.y : element.y;
  const activeW = useMobileOverride ? element.mobileOverrides!.width : element.width;
  const activeH = useMobileOverride ? element.mobileOverrides!.height : element.height;

  const normX = isNormalized ? (activeX / 100) * canvasWidth : activeX;
  const normY = isNormalized ? (activeY / 100) * canvasHeight : activeY;
  const normW = isNormalized ? (activeW / 100) * canvasWidth : activeW;
  const normH = isNormalized ? (activeH / 100) * canvasHeight : activeH;

  const [position, setPosition] = useState({ x: normX, y: normY });

  useEffect(() => {
    setPosition({ x: normX, y: normY });
  }, [normX, normY]);
  const [isMobile, setIsMobile] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const isUntouchable = element.isUntouchable;

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!isUntouchable) {
      controls.set({ x: normX, y: normY });
      return;
    }

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elRef.current) return;
      const rect = elRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      const threshold = 120;
      
      if (distance < threshold) {
        const angle = Math.atan2(distanceY, distanceX);
        const escapeDist = 180;
        
        let newX = position.x - Math.cos(angle) * escapeDist;
        let newY = position.y - Math.sin(angle) * escapeDist;
        
        const padding = 20;
        const maxX = canvasWidth - normW - padding;
        const maxY = canvasHeight - normH - padding;
        
        newX = Math.max(padding, Math.min(maxX, newX));
        newY = Math.max(padding, Math.min(maxY, newY));

        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [position, isMobile, isUntouchable, normX, normY, normW, normH, controls]);

  useEffect(() => {
    if (isUntouchable) {
      controls.start({
        opacity: element.opacity ?? 1,
        x: position.x,
        y: position.y,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  }, [position, controls, isUntouchable]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isUntouchable) {
      e.preventDefault();
      const maxX = canvasWidth - normW - 20;
      const maxY = canvasHeight - normH - 20;
      
      setPosition({
        x: Math.max(20, Math.random() * maxX),
        y: Math.max(20, Math.random() * maxY),
      });

      if (e.type === 'touchstart' && (e as React.TouchEvent).touches.length > 0) {
        const touch = (e as React.TouchEvent).touches[0];
        confetti({
          particleCount: 15, spread: 40,
          origin: { x: touch.clientX / window.innerWidth, y: touch.clientY / window.innerHeight },
          colors: ['#FF007F', '#00F0FF', '#ffffff'],
          disableForReducedMotion: true, zIndex: 1000
        });
      }
    } else {
      if (element.action) {
        onAction(element.action);
      }
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'shape':
        return (
          <div className="w-full h-full pointer-events-none" style={{
            backgroundColor: element.config.fill,
            borderRadius: element.config.shapeType === 'circle' ? '50%' : undefined,
            border: element.config.strokeWidth ? `${element.config.strokeWidth}px solid ${element.config.strokeColor || '#fff'}` : 'none',
            clipPath: element.config.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : element.config.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
          }} />
        );
      case 'text':
        return (
          <div style={{
            fontSize: (element.config.fontSize || 16) * fontSizeMultiplier,
            color: element.config.textColor || element.config.color,
            fontFamily: element.config.fontFamily,
            textAlign: element.config.textAlign as any || 'center',
            fontWeight: element.config.fontWeight || 'normal',
            fontStyle: element.config.fontStyle || 'normal',
            textDecoration: element.config.textDecoration || 'none',
            lineHeight: element.config.lineHeight || 1.2,
            letterSpacing: `${element.config.letterSpacing || 0}px`,
            wordBreak: 'break-word',
            width: '100%'
          }}>
            {element.config.text}
          </div>
        );
      case 'button': {
        const buttonStyle: React.CSSProperties = {
          fontSize: (element.config.fontSize || 16) * fontSizeMultiplier,
          backgroundColor: element.config.bgColor || undefined,
          color: element.config.textColor || undefined,
          fontWeight: element.config.fontWeight || 'bold',
          fontStyle: element.config.fontStyle || 'normal',
          textDecoration: element.config.textDecoration || 'none',
          fontFamily: element.config.fontFamily || undefined,
          textAlign: element.config.textAlign as any || 'center',
          lineHeight: element.config.lineHeight || 1.2,
          letterSpacing: `${element.config.letterSpacing || 0}px`,
        };
        return (
          <button 
            style={buttonStyle}
            className={cn(
              "w-full h-full flex items-center justify-center transition-transform",
              !isUntouchable && "hover:scale-105",
              !element.config.bgColor && (element.config.variant === 'primary' ? "bg-pink-500 text-white" : "bg-white/10 text-white border border-white/30 backdrop-blur-sm"),
              !element.config.textColor && !element.config.bgColor && "text-white"
            )}
            onClick={handleInteraction}
            onTouchStart={isUntouchable ? handleInteraction : undefined}
          >
            {element.config.text}
          </button>
        );
      }
      case 'sticker':
      case 'image':
        return (
          <img src={element.config.src} className="w-full h-full object-contain pointer-events-none" alt="" />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={elRef}
      className="absolute flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isUntouchable ? controls : { opacity: element.opacity ?? 1, scale: 1, x: normX, y: normY }}
      onAnimationStart={() => {
        if (isUntouchable) {
          controls.set({ scale: 1 });
        }
      }}
      style={{
        width: normW,
        height: normH,
        zIndex: element.zIndex,
        opacity: element.opacity ?? 1,
        top: 0,
        left: 0,
      }}
    >
      {/* Inner rotation wrapper */}
      <div
        className={cn("w-full h-full flex items-center justify-center", (!element.action && !isUntouchable) && "pointer-events-none")}
        style={{
          transform: `rotate(${element.rotation || 0}deg)`,
          borderRadius: element.borderRadius ? `${element.borderRadius}px` : (element.type === 'button' ? '9999px' : '0'),
          boxShadow: element.shadow || (element.type === 'button' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'),
          overflow: 'hidden',
        }}
      >
        {renderContent()}
      </div>
    </motion.div>
  );
};
