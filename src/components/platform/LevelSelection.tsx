/**
 * Level Selection - For mini games
 */

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MiniGameLevel } from '../../types/platform.types';

interface LevelSelectionProps {
  gameTitle: string;
  levels: MiniGameLevel[];
  onLevelSelect: (levelId: string) => void;
  onBack: () => void;
}

export const LevelSelection = ({
  gameTitle,
  levels,
  onLevelSelect,
  onBack,
}: LevelSelectionProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'expert': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-game text-game-primary mb-2">
              {gameTitle}
            </h1>
            <p className="text-lg font-game text-gray-600">
              Select a level to play
            </p>
          </div>
          <Button onClick={onBack} variant="ghost" size="md">
            ← Back
          </Button>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const isLocked = !level.unlocked;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative ${isLocked ? 'opacity-50' : ''}`}>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-lg">
                      <div className="text-6xl">🔒</div>
                    </div>
                  )}

                  {/* Level Number Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold font-game shadow-lg">
                    {level.levelNumber}
                  </div>

                  {/* Level Info */}
                  <div className="pt-4">
                    <h3 className="text-2xl font-game text-game-dark mb-2">
                      {level.title}
                    </h3>
                    <p className="text-sm font-game text-gray-600 mb-4">
                      {level.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-game border-2 ${getDifficultyColor(level.difficulty)}`}>
                        {level.difficulty.toUpperCase()}
                      </span>
                      {/* Show time limit only for non-Carrom games */}
                      {level.gameId !== 'carrom_master' && (
                        <span className="px-3 py-1 rounded-full text-xs font-game bg-blue-100 text-blue-700 border-2 border-blue-300">
                          ⏱️ {level.timeLimit}s
                        </span>
                      )}
                    </div>

                    {/* Best Score */}
                    {level.completed && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-game text-gray-600">Best Score:</span>
                          <span className="text-lg font-game text-green-700 font-bold">{level.bestScore}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={i < level.stars ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Play Button */}
                    <Button
                      onClick={() => !isLocked && onLevelSelect(level.id)}
                      disabled={isLocked}
                      variant={level.completed ? 'secondary' : 'primary'}
                      size="md"
                      fullWidth
                    >
                      {isLocked ? '🔒 Locked' : level.completed ? '🔄 Replay' : '▶ Play'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

