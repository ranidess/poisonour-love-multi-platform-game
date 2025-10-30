/**
 * Timer Component
 * Countdown timer for cooking rounds
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimerProps {
  totalTime: number;
  isRunning: boolean;
  onComplete?: () => void;
  onTick?: (remaining: number) => void;
  showWarning?: boolean;
  warningThreshold?: number;
}

export const Timer = ({
  totalTime,
  isRunning,
  onComplete,
  onTick,
  showWarning = true,
  warningThreshold = 10,
}: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState(totalTime);

  useEffect(() => {
    setRemainingTime(totalTime);
  }, [totalTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - 1);
        onTick?.(newTime);

        if (newTime === 0) {
          onComplete?.();
          clearInterval(interval);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, onTick]);

  const percentage = (remainingTime / totalTime) * 100;
  const isWarning = showWarning && remainingTime <= warningThreshold;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isWarning) return 'text-red-600';
    if (percentage < 50) return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-game text-game-dark">Time</span>
        <motion.span
          className={`text-2xl font-bold font-game ${getTimerColor()}`}
          animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
        >
          {formatTime(remainingTime)}
        </motion.span>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isWarning
              ? 'bg-red-500'
              : percentage < 50
              ? 'bg-orange-500'
              : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

