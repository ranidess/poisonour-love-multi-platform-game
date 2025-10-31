/**
 * Snake Game - Classic Arcade Game
 * Mouse control for desktop, arrow buttons for mobile
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// Types
interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  foodTarget: number;
  speed: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  onComplete: (score: number, stars: number) => void;
  onBack?: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Constants
const GRID_SIZE = 20; // Each cell is 20px
const BOARD_WIDTH = 20; // 20 cells wide
const BOARD_HEIGHT = 20; // 20 cells tall
const CANVAS_WIDTH = BOARD_WIDTH * GRID_SIZE;
const CANVAS_HEIGHT = BOARD_HEIGHT * GRID_SIZE;

export const SnakeGame = ({ foodTarget, speed, difficulty, onComplete, onBack }: SnakeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [foodEaten, setFoodEaten] = useState(0);
  
  // Snake state
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [currentFoodEmoji, setCurrentFoodEmoji] = useState('🍎');
  
  // Food emojis for variety
  const foodEmojis = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍', '🥭', '🍏', '🍐'];
  
  // Refs to avoid stale closures
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(nextDirection);
  const foodRef = useRef(food);
  const gameStartedRef = useRef(gameStarted);
  const gameOverRef = useRef(gameOver);

  // Update refs when state changes
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { nextDirectionRef.current = nextDirection; }, [nextDirection]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Generate random food position
  const generateFood = useCallback(() => {
    const currentSnake = snakeRef.current;
    let newFood: Position;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    // Select random food emoji
    const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    setCurrentFoodEmoji(randomEmoji);
    setFood(newFood);
  }, [foodEmojis]);

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setFoodEaten(0);
    setGameOver(false);
    setGameWon(false);
    generateFood();
  }, [generateFood]);

  // Handle direction change from keyboard
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      const currentDir = nextDirectionRef.current;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (currentDir !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (currentDir !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (currentDir !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (currentDir !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  // Arrow button handlers
  const handleDirectionButton = (newDir: Direction) => {
    const currentDir = nextDirectionRef.current;
    
    if (newDir === 'UP' && currentDir !== 'DOWN') setNextDirection('UP');
    if (newDir === 'DOWN' && currentDir !== 'UP') setNextDirection('DOWN');
    if (newDir === 'LEFT' && currentDir !== 'RIGHT') setNextDirection('LEFT');
    if (newDir === 'RIGHT' && currentDir !== 'LEFT') setNextDirection('RIGHT');
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      const currentSnake = [...snakeRef.current];
      const currentDirection = nextDirectionRef.current;
      const currentFood = foodRef.current;
      
      // Update actual direction
      setDirection(currentDirection);
      
      // Calculate new head position
      const head = currentSnake[0];
      let newHead: Position;

      switch (currentDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          newHead = { x: head.x + 1, y: head.y };
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= BOARD_WIDTH || newHead.y < 0 || newHead.y >= BOARD_HEIGHT) {
        endGame(false);
        return;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame(false);
        return;
      }

      // Add new head
      currentSnake.unshift(newHead);

      // Check food collision
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        const newScore = score + 10;
        const newFoodEaten = foodEaten + 1;
        
        setScore(newScore);
        setFoodEaten(newFoodEaten);
        
        // Check win condition
        if (newFoodEaten >= foodTarget) {
          endGame(true);
          return;
        }
        
        // Generate new food
        generateFood();
      } else {
        // Remove tail if no food eaten
        currentSnake.pop();
      }

      setSnake(currentSnake);
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, speed, foodTarget, score, foodEaten, generateFood]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#2d4a2b';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw subtle grass pattern
    ctx.fillStyle = '#243d23';
    for (let i = 0; i < BOARD_WIDTH; i++) {
      for (let j = 0; j < BOARD_HEIGHT; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }
    }

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a2e1a44';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw food as emoji
    ctx.font = `${GRID_SIZE - 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(
      currentFoodEmoji,
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2
    );
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      if (index === 0) {
        // Head - Draw realistic snake head
        ctx.fillStyle = '#7cb342';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#7cb342';
        
        // Main head circle
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes based on direction
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        let eye1X = x + GRID_SIZE / 2 - 4;
        let eye1Y = y + GRID_SIZE / 2 - 3;
        let eye2X = x + GRID_SIZE / 2 + 4;
        let eye2Y = y + GRID_SIZE / 2 - 3;
        
        // Adjust eye position based on direction
        if (direction === 'UP') {
          eye1Y = y + GRID_SIZE / 2 - 4;
          eye2Y = y + GRID_SIZE / 2 - 4;
        } else if (direction === 'DOWN') {
          eye1Y = y + GRID_SIZE / 2 + 2;
          eye2Y = y + GRID_SIZE / 2 + 2;
        } else if (direction === 'LEFT') {
          eye1X = x + GRID_SIZE / 2 - 6;
          eye2X = x + GRID_SIZE / 2 - 2;
          eye1Y = y + GRID_SIZE / 2 - 2;
          eye2Y = y + GRID_SIZE / 2 + 2;
        } else if (direction === 'RIGHT') {
          eye1X = x + GRID_SIZE / 2 + 2;
          eye2X = x + GRID_SIZE / 2 + 6;
          eye1Y = y + GRID_SIZE / 2 - 2;
          eye2Y = y + GRID_SIZE / 2 + 2;
        }
        
        // Draw white of eyes
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2X, eye2Y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2X, eye2Y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
      } else {
        // Body - realistic scaled segments
        const scale = 1 - (index / snake.length) * 0.3;
        const bodySize = (GRID_SIZE / 2 - 1) * scale;
        
        // Alternating darker/lighter green for scales effect
        if (index % 2 === 0) {
          ctx.fillStyle = '#689f38';
        } else {
          ctx.fillStyle = '#7cb342';
        }
        
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(124, 179, 66, 0.4)';
        
        // Draw body segment
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, bodySize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add scale pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE / 2 - 2, y + GRID_SIZE / 2 - 2, bodySize * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
    });
  }, [snake, food, currentFoodEmoji, direction]);

  const endGame = (won: boolean) => {
    setGameOver(true);
    setGameWon(won);

    const finalScore = score;
    const stars = won ? (foodEaten >= foodTarget * 1.5 ? 3 : foodEaten >= foodTarget ? 2 : 1) : 0;

    setTimeout(() => onComplete(finalScore, stars), 2000);
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-teal-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="max-w-2xl text-center">
            <h2 className="text-4xl font-game text-game-primary mb-4">🐍 Snake Master</h2>
            <p className="text-xl font-game text-game-dark mb-6">
              Classic arcade snake game with modern controls!
            </p>
            <div className="mb-6 text-left bg-game-light rounded-lg p-6">
              <p className="font-game text-lg mb-3 font-bold">📋 How to Play:</p>
              <ul className="text-base font-game space-y-2">
                <li>• <strong>Controls:</strong> Arrow keys (↑ ↓ ← →) or WASD keys</li>
                <li>• <strong>On-Screen:</strong> Use arrow buttons to change direction</li>
                <li>• Eat delicious fruits 🍎🍊🍌🍉 to grow longer and score points</li>
                <li>• Watch the snake's eyes follow the direction you move!</li>
                <li>• Don't hit the walls or yourself!</li>
                <li>• Eat {foodTarget} food items to win!</li>
                <li>• 🎯 Difficulty: {difficulty.toUpperCase()}</li>
              </ul>
            </div>
            <Button onClick={() => {
              initGame();
              setGameStarted(true);
            }} size="lg" variant="primary">
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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-game text-green-600 mb-4">Victory!</h3>
                <p className="text-xl font-game text-game-dark mb-2">
                  You completed the level!
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">🎯 Score: {score} points</p>
                  <p className="font-game text-lg">🍎 Food Eaten: {foodEaten}</p>
                  <p className="font-game text-lg">📏 Snake Length: {snake.length}</p>
                </div>
                <p className="text-sm font-game text-gray-600">
                  Returning to level select...
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💥</div>
                <h3 className="text-3xl font-game text-red-600 mb-4">Game Over!</h3>
                <p className="text-xl font-game text-game-dark mb-4">
                  The snake crashed!
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">🎯 Score: {score}</p>
                  <p className="font-game text-lg">🍎 Food Eaten: {foodEaten}/{foodTarget}</p>
                  <p className="font-game text-lg">📏 Snake Length: {snake.length}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-teal-200 p-2 sm:p-4">
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
                <h3 className="font-game text-lg sm:text-2xl text-game-primary mb-1">🐍 Snake Master</h3>
                <div className="flex gap-2 sm:gap-4 text-xs sm:text-base font-game text-gray-700">
                  <span>🎯 Score: {score}</span>
                  <span>🍎 {foodEaten}/{foodTarget}</span>
                  <span>📏 {snake.length}</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => {
                setGameStarted(false);
                initGame();
              }} 
              variant="secondary" 
              size="sm"
            >
              🔄 Restart
            </Button>
          </div>
        </Card>

        {/* Game Canvas */}
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-green-800 rounded-lg shadow-2xl max-w-full"
            style={{ 
              cursor: 'default',
              touchAction: 'none',
              backgroundColor: '#2d4a2b'
            }}
          />

          {/* Arrow Controls */}
          {(
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-2 w-64"
            >
              <div></div>
              <button
                onClick={() => handleDirectionButton('UP')}
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-3xl font-bold p-4 rounded-lg shadow-lg transition-colors"
              >
                ▲
              </button>
              <div></div>
              
              <button
                onClick={() => handleDirectionButton('LEFT')}
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-3xl font-bold p-4 rounded-lg shadow-lg transition-colors"
              >
                ◄
              </button>
              <button
                onClick={() => handleDirectionButton('DOWN')}
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-3xl font-bold p-4 rounded-lg shadow-lg transition-colors"
              >
                ▼
              </button>
              <button
                onClick={() => handleDirectionButton('RIGHT')}
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-3xl font-bold p-4 rounded-lg shadow-lg transition-colors"
              >
                ►
              </button>
            </motion.div>
          )}

          {/* Instructions */}
          <Card className="w-full">
            <div className="text-center font-game text-sm sm:text-base">
              <p className="text-teal-700 font-bold">
                ⌨️ Use Arrow Keys or WASD to control the snake • Click buttons above for on-screen controls
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Over Overlay */}
      {renderGameOverOverlay()}
    </div>
  );
};

