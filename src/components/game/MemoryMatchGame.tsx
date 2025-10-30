/**
 * Memory Match Game - Fixed Version
 * Match pairs of cards within time limit
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface MemoryCard {
  id: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  uniqueId: string;
}

interface MemoryMatchGameProps {
  pairs: Array<{ id: string; emoji: string; name: string }>;
  timeLimit: number;
  onComplete: (score: number, stars: number) => void;
}

export const MemoryMatchGame = ({ pairs, timeLimit, onComplete }: MemoryMatchGameProps) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize cards
  useEffect(() => {
    const gameCards: MemoryCard[] = [];
    pairs.forEach((pair, index) => {
      gameCards.push({
        ...pair,
        isFlipped: false,
        isMatched: false,
        uniqueId: `${pair.id}_1_${index}`,
      });
      gameCards.push({
        ...pair,
        isFlipped: false,
        isMatched: false,
        uniqueId: `${pair.id}_2_${index}`,
      });
    });
    
    // Shuffle cards
    setCards(gameCards.sort(() => Math.random() - 0.5));
  }, [pairs]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          setGameWon(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Check for game win
  useEffect(() => {
    if (matches === pairs.length && gameStarted && matches > 0) {
      setGameOver(true);
      setGameWon(true);
      
      // Calculate score
      const baseScore = 500;
      const timeBonus = Math.floor((timeRemaining / timeLimit) * 300);
      const movesPenalty = Math.max(0, (moves - pairs.length * 2) * 10);
      const totalScore = Math.max(100, baseScore + timeBonus - movesPenalty);
      
      const stars = totalScore >= 800 ? 3 : totalScore >= 600 ? 2 : totalScore >= 300 ? 1 : 0;
      
      setTimeout(() => onComplete(totalScore, stars), 2000);
    }
  }, [matches, pairs.length, gameStarted, timeRemaining, timeLimit, moves, onComplete]);

  // Handle time up
  useEffect(() => {
    if (gameOver && !gameWon) {
      // Failed - time ran out
      setTimeout(() => onComplete(0, 0), 2000);
    }
  }, [gameOver, gameWon, onComplete]);

  const handleCardClick = (uniqueId: string) => {
    if (!gameStarted || flippedCards.length >= 2 || gameOver) return;
    
    const card = cards.find((c) => c.uniqueId === uniqueId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, uniqueId];
    setFlippedCards(newFlipped);
    
    setCards((prev) =>
      prev.map((c) => (c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards.find((c) => c.uniqueId === newFlipped[0]);
      const card2 = cards.find((c) => c.uniqueId === newFlipped[1]);

      if (card1 && card2 && card1.id === card2.id) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === newFlipped[0] || c.uniqueId === newFlipped[1]
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === newFlipped[0] || c.uniqueId === newFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="max-w-2xl text-center">
            <h2 className="text-4xl font-game text-game-primary mb-4">🧠 Memory Match</h2>
            <p className="text-xl font-game text-game-dark mb-6">
              Match all pairs of cards before time runs out!
            </p>
            <div className="mb-6 text-left bg-game-light rounded-lg p-6">
              <p className="font-game text-lg mb-3 font-bold">📋 Rules:</p>
              <ul className="text-base font-game space-y-2">
                <li>• Click cards to flip them over</li>
                <li>• Match pairs of identical items</li>
                <li>• Complete all pairs before time runs out!</li>
                <li>• Fewer moves = higher score</li>
                <li>• ⏱️ Time Limit: {formatTime(timeLimit)}</li>
              </ul>
            </div>
            <Button onClick={() => setGameStarted(true)} size="lg" variant="primary">
              🎮 Start Game
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Game over overlay
  const renderGameOverOverlay = () => {
    if (!gameOver) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-md text-center">
            {gameWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-game text-green-600 mb-4">Success!</h3>
                <p className="text-xl font-game text-game-dark mb-2">
                  All pairs matched!
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">⏱️ Time: {formatTime(timeRemaining)} left</p>
                  <p className="font-game text-lg">🎯 Moves: {moves}</p>
                  <p className="font-game text-lg">💯 Matches: {matches}/{pairs.length}</p>
                </div>
                <p className="text-sm font-game text-gray-600">
                  Returning to level select...
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-3xl font-game text-red-600 mb-4">Time's Up!</h3>
                <p className="text-xl font-game text-game-dark mb-4">
                  You didn't complete all matches in time.
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">💔 Matches: {matches}/{pairs.length}</p>
                  <p className="font-game text-lg">🎯 Moves: {moves}</p>
                </div>
                <p className="text-sm font-game text-gray-600">
                  Try again to unlock the next level!
                </p>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-game text-2xl text-game-primary mb-1">🧠 Memory Match</h3>
              <div className="flex gap-4 text-base font-game text-gray-700">
                <span>💯 Matches: {matches}/{pairs.length}</span>
                <span>🎯 Moves: {moves}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Timer Display */}
              <div className={`
                font-game text-2xl font-bold px-6 py-3 rounded-lg
                ${timeRemaining <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 
                  timeRemaining <= 30 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-blue-100 text-blue-600'}
              `}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          <AnimatePresence>
            {cards.map((card) => (
              <motion.button
                key={card.uniqueId}
                onClick={() => handleCardClick(card.uniqueId)}
                whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: (card.isFlipped || card.isMatched) ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`
                  aspect-square rounded-lg p-4 text-4xl sm:text-5xl font-bold
                  flex items-center justify-center
                  ${card.isMatched ? 'bg-green-200 border-green-500 cursor-default' :
                    card.isFlipped ? 'bg-white border-purple-500' :
                    'bg-gradient-to-br from-purple-300 to-pink-300 border-purple-400 cursor-pointer'}
                  border-4 shadow-xl transition-all
                  ${!card.isMatched && !gameOver ? 'hover:shadow-2xl' : ''}
                `}
                disabled={gameOver}
              >
                <span style={{ transform: 'rotateY(180deg)' }}>
                  {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Game Over Overlay */}
      {renderGameOverOverlay()}
    </div>
  );
};

