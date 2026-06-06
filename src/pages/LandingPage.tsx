import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Wand2, Palette, MousePointerClick, Send, Layers, Monitor,
  Share2, Shield, CreditCard, Infinity as InfinityIcon, Check, ArrowRight,
  XCircle, Mail, Gift, Gem, PartyPopper, Plane, Star, HeartHandshake
} from 'lucide-react';
import { AuroraBackground } from '../components/shared/AuroraBackground';
import { CoupleAnimation } from '../components/shared/CoupleAnimation';
import { PhoneMockup } from '../components/landing/PhoneMockup';
import { StatsCounter } from '../components/landing/StatsCounter';
import { TestimonialCard } from '../components/landing/TestimonialCard';
import { ThemeShowcase } from '../components/landing/ThemeShowcase';
import { FAQSection } from '../components/landing/FAQSection';
import { PURPOSES } from '../lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as any } },
};

const features = [
  { icon: MousePointerClick, title: 'Unrejectable', description: 'The No button runs away. Literally. Your crush has no choice.', gradient: 'from-pink-500 to-rose-600' },
  { icon: Palette, title: '6 Stunning Themes', description: 'From romantic to retro arcade, pick the perfect vibe.', gradient: 'from-violet-500 to-purple-600' },
  { icon: Layers, title: 'Drag & Drop Editor', description: 'Canva-style visual builder. No coding needed.', gradient: 'from-cyan-500 to-blue-600' },
  { icon: Wand2, title: 'Multi-Screen Flows', description: 'Create multi-page experiences with navigation.', gradient: 'from-amber-500 to-orange-600' },
  { icon: Monitor, title: 'Works Everywhere', description: 'Desktop, mobile, tablet. Responsive & beautiful.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Share2, title: 'Share Instantly', description: 'One link. Works on WhatsApp, Instagram, anywhere.', gradient: 'from-fuchsia-500 to-pink-600' },
];

const steps = [
  { num: 1, icon: Heart, title: 'Pick Your Vibe', desc: 'Choose from 8 templates & 6 gorgeous themes' },
  { num: 2, icon: Wand2, title: 'Make It Yours', desc: 'Drag, drop, customize everything in the editor' },
  { num: 3, icon: Send, title: 'Share & Watch', desc: 'Send the link and enjoy the chaos' },
];

const purposeIcons: Record<string, React.FC<{ className?: string }>> = {
  Heart: Heart,
  MailHeart: Mail,
  Gift: Gift,
  Gem: Gem,
  PartyPopper: PartyPopper,
  ListHeart: HeartHandshake,
  Plane: Plane,
  Wand2: Wand2,
};

const purposeGradients = [
  'from-pink-500 to-rose-500',
  'from-fuchsia-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-pink-500',
  'from-indigo-500 to-violet-500',
  'from-purple-500 to-fuchsia-500',
];

const testimonials = [
  { name: 'Happy Boyfriend', quote: "He literally could not say no. Best $0 I ever spent. We've been dating for 3 months now!", avatar: 'HB', role: 'Successfully Trapped', rating: 5 },
  { name: 'Anonymous User', quote: "I sent it as a joke but she loved it so much she screenshot it and posted on Instagram. We're official now!", avatar: 'AU', role: 'Accidental Romeo', rating: 5 },
  { name: 'Long-term Partner', quote: "The themes are gorgeous and the runaway button had us both laughing. Perfect icebreaker for our anniversary.", avatar: 'LP', role: 'Anniversary Expert', rating: 5 },
];

const stats = [
  { value: 12847, suffix: '+', label: 'Pages Created', icon: 'Flame' },
  { value: 98, suffix: '.7%', label: 'Success Rate', icon: 'Heart' },
  { value: 0, suffix: '', label: 'Rejections', icon: 'Target' },
];

const FloatingHeartsOverlay: React.FC = () => (
  <div className="floating-hearts">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="heart-particle">
        <Heart className="w-full h-full fill-current" />
      </span>
    ))}
  </div>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">

      {/* ========== SECTION 1: HERO ========== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <AuroraBackground theme="midnight-glow" />
        <FloatingHeartsOverlay />

        <div className="relative z-10 w-full max-w-7xl mx-auto pt-24 pb-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
            
            {/* Left: Text Content */}
            <div className="text-left w-full relative z-10">
              
              <div className="relative">
                {/* Text constrained on mobile so it doesn't overlap the phone */}
                <div className="w-[55%] sm:w-[60%] lg:w-full relative z-10 min-h-[250px] lg:min-h-0">
                  <motion.h1
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-400">
                      They Can't
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                      Say No
                    </span>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed pr-2 lg:pr-0"
                  >
                    Create a stunning, interactive page for your crush. With a button they{' '}
                    <span className="text-pink-400 font-semibold">literally cannot click</span>.
                  </motion.p>
                </div>
              </div>

              {/* Buttons pushed down via mt-12, now clear of the phone mockup */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-col sm:flex-row gap-4 justify-start mt-4 lg:mt-8 relative z-20"
              >
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-white text-sm cursor-pointer relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      boxShadow: '0 4px 25px rgba(236,72,153,0.4)',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Create Yours Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </Link>
                <Link to="/templates">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border border-white/15 text-white cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center gap-2"
                  >
                    Browse Templates <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Phone Mockup + Couple Animation (Positioned absolute on mobile, relative to text block, but normal grid on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute right-[-10px] top-4 sm:right-0 lg:relative lg:right-auto lg:top-auto flex justify-center transform scale-[0.55] sm:scale-[0.65] lg:scale-100 origin-top-right lg:origin-center z-0 pointer-events-none lg:pointer-events-auto"
            >
              <CoupleAnimation className="hidden lg:block absolute -top-16 -left-12 w-40 h-40 opacity-60" />
              <PhoneMockup />
            </motion.div>
          </div>

          {/* Stats Counter */}
          <StatsCounter stats={stats} />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-pink-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* ========== SECTION 2: BEFORE/AFTER ========== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-1 section-glow-pink">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Stop Sending <span className="text-gray-500 line-through">Boring Texts</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Turn a forgettable message into an unforgettable experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1.5">
                <XCircle className="w-3 h-3" /> Before
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-400 max-w-[200px]">
                      hey
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-400 max-w-[250px]">
                      wanna go out sometime?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-blue-300 max-w-[100px]">
                      lol
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-blue-300 max-w-[150px]">
                      maybe...
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 text-gray-600 text-xs flex items-center justify-center gap-1.5">
                  <XCircle className="w-3 h-3 text-gray-500" /> Left on read
                </div>
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold z-10 flex items-center gap-1.5">
                <Wand2 className="w-3 h-3" /> After TrapCrush
              </div>
              <div className="p-6 rounded-2xl border border-pink-500/15 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
                <div className="text-center space-y-3">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Will you go on a date with me?
                  </div>
                  <p className="text-gray-400 text-xs">— with a button they can't click</p>
                  <div className="flex gap-3 justify-center pt-2">
                    <div className="px-5 py-2 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                      Yes!
                    </div>
                    <div className="px-5 py-2 rounded-full text-sm font-bold border border-white/15 text-gray-400 italic flex items-center gap-1">
                      No <span className="text-[10px] text-gray-500 ml-1">runs away</span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    {[Heart, Wand2, Star, Heart, Wand2].map((Icon, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                        className="text-pink-400/70"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-4 text-green-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Wand2 className="w-3 h-3" /> She said YES!
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: FEATURES ========== */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-2 section-glow-cyan">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">TrapCrush?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to create the ultimate unrefusable experience</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl border border-white/8 cursor-default transition-all duration-300 hover:border-white/15"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: USE CASES (BENTO GRID) ========== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-3 section-glow-amber">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              For Every <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-amber-400">Occasion</span>
            </h2>
            <p className="text-gray-400 text-lg">8 templates for every romantic moment</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PURPOSES.map((p, i) => {
              const isLarge = i === 0 || i === 3;
              const IconComponent = purposeIcons[p.icon] || Heart;
              const gradient = purposeGradients[i % purposeGradients.length];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`p-5 rounded-2xl border border-white/8 cursor-pointer transition-all duration-300 hover:border-pink-500/20 hover:bg-pink-500/[0.03] ${isLarge ? 'md:col-span-2 md:row-span-1' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <Link to="/create" className="block h-full">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{p.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{p.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: THEME SHOWCASE ========== */}
      <section id="themes" className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-4 section-glow-purple">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              6 Gorgeous <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">Themes</span>
            </h2>
            <p className="text-gray-400 text-lg">Each theme has its own personality. Find yours.</p>
          </motion.div>
          <ThemeShowcase />
        </div>
      </section>

      {/* ========== SECTION 6: HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-5 section-glow-purple">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Three Steps to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">Magic</span>
            </h2>
            <p className="text-gray-400 text-lg">From zero to unforgettable in under 5 minutes</p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-[2px]"
              style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #22d3ee)' }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-5">
                  <step.icon className="w-7 h-7 text-pink-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: TESTIMONIALS ========== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative immersive-section section-bg-6 section-glow-cyan">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Love Stories, Powered by <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">TrapCrush</span>
            </h2>
            <p className="text-gray-400 text-lg">Real people, real results, real love</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} {...t} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: FAQ ========== */}
      <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 relative bg-gradient-to-b from-[#0a1020] via-[#15082a] to-[#0a0a1a] immersive-section">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Questions</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to know</p>
          </motion.div>
          <FAQSection />
        </div>
      </section>

      {/* ========== SECTION 9: TRUST SECTION ========== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 relative bg-gradient-to-b from-[#0a0a1a] via-[#0d0d1f] to-[#0a0a1a] immersive-section section-glow-pink">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Free Forever. <span className="text-pink-400">No Catch.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { icon: CreditCard, label: 'No Credit Card' },
              { icon: Shield, label: 'No Hidden Fees' },
              { icon: InfinityIcon, label: '5 Limited Pages' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-green-500/15 bg-green-500/5"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white font-semibold text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========== SECTION 10: FINAL CTA ========== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative bg-gradient-to-b from-[#0a0a1a] via-[#1a0520] to-[#0a0a1a] immersive-section">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
        </div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-6 flex justify-center"
          >
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
          </motion.div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">trap your crush?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join 12,000+ romantics who made their move unforgettable
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full font-bold text-white text-lg cursor-pointer relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                boxShadow: '0 4px 30px rgba(236,72,153,0.4), 0 0 60px rgba(236,72,153,0.1)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Building <ArrowRight className="w-5 h-5" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
