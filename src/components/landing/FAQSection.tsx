import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Is TrapCrush really free?",
    answer: "Yes! 100% free. You can create up to 5 traps at a time. To keep the magic fresh, if a trap is left unopened for 3 days, the link will automatically expire and self-destruct."
  },
  {
    question: "Can they actually say no?",
    answer: "Technically... no! The 'No' button literally runs away from their cursor. After enough attempts, it transforms into another 'Yes' button. It's all in good fun! 😄"
  },
  {
    question: "How does the runaway button work?",
    answer: "On desktop, the No button detects your mouse position and springs away using physics-based animations. On mobile, it teleports to a random spot when tapped. It feels alive and playful!"
  },
  {
    question: "Can I customize everything?",
    answer: "Absolutely! Our Canva-style drag & drop editor lets you customize text, buttons, colors, fonts, backgrounds, shapes, stickers, and more. Add multiple screens and connect them with navigation flows."
  },
  {
    question: "What happens after they click Yes?",
    answer: "A beautiful confetti celebration explodes on screen with a custom victory message! You can personalize the success page with your own text and add a 'Text me now' call-to-action."
  },
  {
    question: "Can I share it with anyone?",
    answer: "Yes! Every page gets a unique link you can share via text, WhatsApp, Instagram DMs, or anywhere. Works beautifully on all devices and browsers — no app download needed."
  },
  {
    question: "Is my data private?",
    answer: "Your pages are only accessible via their unique link. We don't share or sell any data. Your romantic gestures stay between you and your crush. 🔒"
  },
  {
    question: "What themes are available?",
    answer: "6 stunning themes: Dreamy Rose (romantic), Midnight Glow (elegant dark), Sunny Chaos (bold & fun), Vintage Film (warm & nostalgic), Arcade Retro (gaming vibes), and Garden Party (botanical elegance)."
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQ_DATA.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-white/10 overflow-hidden"
            style={{ background: isOpen ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.03)' }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors hover:bg-white/5"
            >
              <span className={`font-semibold text-sm sm:text-base pr-4 transition-colors ${isOpen ? 'text-pink-400' : 'text-white'}`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0"
              >
                <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-pink-400' : 'text-gray-500'}`} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
