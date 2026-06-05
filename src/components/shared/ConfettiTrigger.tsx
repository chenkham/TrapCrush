import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  duration?: number;
}

export const ConfettiTrigger: React.FC<Props> = ({ duration = 3000 }) => {
  useEffect(() => {
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF007F', '#FF3E6C', '#ffffff', '#00F0FF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF007F', '#FF3E6C', '#ffffff', '#00F0FF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF007F', '#FF3E6C', '#ffffff', '#00F0FF']
    });

    frame();
  }, [duration]);

  return null; // pure behavior component
};
