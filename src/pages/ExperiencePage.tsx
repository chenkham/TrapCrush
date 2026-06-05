import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug } from '../lib/mockDb';
import type { Page, CanvasElement } from '../lib/types';
import { AuroraBackground } from '../components/shared/AuroraBackground';
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Share2, Play, HeartCrack } from 'lucide-react';
import { InteractiveCanvasElement } from '../components/shared/InteractiveCanvasElement';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

import { CupidLoader } from '../components/shared/CupidLoader';

export const ExperiencePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (page && activeScreenId) {
      const screen = page.screens.find(s => s.id === activeScreenId);
      if (!screen) return;
      
      const imageUrls: string[] = [];
      if (screen.background?.type === 'image' && screen.background.value) {
        imageUrls.push(screen.background.value);
      }
      screen.elements.forEach(el => {
        if ((el.type === 'image' || el.type === 'sticker') && el.config.src) {
          imageUrls.push(el.config.src);
        }
      });

      if (imageUrls.length === 0) {
        setImagesPreloaded(true);
        return;
      }

      setImagesPreloaded(false);
      let loadedCount = 0;

      const checkDone = () => {
        if (loadedCount >= imageUrls.length) {
          setTimeout(() => setImagesPreloaded(true), 400); // Small delay to guarantee heart pulses at least once
        }
      };

      imageUrls.forEach(url => {
        const img = new Image();
        img.onload = () => { loadedCount++; checkDone(); };
        img.onerror = () => { loadedCount++; checkDone(); }; 
        img.src = url;
      });
    }
  }, [page, activeScreenId]);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (slug) {
      getPageBySlug(slug)
        .then(data => {
          if (data) {
            setPage(data);
            if (data.screens.length > 0) {
              setActiveScreenId(data.screens[0].id);
            }
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const handleAction = (action: CanvasElement['action']) => {
    if (!action) return;
    if (action.type === 'navigate') {
      if (action.targetId === 'success') {
        navigate(`/p/${slug}/accepted`, { state: { senderName: page?.sender_name } });
      } else if (action.targetId) {
        setActiveScreenId(action.targetId);
      }
    }
  };

  if (isLoading || !imagesPreloaded) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <CupidLoader size="xl" text="Loading surprise..." />
      </div>
    );
  }

  if (error || !page || !activeScreenId) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white">
        <HeartCrack className="w-16 h-16 text-pink-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-400">This trap doesn't exist or was deleted.</p>
      </div>
    );
  }

  const activeScreen = page.screens.find(s => s.id === activeScreenId);

  const isMobileView = viewportSize.width < 768;
  const canvasWidth = isMobileView ? 360 : 1024;
  const canvasHeight = isMobileView ? 640 : 576;

  const scaleX = viewportSize.width / canvasWidth;
  const scaleY = viewportSize.height / canvasHeight;
  const scale = Math.min(scaleX, scaleY);
  
  const originalTargetRatio = page.target_ratio || 'mobile';
  const fontSizeMultiplier = (isMobileView && originalTargetRatio === 'laptop') ? (360 / 1024) : (!isMobileView && originalTargetRatio === 'mobile') ? (1024 / 360) : 1;

  return (
    <div className={`theme-${page.theme} min-h-screen relative overflow-hidden font-[var(--font-body)] text-[var(--text)] bg-[var(--bg)] flex items-center justify-center`}>
      <AuroraBackground theme={page.theme} />
      
      <div 
        style={{
          width: canvasWidth * scale,
          height: canvasHeight * scale,
          position: 'relative',
        }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <div
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {activeScreen?.background?.type === 'image' && (
            <div className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none" style={{ backgroundImage: `url(${activeScreen.background.value})` }} />
          )}
          {activeScreen?.background?.type === 'color' && (
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: activeScreen.background.value }} />
          )}

          <AnimatePresence mode="wait">
            {activeScreen && (
              <motion.div
                key={activeScreen.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={cn("absolute inset-0 w-full h-full", activeScreen.nextScreenId && "cursor-pointer")}
                onClick={() => {
                  if (activeScreen.nextScreenId) {
                    if (activeScreen.nextScreenId === 'success') {
                      navigate(`/p/${slug}/accepted`, { state: { senderName: page?.sender_name } });
                    } else {
                      setActiveScreenId(activeScreen.nextScreenId);
                    }
                  }
                }}
              >
                {activeScreen.elements.map(el => (
                  <InteractiveCanvasElement 
                    key={el.id} 
                    element={el} 
                    onAction={handleAction} 
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    isMobileView={isMobileView}
                    fontSizeMultiplier={fontSizeMultiplier}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
