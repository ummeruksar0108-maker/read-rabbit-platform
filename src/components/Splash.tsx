import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Award, Zap, ArrowRight, Compass } from "lucide-react";

interface SplashProps {
  onEnter: () => void;
}

export default function Splash({ onEnter }: SplashProps) {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } else {
        current += Math.floor(Math.random() * 15) + 5;
        setLoadingPercent(Math.min(current, 100));
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-9999 bg-gradient-to-br from-white to-[#fff2e1] flex flex-col justify-center items-center p-6 select-none">
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute -inset-6 bg-[#fd9b65]/10 rounded-full blur-xl animate-pulse"></div>
          {/* Stylized Rabbit Logo Card */}
          <div className="w-40 h-40 rounded-3xl shadow-lg bg-white flex items-center justify-center border-4 border-[#40010d]/10 overflow-hidden transform hover:scale-105 transition-all duration-300">
            <img
              alt="Read Rabbit Logo"
              src="/src/assets/images/logo.png"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-[#40010d] tracking-tight text-center">
          READ RABBIT
        </h1>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#95491a] font-semibold mt-3 text-center">
          A Burrow of Knowledge
        </p>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-[#f8e6cb] rounded-full mt-12 overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#fd9b65] transition-all duration-150 ease-out rounded-full"
            style={{ width: `${loadingPercent}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-2 text-[#877272]">{loadingPercent}%</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f3] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft atmospheric background blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#fd9b65]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#accec2]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl text-center z-10 flex flex-col items-center px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8e6cb] text-[#753101] mb-8 shadow-xs border border-[#dac1c1]/20">
          <Compass size={16} className="text-[#95491a]" />
          <span className="text-xs font-sans font-bold tracking-wider uppercase">Curated Study Guides</span>
        </div>

        <h2 className="font-sans text-4xl md:text-6xl font-extrabold text-[#40010d] mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#95491a] to-[#fd9b65]">READ RABBIT</span>
        </h2>
        <p className="font-sans text-lg md:text-xl text-[#544243] mb-12 max-w-xl leading-relaxed">
          Knowledge stored by <span className="text-[#95491a] font-semibold underline decoration-[#fd9b65]/40 decoration-2">seniors</span>, discovered by <span className="text-[#6b8a80] font-semibold underline decoration-[#accec2]/60 decoration-2">juniors</span>.
        </p>

        {/* Enter Burrow Button */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#40010d] text-white rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer font-sans font-bold text-lg"
        >
          <div className="absolute inset-0 bg-[#95491a] opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="flex items-center gap-3">
            Enter The Burrow
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-2 duration-200" />
          </span>
        </button>

        {/* Feature Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
        >
          {/* Card 1 */}
          <div className="bg-[#fff2e1] p-6 rounded-2xl border border-[#dac1c1]/20 hover:border-[#fd9b65]/40 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#fd9b65]/20 flex items-center justify-center text-[#95491a] mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#40010d] mb-2">The Library</h3>
            <p className="font-sans text-sm text-[#544243] leading-relaxed">
              Over 1,200 curated note sets and code guides from top-tier alumni.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fff2e1] p-6 rounded-2xl border border-[#dac1c1]/20 hover:border-[#fd9b65]/40 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#accec2]/30 flex items-center justify-center text-[#2e4c43] mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#40010d] mb-2">Senior Advice</h3>
            <p className="font-sans text-sm text-[#544243] leading-relaxed">
              Real-world advice and blueprints for navigating the trickiest exams.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fff2e1] p-6 rounded-2xl border border-[#dac1c1]/20 hover:border-[#fd9b65]/40 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#ffdada] flex items-center justify-center text-[#ba1a1a] mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#40010d] mb-2">Study Sprints</h3>
            <p className="font-sans text-sm text-[#544243] leading-relaxed">
              Interactive sessions to help you master concepts and test your knowledge.
            </p>
          </div>
        </motion.div>

        {/* Creator Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-xs font-sans text-[#877272] tracking-wider"
        >
          Created with 🧡 by <span className="font-bold text-[#40010d]">Umme Ruksar</span> & <span className="font-bold text-[#40010d]">Balaji C</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
