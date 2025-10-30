/**
 * Reusable Button Component
 * Styled game button with variants
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'font-game font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95';
  
  const variantClasses = {
    primary: 'bg-game-primary hover:bg-pink-600 text-white',
    secondary: 'bg-game-accent hover:bg-purple-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent border-2 border-game-primary text-game-primary hover:bg-game-primary hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:shadow-md active:scale-100'
    : 'cursor-pointer';

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${widthClasses}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

