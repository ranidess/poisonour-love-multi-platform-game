/**
 * Card Component
 * Container for game content sections
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const Card = ({
  children,
  className = '',
  padding = 'md',
  animate = true,
}: CardProps) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardContent = (
    <div
      className={`
        bg-white rounded-xl shadow-lg border-2 border-game-secondary
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {cardContent}
    </motion.div>
  );
};

