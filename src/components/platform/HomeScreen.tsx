/**
 * Home Screen - Platform Entry Point
 * Hua Jai Rak (หัวใจรัก) - Hearts of Love
 */

import { motion } from 'framer-motion';

interface HomeScreenProps {
  onStartGame: () => void;
  onContinue: () => void;
  hasSaveData: boolean;
}

export const HomeScreen = ({ onStartGame, onContinue, hasSaveData }: HomeScreenProps) => {
  return (
    <div className="h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 flex items-center justify-center p-2 md:p-4 overflow-hidden relative">
      {/* Animated background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-3xl md:text-4xl"
            initial={{ y: '100vh', x: `${Math.random() * 100}vw` }}
            animate={{
              y: '-20vh',
              x: `${Math.random() * 100}vw`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl w-full text-center relative z-10 flex flex-col justify-center">
        {/* Floating hearts decoration - hidden on mobile */}
        <motion.div
          className="hidden md:block absolute -top-16 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-5xl">💖</div>
        </motion.div>

        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.2, bounce: 0.5 }}
          className="mb-4 md:mb-6"
        >
          {/* Main Icon */}
          <motion.div
            className="text-6xl md:text-8xl mb-3 md:mb-4 inline-block"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💕
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-game text-white mb-2 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Hua Jai Rak
          </motion.h1>

          {/* Thai subtitle */}
          <motion.p
            className="text-2xl md:text-3xl font-game text-white/90 mb-1 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            หัวใจรัก
          </motion.p>

          {/* English subtitle */}
          <motion.p
            className="text-lg md:text-xl font-game text-white/80 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Hearts of Love
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6 md:mb-8"
        >
          <p className="text-xl md:text-2xl font-game text-white/95 mb-1 drop-shadow-lg">
            Game Collection
          </p>
          <p className="text-base md:text-lg font-game text-white/80 drop-shadow">
            Romance, Puzzles & Stories for Her
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-6 md:mb-8"
        >
          <div className="h-px w-16 bg-white/40"></div>
          <div className="text-2xl md:text-3xl">💖</div>
          <div className="h-px w-16 bg-white/40"></div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-3 md:space-y-4 max-w-md mx-auto"
        >
          <button
            onClick={onStartGame}
            className="w-full bg-white text-pink-600 hover:bg-pink-50 shadow-2xl transform hover:scale-105 transition-all duration-200 font-bold text-lg md:text-xl py-4 md:py-5 px-6 md:px-8 rounded-lg font-game"
          >
            <span className="flex items-center justify-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">💕</span>
              <span>Start Playing</span>
              <span className="text-xl md:text-2xl">💕</span>
            </span>
          </button>

          {hasSaveData && (
            <button
              onClick={onContinue}
              className="w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-white/40 font-bold text-base md:text-lg py-3 md:py-4 px-6 md:px-8 rounded-lg font-game"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg md:text-xl">📖</span>
                <span>Continue Story</span>
              </span>
            </button>
          )}
        </motion.div>

        {/* Features badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8 mb-4 md:mb-6"
        >
          {['GL Romance', 'Visual Novel', 'Mini Games', 'Multiple Endings'].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white font-game text-xs border border-white/30"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-white/70 text-xs md:text-sm font-game"
        >
          <p className="text-sm md:text-base">💖 Made with Love 💖</p>
          <p className="text-xs text-white/50 hidden md:block">
            Because every heart deserves a beautiful love story
          </p>
        </motion.div>

        {/* Side decorative hearts - desktop only */}
        <motion.div
          className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 text-5xl opacity-20"
          animate={{
            x: [0, 15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          💝
        </motion.div>
        <motion.div
          className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 text-5xl opacity-20"
          animate={{
            x: [0, -15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          💝
        </motion.div>
      </div>
    </div>
  );
};

