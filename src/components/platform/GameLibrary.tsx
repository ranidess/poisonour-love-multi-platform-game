/**
 * Game Library - Shows all available games
 */

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { GameInfo } from '../../types/platform.types';

interface GameLibraryProps {
  games: GameInfo[];
  onGameSelect: (gameId: string) => void;
  onBack: () => void;
}

export const GameLibrary = ({ games, onGameSelect, onBack }: GameLibraryProps) => {
  const miniGames = games.filter(g => g.category === 'minigame');

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-accent to-game-light p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-game text-game-primary mb-2">
              🎮 Game Library
            </h1>
            <p className="text-lg font-game text-gray-600">
              Choose your game
            </p>
          </div>
          <Button onClick={onBack} variant="ghost" size="md">
            ← Back
          </Button>
        </div>

        {/* Mini Games Section */}
        <div>
          <h2 className="text-3xl font-game text-game-dark mb-6 flex items-center gap-2">
            <span>🎯</span>
            <span>Available Games</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative ${game.isLocked ? 'opacity-60' : ''}`}>
                  {game.isLocked && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-lg">
                      <div className="text-5xl">🔒</div>
                    </div>
                  )}

                  {/* Game Icon */}
                  <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-6xl mb-4 shadow-inner">
                    {game.icon}
                  </div>

                  {/* Game Info */}
                  <h3 className="text-xl font-game text-game-dark mb-2">
                    {game.title}
                  </h3>
                  <p className="text-xs font-game text-gray-500 mb-2">
                    {game.subtitle}
                  </p>
                  <p className="text-sm font-game text-gray-600 mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-game bg-blue-100 text-blue-700">
                      ⏱️ {game.estimatedTime}
                    </span>
                  </div>

                  {/* Play Button */}
                  <Button
                    onClick={() => !game.isLocked && onGameSelect(game.id)}
                    disabled={game.isLocked}
                    variant="primary"
                    size="sm"
                    fullWidth
                  >
                    {game.isLocked ? '🔒 Locked' : '▶ Play'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

