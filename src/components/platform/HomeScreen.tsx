/**
 * Home Screen - Platform Entry Point
 * Professional Gaming Platform
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginButton } from '../auth/LoginButton';
import { UserProfile } from '../auth/UserProfile';

interface HomeScreenProps {
  onStartGame: () => void;
}

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  const { isAuthenticated, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartGame = () => {
    if (isAuthenticated) {
      onStartGame();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 flex items-center justify-center p-2 md:p-4 overflow-hidden relative">
      {/* User Profile - Top Right */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-20">
          <UserProfile />
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎮</div>
              <h2 className="text-2xl font-game text-game-primary mb-2">Welcome Back!</h2>
              <p className="text-gray-600 font-game">
                Sign in with Google to save your game progress
              </p>
            </div>
            
            <LoginButton onSuccess={() => {
              setShowLoginModal(false);
              setTimeout(() => onStartGame(), 300);
            }} />
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                onStartGame();
              }}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 font-game text-sm underline"
            >
              Continue without signing in
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎮', '🎯', '🧠', '⭐', '🎲', '🏆'].map((emoji, i) => (
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
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl w-full text-center relative z-10 flex flex-col justify-center">
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
            🎮
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
          <p className="text-lg md:text-xl font-game text-white/95 mb-2 drop-shadow-lg">
            Game Collection
          </p>
          <p className="text-base md:text-lg font-game text-white/80 drop-shadow">
            Memory Games • Classic Board Games • Brain Teasers
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-6 md:mb-8"
        >
          <div className="h-px w-20 bg-white/40"></div>
          <div className="text-2xl md:text-3xl">⭐</div>
          <div className="h-px w-20 bg-white/40"></div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-3 md:space-y-4 max-w-md mx-auto"
        >
          <button
            onClick={handleStartGame}
            className="w-full bg-white text-pink-600 hover:bg-pink-50 shadow-2xl transform hover:scale-105 transition-all duration-200 font-bold text-lg md:text-xl py-4 md:py-5 px-6 md:px-8 rounded-lg font-game"
          >
            {isAuthenticated ? `Play Games, ${user?.name?.split(' ')[0]}!` : 'Start Playing'}
          </button>

          {!isAuthenticated && (
            <div className="text-center pt-2">
              <p className="text-white/90 font-game text-sm mb-3">
                💡 Sign in to save your progress across devices
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-8 md:mt-12 text-white/70 text-xs md:text-sm font-game"
        >
          {/* Copyright Information */}
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs md:text-sm text-white/80 font-semibold">
              Akanksha Gauns Dessai
            </p>
            <p className="text-xs text-white/60 mt-1">
              Lisha Tech
            </p>
            <p className="text-xs text-white/50 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

