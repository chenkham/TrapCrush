import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircleHeart, PartyPopper, Heart } from 'lucide-react';
import { ConfettiTrigger } from '../components/shared/ConfettiTrigger';
import { AuroraBackground } from '../components/shared/AuroraBackground';

export const VictoryPage: React.FC = () => {
  const location = useLocation();
  const senderName = location.state?.senderName || 'them';

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      <AuroraBackground theme="dreamy-rose" />
      <ConfettiTrigger duration={5000} />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.6, duration: 1 }}
        className="text-center z-10 max-w-2xl"
      >
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-8 flex justify-center"
        >
          <Heart className="w-28 h-28 md:w-36 md:h-36 text-pink-500 fill-pink-500 drop-shadow-[0_0_40px_rgba(255,62,108,0.5)]" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          YAY! <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            It's a YES!
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
          (To be fair, you didn't really have a choice.) <br/>
          Now go tell {senderName} the good news!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`sms:?body=I said YES!`}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_0_30px_rgba(255,62,108,0.4)] hover:shadow-[0_0_50px_rgba(255,62,108,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            <MessageCircleHeart className="w-6 h-6" />
            Text {senderName}
          </a>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full backdrop-blur-md transition-all w-full sm:w-auto"
          >
            <PartyPopper className="w-5 h-5 text-yellow-400" />
            Create Your Own Trap
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
