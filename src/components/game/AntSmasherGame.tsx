/**
 * Ant Smasher Game - Fast Reaction Arcade Game
 * Mouse click for desktop, touch tap for mobile
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// Types
interface Position {
  x: number;
  y: number;
}

interface Ant {
  id: number;
  position: Position;
  targetPosition: Position;
  speed: number;
  size: number;
  angle: number;
  isSmashed: boolean;
  isEscaped: boolean;
  isBomb?: boolean;
}

interface SmashEffect {
  id: number;
  position: Position;
}

interface AntSmasherGameProps {
  antsToSmash: number;
  timeLimit: number;
  antSpeed: number;
  spawnRate: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  onComplete: (score: number, stars: number) => void;
  onBack?: () => void;
}

// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const ANT_SIZE = 30;

export const AntSmasherGame = ({ 
  antsToSmash, 
  timeLimit, 
  antSpeed, 
  spawnRate, 
  difficulty, 
  onComplete, 
  onBack 
}: AntSmasherGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  
  const [ants, setAnts] = useState<Ant[]>([]);
  const [smashedCount, setSmashedCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [smashEffects, setSmashEffects] = useState<SmashEffect[]>([]);
  
  // Refs for game loop
  const antsRef = useRef<Ant[]>([]);
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const nextAntId = useRef(0);
  const lastSpawnTime = useRef(0);
  const comboTimerRef = useRef<number | null>(null);

  // Update refs
  useEffect(() => { antsRef.current = ants; }, [ants]);
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Spawn ants or bombs
  const spawnAnt = useCallback(() => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let startX, startY, targetX, targetY;
    
    // Spawn from edges
    switch (side) {
      case 0: // Top
        startX = Math.random() * CANVAS_WIDTH;
        startY = -ANT_SIZE;
        targetX = Math.random() * CANVAS_WIDTH;
        targetY = CANVAS_HEIGHT + ANT_SIZE;
        break;
      case 1: // Right
        startX = CANVAS_WIDTH + ANT_SIZE;
        startY = Math.random() * CANVAS_HEIGHT;
        targetX = -ANT_SIZE;
        targetY = Math.random() * CANVAS_HEIGHT;
        break;
      case 2: // Bottom
        startX = Math.random() * CANVAS_WIDTH;
        startY = CANVAS_HEIGHT + ANT_SIZE;
        targetX = Math.random() * CANVAS_WIDTH;
        targetY = -ANT_SIZE;
        break;
      default: // Left
        startX = -ANT_SIZE;
        startY = Math.random() * CANVAS_HEIGHT;
        targetX = CANVAS_WIDTH + ANT_SIZE;
        targetY = Math.random() * CANVAS_HEIGHT;
    }

    const dx = targetX - startX;
    const dy = targetY - startY;
    const angle = Math.atan2(dy, dx);
    
    // 15% chance to spawn a bomb instead of ant
    const isBomb = Math.random() < 0.15;

    const newAnt: Ant = {
      id: nextAntId.current++,
      position: { x: startX, y: startY },
      targetPosition: { x: targetX, y: targetY },
      speed: antSpeed,
      size: ANT_SIZE,
      angle: angle,
      isSmashed: false,
      isEscaped: false,
      isBomb: isBomb,
    };

    setAnts(prev => [...prev, newAnt]);
  }, [antSpeed]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      const now = Date.now();
      
      // Spawn new ants
      if (now - lastSpawnTime.current > spawnRate) {
        const currentAnts = antsRef.current;
        const activeAnts = currentAnts.filter(a => !a.isSmashed && !a.isEscaped);
        
        if (smashedCount + missedCount < antsToSmash && activeAnts.length < 15) {
          spawnAnt();
          lastSpawnTime.current = now;
        }
      }

      // Update ant positions
      setAnts(prev => {
        const updated = prev.map(ant => {
          if (ant.isSmashed || ant.isEscaped) return ant;

          const dx = ant.targetPosition.x - ant.position.x;
          const dy = ant.targetPosition.y - ant.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 5) {
            // Ant escaped
            setMissedCount(m => m + 1);
            setCombo(0);
            return { ...ant, isEscaped: true };
          }

          const moveX = (dx / distance) * ant.speed;
          const moveY = (dy / distance) * ant.speed;

          return {
            ...ant,
            position: {
              x: ant.position.x + moveX,
              y: ant.position.y + moveY,
            },
          };
        });

        // Remove escaped ants after delay
        return updated.filter(ant => !ant.isEscaped || ant.isSmashed);
      });
    };

    const intervalId = setInterval(gameLoop, 1000 / 60); // 60 FPS

    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, spawnRate, spawnAnt, smashedCount, missedCount, antsToSmash]);

  // Check win condition
  useEffect(() => {
    if (gameStarted && !gameOver && smashedCount >= antsToSmash) {
      endGame(true);
    }
  }, [smashedCount, antsToSmash, gameStarted, gameOver]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with grass background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#8BC34A');
    gradient.addColorStop(1, '#689F38');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grass texture
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = (i * 157) % CANVAS_WIDTH;
      const y = (i * 239) % CANVAS_HEIGHT;
      ctx.fillRect(x, y, 3, 8);
    }

    // Draw ants and bombs
    ants.forEach(ant => {
      if (ant.isSmashed || ant.isEscaped) return;

      ctx.save();
      ctx.translate(ant.position.x, ant.position.y);
      
      // If it's a bomb, draw bomb icon
      if (ant.isBomb) {
        // Draw bomb
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', 0, 0);
        ctx.restore();
        return;
      }
      
      // Rotate ant so HEAD points in direction of movement (add PI to flip)
      ctx.rotate(ant.angle + Math.PI);

      // Draw ant body (realistic ant - longer, thinner, segmented)
      const antColor = '#1a1a1a'; // Dark black/brown for ant
      
      // Abdomen (large oval at back)
      ctx.fillStyle = antColor;
      ctx.beginPath();
      ctx.ellipse(12, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Abdomen connection (petiole - thin segment)
      ctx.fillStyle = antColor;
      ctx.beginPath();
      ctx.ellipse(5, 0, 2, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thorax (middle section)
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head (smaller, round)
      ctx.beginPath();
      ctx.ellipse(-7, 0, 3.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs (thinner, more segments, realistic ant legs)
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      
      // Back legs (from abdomen connection)
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(7, -6);
      ctx.lineTo(10, -10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(7, 6);
      ctx.lineTo(10, 10);
      ctx.stroke();
      
      // Middle legs (from thorax)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-1, -7);
      ctx.lineTo(1, -11);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-1, 7);
      ctx.lineTo(1, 11);
      ctx.stroke();
      
      // Front legs (from thorax/head)
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-7, -9);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-6, 6);
      ctx.lineTo(-7, 9);
      ctx.stroke();

      // Antennae (longer, more realistic)
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(-8, -1);
      ctx.lineTo(-12, -5);
      ctx.lineTo(-14, -8);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(-8, 1);
      ctx.lineTo(-12, 5);
      ctx.lineTo(-14, 8);
      ctx.stroke();

      // Eyes (small dots)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-8, -1, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-8, 1, 0.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Add shine/highlight to make it look more 3D
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.ellipse(10, -1, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }, [ants]);

  // Handle click/touch
  const handleSmash = (clientX: number, clientY: number) => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if clicked on any ant or bomb
    let hitAnt = false;
    setAnts(prev => prev.map(ant => {
      if (ant.isSmashed || ant.isEscaped) return ant;

      const dx = ant.position.x - x;
      const dy = ant.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ant.size) {
        hitAnt = true;
        
        // Check if it's a bomb
        if (ant.isBomb) {
          // Hit bomb - lose points and reset combo!
          setScore(s => Math.max(0, s - 50));
          setCombo(0);
          setMissedCount(m => m + 1);
          
          // Add explosion effect
          setSmashEffects(prev => [...prev, { id: Date.now(), position: { x, y } }]);
          setTimeout(() => {
            setSmashEffects(prev => prev.filter(e => e.id !== Date.now()));
          }, 500);
          
          return { ...ant, isSmashed: true };
        }
        
        // Regular ant - calculate score with combo
        const comboMultiplier = Math.min(combo + 1, 10);
        const points = 10 * comboMultiplier;
        setScore(s => s + points);
        setSmashedCount(c => c + 1);
        setCombo(c => c + 1);

        // Reset combo timer
        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = window.setTimeout(() => setCombo(0), 2000);

        // Add smash effect
        setSmashEffects(prev => [...prev, { id: Date.now(), position: { x, y } }]);
        setTimeout(() => {
          setSmashEffects(prev => prev.filter(e => e.id !== Date.now()));
        }, 500);

        return { ...ant, isSmashed: true };
      }
      return ant;
    }));

    if (!hitAnt) {
      // Missed - reduce combo
      setCombo(0);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleSmash(e.clientX, e.clientY);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleSmash(touch.clientX, touch.clientY);
    }
  };

  const endGame = (won: boolean) => {
    setGameOver(true);
    setGameWon(won);

    const finalScore = score;
    const accuracy = smashedCount / (smashedCount + missedCount) * 100;
    const stars = won ? (accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1) : 0;

    setTimeout(() => onComplete(finalScore, stars), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-green-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="max-w-2xl text-center">
            <h2 className="text-4xl font-game text-game-primary mb-4">🐜 Ant Smasher</h2>
            <p className="text-xl font-game text-game-dark mb-6">
              Fast reflexes! Smash the invading ants!
            </p>
            <div className="mb-6 text-left bg-game-light rounded-lg p-6">
              <p className="font-game text-lg mb-3 font-bold">📋 How to Play:</p>
              <ul className="text-base font-game space-y-2">
                <li>• <strong>Desktop:</strong> Click on ants to smash them!</li>
                <li>• <strong>Mobile:</strong> Tap on ants to squash them!</li>
                <li>• Smash {antsToSmash} ants before time runs out</li>
                <li>• Build combos for bonus points! (2x, 3x, up to 10x)</li>
                <li>• <strong className="text-red-600">⚠️ AVOID BOMBS 💣 - They cost you 50 points!</strong></li>
                <li>• Don't let ants escape or you'll lose your combo</li>
                <li>• ⏱️ Time Limit: {formatTime(timeLimit)}</li>
                <li>• 🎯 Difficulty: {difficulty.toUpperCase()}</li>
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

    const accuracy = smashedCount / (smashedCount + missedCount) * 100;

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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-game text-green-600 mb-4">Victory!</h3>
                <p className="text-xl font-game text-game-dark mb-2">
                  All ants have been squashed!
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">💯 Score: {score} points</p>
                  <p className="font-game text-lg">🐜 Smashed: {smashedCount}/{antsToSmash}</p>
                  <p className="font-game text-lg">⏱️ Time: {formatTime(timeRemaining)} left</p>
                  <p className="font-game text-lg">🎯 Accuracy: {accuracy.toFixed(1)}%</p>
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
                  The ants got away!
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">💯 Score: {score}</p>
                  <p className="font-game text-lg">🐜 Smashed: {smashedCount}/{antsToSmash}</p>
                  <p className="font-game text-lg">🎯 Accuracy: {accuracy.toFixed(1)}%</p>
                </div>
                <p className="text-sm font-game text-gray-600">
                  Try again to beat this level!
                </p>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-green-200 p-2 sm:p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Card className="mb-2 sm:mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {onBack && (
                <Button 
                  onClick={onBack} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back
                </Button>
              )}
              <div>
                <h3 className="font-game text-lg sm:text-2xl text-game-primary mb-1">🐜 Ant Smasher</h3>
                <div className="flex gap-2 sm:gap-4 text-xs sm:text-base font-game text-gray-700">
                  <span>💯 Score: {score}</span>
                  <span>🐜 {smashedCount}/{antsToSmash}</span>
                  {combo > 0 && <span className="text-orange-600 font-bold">🔥 {combo}x</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={() => {
                  setGameStarted(false);
                  setGameOver(false);
                  setAnts([]);
                  setSmashedCount(0);
                  setMissedCount(0);
                  setScore(0);
                  setCombo(0);
                  setTimeRemaining(timeLimit);
                }} 
                variant="secondary" 
                size="sm"
              >
                🔄 Restart
              </Button>
              <div className={`
                font-game text-lg sm:text-2xl font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-lg
                ${timeRemaining <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 
                  timeRemaining <= 20 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-blue-100 text-blue-600'}
              `}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </Card>

        {/* Game Canvas */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-green-800 rounded-lg shadow-2xl max-w-full cursor-crosshair"
              style={{ 
                touchAction: 'none',
                backgroundColor: '#8BC34A'
              }}
              onClick={handleCanvasClick}
              onTouchStart={handleCanvasTouch}
            />
            
            {/* Smash effects */}
            <AnimatePresence>
              {smashEffects.map(effect => (
                <motion.div
                  key={effect.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: effect.position.x - 20,
                    top: effect.position.y - 20,
                    width: 40,
                    height: 40,
                  }}
                >
                  <div className="text-4xl">💥</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Instructions */}
          <Card className="w-full">
            <div className="text-center font-game text-sm sm:text-base">
              <p className="text-green-700 font-bold">
                🖱️ Click or Tap on ants to smash them! • <span className="text-red-600">⚠️ AVOID BOMBS 💣 (-50 pts)</span>
              </p>
              {combo > 1 && (
                <motion.p 
                  className="text-orange-600 font-bold text-lg mt-2"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  🔥 {combo}x COMBO! 🔥
                </motion.p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Game Over Overlay */}
      {renderGameOverOverlay()}
    </div>
  );
};


