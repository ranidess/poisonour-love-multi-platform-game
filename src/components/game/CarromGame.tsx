/**
 * Carrom Board Game - Realistic Physics Implementation
 * A traditional Indian board game with proper rules and physics
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// Types
interface Vector2D {
  x: number;
  y: number;
}

interface Piece {
  id: string;
  type: 'black' | 'white' | 'red' | 'striker';
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  isPocketed: boolean;
  mass: number;
}

interface Pocket {
  id: string;
  position: Vector2D;
  radius: number;
}

interface CarromGameProps {
  targetScore: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  onComplete: (score: number, stars: number) => void;
  onBack?: () => void;
}

// Constants
const BOARD_SIZE = 600;
const BOARD_PADDING = 80;
const PLAYABLE_SIZE = BOARD_SIZE - BOARD_PADDING * 2;
const PIECE_RADIUS = 15;
const STRIKER_RADIUS = 18;
const POCKET_RADIUS = 25;
const FRICTION = 0.98;
const MIN_VELOCITY = 0.1;
const MAX_STRIKER_POWER = 25;
const RESTITUTION = 0.85; // Bounciness

export const CarromGame = ({ targetScore, timeLimit, difficulty, onComplete, onBack }: CarromGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [striker, setStriker] = useState<Piece | null>(null);
  const [pockets, setPockets] = useState<Pocket[]>([]);
  
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [playerScore, setPlayerScore] = useState({ white: 0, black: 0 });
  const [strikerPosition, setStrikerPosition] = useState<Vector2D>({ x: BOARD_SIZE / 2, y: BOARD_SIZE - 100 });
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [canShoot, setCanShoot] = useState(true);
  const [fouls, setFouls] = useState(0);
  const [message, setMessage] = useState('');
  const [turn, setTurn] = useState(1);
  const [lastPocket, setLastPocket] = useState<string | null>(null);
  
  const animationFrameRef = useRef<number>();
  const chargeTimerRef = useRef<number>();
  
  // Refs to hold current state for physics loop (avoids stale closure)
  const piecesRef = useRef<Piece[]>([]);
  const strikerRef = useRef<Piece | null>(null);
  const canShootRef = useRef(true);
  const aimAngleRef = useRef(0);
  const powerRef = useRef(0);
  const isChargingRef = useRef(false);
  const strikerPositionRef = useRef<Vector2D>({ x: BOARD_SIZE / 2, y: BOARD_SIZE - 100 });
  const currentPlayerRef = useRef<'white' | 'black'>('white');
  const lastPocketRef = useRef<string | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);
  
  useEffect(() => {
    strikerRef.current = striker;
  }, [striker]);
  
  useEffect(() => {
    canShootRef.current = canShoot;
  }, [canShoot]);
  
  useEffect(() => {
    aimAngleRef.current = aimAngle;
  }, [aimAngle]);
  
  useEffect(() => {
    powerRef.current = power;
  }, [power]);
  
  useEffect(() => {
    isChargingRef.current = isCharging;
  }, [isCharging]);
  
  useEffect(() => {
    strikerPositionRef.current = strikerPosition;
  }, [strikerPosition]);
  
  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);
  
  useEffect(() => {
    lastPocketRef.current = lastPocket;
  }, [lastPocket]);

  // Initialize board
  useEffect(() => {
    initializeBoard();
    setMessage('🎯 Move mouse to aim, click and hold to charge power, release to shoot!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Physics loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animate = () => {
      updatePhysics();
      drawBoard();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, gameOver]);

  const initializeBoard = () => {
    // Reset all game state
    const baselineY = BOARD_SIZE - 100;
    const centerX = BOARD_SIZE / 2;
    setCanShoot(true);
    setStriker(null);
    setStrikerPosition({ x: centerX, y: baselineY });
    setCurrentPlayer('white');
    setAimAngle(-Math.PI / 2); // Point upward by default
    setPower(0);
    setIsCharging(false);
    setTurn(1);
    setLastPocket(null);
    
    // Setup pockets at four corners
    const pocketOffset = BOARD_PADDING;
    const newPockets: Pocket[] = [
      { id: 'tl', position: { x: pocketOffset, y: pocketOffset }, radius: POCKET_RADIUS },
      { id: 'tr', position: { x: BOARD_SIZE - pocketOffset, y: pocketOffset }, radius: POCKET_RADIUS },
      { id: 'bl', position: { x: pocketOffset, y: BOARD_SIZE - pocketOffset }, radius: POCKET_RADIUS },
      { id: 'br', position: { x: BOARD_SIZE - pocketOffset, y: BOARD_SIZE - pocketOffset }, radius: POCKET_RADIUS },
    ];
    setPockets(newPockets);

    // Setup pieces in center formation - using centerX already declared above
    const centerY = BOARD_SIZE / 2;
    const radius = PIECE_RADIUS;
    const spacing = radius * 2.3;

    const newPieces: Piece[] = [
      // Red queen in center
      { id: 'red', type: 'red', position: { x: centerX, y: centerY }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      
      // Black pieces (9)
      { id: 'b1', type: 'black', position: { x: centerX - spacing, y: centerY - spacing }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b2', type: 'black', position: { x: centerX + spacing, y: centerY - spacing }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b3', type: 'black', position: { x: centerX - spacing, y: centerY + spacing }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b4', type: 'black', position: { x: centerX + spacing, y: centerY + spacing }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b5', type: 'black', position: { x: centerX, y: centerY - spacing * 1.8 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b6', type: 'black', position: { x: centerX, y: centerY + spacing * 1.8 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b7', type: 'black', position: { x: centerX - spacing * 1.8, y: centerY }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b8', type: 'black', position: { x: centerX + spacing * 1.8, y: centerY }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'b9', type: 'black', position: { x: centerX - spacing * 0.6, y: centerY }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      
      // White pieces (9)
      { id: 'w1', type: 'white', position: { x: centerX + spacing * 0.6, y: centerY }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w2', type: 'white', position: { x: centerX - spacing * 1.3, y: centerY - spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w3', type: 'white', position: { x: centerX + spacing * 1.3, y: centerY - spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w4', type: 'white', position: { x: centerX - spacing * 1.3, y: centerY + spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w5', type: 'white', position: { x: centerX + spacing * 1.3, y: centerY + spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w6', type: 'white', position: { x: centerX, y: centerY - spacing * 0.6 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w7', type: 'white', position: { x: centerX, y: centerY + spacing * 0.6 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w8', type: 'white', position: { x: centerX - spacing * 0.6, y: centerY - spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
      { id: 'w9', type: 'white', position: { x: centerX + spacing * 0.6, y: centerY + spacing * 1.3 }, velocity: { x: 0, y: 0 }, radius, isPocketed: false, mass: 1 },
    ];

    setPieces(newPieces);
    setMessage('Aim and shoot! Pot your color coins.');
  };

  const updatePhysics = () => {
    let allPieces = [...piecesRef.current];
    if (strikerRef.current) {
      allPieces.push(strikerRef.current);
    }

    let updated = allPieces.map(piece => {
      if (piece.isPocketed) return piece;

      let newPiece = { ...piece };

      // Apply friction
      newPiece.velocity.x *= FRICTION;
      newPiece.velocity.y *= FRICTION;

      // Stop if velocity is too small
      if (Math.abs(newPiece.velocity.x) < MIN_VELOCITY) newPiece.velocity.x = 0;
      if (Math.abs(newPiece.velocity.y) < MIN_VELOCITY) newPiece.velocity.y = 0;

      // Update position
      newPiece.position.x += newPiece.velocity.x;
      newPiece.position.y += newPiece.velocity.y;

      // Wall collisions
      const minX = BOARD_PADDING + newPiece.radius;
      const maxX = BOARD_SIZE - BOARD_PADDING - newPiece.radius;
      const minY = BOARD_PADDING + newPiece.radius;
      const maxY = BOARD_SIZE - BOARD_PADDING - newPiece.radius;

      if (newPiece.position.x < minX) {
        newPiece.position.x = minX;
        newPiece.velocity.x *= -RESTITUTION;
      }
      if (newPiece.position.x > maxX) {
        newPiece.position.x = maxX;
        newPiece.velocity.x *= -RESTITUTION;
      }
      if (newPiece.position.y < minY) {
        newPiece.position.y = minY;
        newPiece.velocity.y *= -RESTITUTION;
      }
      if (newPiece.position.y > maxY) {
        newPiece.position.y = maxY;
        newPiece.velocity.y *= -RESTITUTION;
      }

      return newPiece;
    });

    // Piece-to-piece collisions
    for (let i = 0; i < updated.length; i++) {
      for (let j = i + 1; j < updated.length; j++) {
        if (updated[i].isPocketed || updated[j].isPocketed) continue;
        
        const dx = updated[j].position.x - updated[i].position.x;
        const dy = updated[j].position.y - updated[i].position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = updated[i].radius + updated[j].radius;

        if (distance < minDist) {
          // Collision detected
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Rotate velocities
          const v1 = {
            x: updated[i].velocity.x * cos + updated[i].velocity.y * sin,
            y: updated[i].velocity.y * cos - updated[i].velocity.x * sin
          };
          const v2 = {
            x: updated[j].velocity.x * cos + updated[j].velocity.y * sin,
            y: updated[j].velocity.y * cos - updated[j].velocity.x * sin
          };

          // Elastic collision
          const m1 = updated[i].mass;
          const m2 = updated[j].mass;
          const newV1x = ((m1 - m2) * v1.x + 2 * m2 * v2.x) / (m1 + m2);
          const newV2x = ((m2 - m1) * v2.x + 2 * m1 * v1.x) / (m1 + m2);

          v1.x = newV1x * RESTITUTION;
          v2.x = newV2x * RESTITUTION;

          // Rotate back
          updated[i].velocity.x = v1.x * cos - v1.y * sin;
          updated[i].velocity.y = v1.y * cos + v1.x * sin;
          updated[j].velocity.x = v2.x * cos - v2.y * sin;
          updated[j].velocity.y = v2.y * cos + v2.x * sin;

          // Separate pieces
          const overlap = minDist - distance;
          const separationX = (dx / distance) * overlap / 2;
          const separationY = (dy / distance) * overlap / 2;
          updated[i].position.x -= separationX;
          updated[i].position.y -= separationY;
          updated[j].position.x += separationX;
          updated[j].position.y += separationY;
        }
      }
    }

    // Check pocket collisions
    updated = updated.map(piece => {
      if (piece.isPocketed) return piece;

      for (const pocket of pockets) {
        const dx = piece.position.x - pocket.position.x;
        const dy = piece.position.y - pocket.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pocket.radius) {
          const newPiece = { ...piece, isPocketed: true, velocity: { x: 0, y: 0 } };
          
          // Handle scoring
          const player = currentPlayerRef.current;
          if (piece.type === 'striker') {
            // Foul: striker pocketed - no extra turn
            setFouls(f => f + 1);
            setMessage('Foul! Striker pocketed. -10 points!');
            setPlayerScore(prev => ({
              ...prev,
              [player]: Math.max(0, prev[player] - 10)
            }));
            setLastPocket(null); // Foul = no extra turn
            setTimeout(() => setMessage(''), 2000);
          } else if (piece.type === 'red') {
            // Red queen pocketed - always gives extra turn
            const points = 50;
            setPlayerScore(prev => ({
              ...prev,
              [player]: prev[player] + points
            }));
            setLastPocket(player); // Grant extra turn
            setMessage(`+${points} points! Queen pocketed!`);
            setTimeout(() => setMessage(''), 2000);
          } else if ((piece.type === 'white' && player === 'white') || (piece.type === 'black' && player === 'black')) {
            // Correct color piece pocketed - extra turn
            const points = 10;
            setPlayerScore(prev => ({
              ...prev,
              [player]: prev[player] + points
            }));
            setLastPocket(player); // Grant extra turn
            setMessage(`+${points} points! Good shot!`);
            setTimeout(() => setMessage(''), 2000);
          } else {
            // Wrong piece pocketed - foul, no extra turn
            setFouls(f => f + 1);
            setMessage(`Foul! Pocketed opponent's piece. -5 points!`);
            setPlayerScore(prev => ({
              ...prev,
              [player]: Math.max(0, prev[player] - 5)
            }));
            setLastPocket(null); // Foul = no extra turn
            setTimeout(() => setMessage(''), 2000);
          }

          return newPiece;
        }
      }
      return piece;
    });

    // Separate striker from pieces
    const updatedStriker = updated.find(p => p.type === 'striker');
    const updatedPieces = updated.filter(p => p.type !== 'striker');

    // Check if all pieces stopped - use smaller threshold for better detection
    const allStopped = updated.every(p => 
      p.isPocketed || (Math.abs(p.velocity.x) < MIN_VELOCITY * 2 && Math.abs(p.velocity.y) < MIN_VELOCITY * 2)
    );

    if (allStopped && !canShootRef.current) {
      setCanShoot(true);
      
      // Remove striker - will be handled at end of function
      // setStriker(null); // Removed to avoid double-setting

      // Check win condition
      const whitePieces = updatedPieces.filter(p => p.type === 'white' && !p.isPocketed);
      const blackPieces = updatedPieces.filter(p => p.type === 'black' && !p.isPocketed);

      if (whitePieces.length === 0 || blackPieces.length === 0 || playerScore.white >= targetScore) {
        endGame(true);
      } else {
        // Determine if current player gets another turn
        // Only continue if lastPocket equals the current player (they scored their color)
        const player = currentPlayerRef.current;
        const pocket = lastPocketRef.current;
        const scoredOwnColor = pocket === player;
        
        if (scoredOwnColor) {
          // Player successfully pocketed their color - gets another turn
          if (player === 'white') {
            setLastPocket(null); // Reset for next attempt
            // Reset striker to player's baseline
            const baselineY = BOARD_SIZE - 100;
            const centerX = BOARD_SIZE / 2;
            setStrikerPosition({ x: centerX, y: baselineY });
            setAimAngle(-Math.PI / 2); // Point upward by default
            setPower(0);
            setIsCharging(false);
            setMessage('🎯 Excellent! You get another turn!');
          } else {
            setMessage('🤖 Computer scored! Taking another shot...');
            setLastPocket(null); // Reset for next attempt
            // Reset striker to computer's baseline (will be set in computerTurn)
            setTimeout(() => {
              computerTurn();
            }, 1500);
          }
        } else {
          // No valid score or foul - switch turns
          const nextPlayer = player === 'white' ? 'black' : 'white';
          setLastPocket(null); // Reset for next player
          
          if (nextPlayer === 'black') {
            setMessage('🤖 Computer\'s turn now...');
            setCurrentPlayer(nextPlayer);
            const nextTurn = turn + 1;
            setTurn(nextTurn);
            // Computer's turn - will set position in computerTurn
            setTimeout(() => {
              computerTurn();
            }, 1500);
          } else {
            // Player's turn - reset everything FIRST
            const baselineY = BOARD_SIZE - 100;
            const centerX = BOARD_SIZE / 2;
            setStrikerPosition({ x: centerX, y: baselineY });
            setAimAngle(-Math.PI / 2); // Point upward by default
            setPower(0);
            setIsCharging(false);
            setCurrentPlayer(nextPlayer);
            const nextTurn = turn + 1;
            setTurn(nextTurn);
            setMessage('🎯 Your turn! Aim and shoot!');
          }
        }
      }
    }

    setPieces(updatedPieces);
    
    // Striker update logic:
    // - If pieces are moving and striker exists and not pocketed: update position
    // - If pieces have stopped: clear striker for next turn
    if (!allStopped && updatedStriker && !updatedStriker.isPocketed) {
      // Striker is actively moving
      setStriker(updatedStriker);
    } else if (allStopped) {
      // All pieces stopped - clear striker for next turn
      setStriker(null);
    }
  };

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Draw board background
    ctx.fillStyle = '#f4e4c1';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Draw border
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = BOARD_PADDING;
    ctx.strokeRect(BOARD_PADDING / 2, BOARD_PADDING / 2, BOARD_SIZE - BOARD_PADDING, BOARD_SIZE - BOARD_PADDING);

    // Draw playable area
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_PADDING, BOARD_PADDING, PLAYABLE_SIZE, PLAYABLE_SIZE);

    // Draw center circle
    ctx.beginPath();
    ctx.arc(BOARD_SIZE / 2, BOARD_SIZE / 2, 60, 0, Math.PI * 2);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pockets
    pockets.forEach(pocket => {
      ctx.beginPath();
      ctx.arc(pocket.position.x, pocket.position.y, pocket.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#2c1810';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw pieces
    piecesRef.current.forEach(piece => {
      if (piece.isPocketed) return;

      ctx.beginPath();
      ctx.arc(piece.position.x, piece.position.y, piece.radius, 0, Math.PI * 2);
      
      if (piece.type === 'red') {
        ctx.fillStyle = '#dc2626';
      } else if (piece.type === 'black') {
        ctx.fillStyle = '#1f2937';
      } else {
        ctx.fillStyle = '#f9fafb';
      }
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add shine effect
      const gradient = ctx.createRadialGradient(
        piece.position.x - piece.radius / 3,
        piece.position.y - piece.radius / 3,
        0,
        piece.position.x,
        piece.position.y,
        piece.radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    // Draw striker (either moving or in ready position)
    if (strikerRef.current && !strikerRef.current.isPocketed) {
      // Draw moving striker
      ctx.beginPath();
      ctx.arc(strikerRef.current.position.x, strikerRef.current.position.y, strikerRef.current.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add shine effect
      const gradient = ctx.createRadialGradient(
        strikerRef.current.position.x - strikerRef.current.radius / 3,
        strikerRef.current.position.y - strikerRef.current.radius / 3,
        0,
        strikerRef.current.position.x,
        strikerRef.current.position.y,
        strikerRef.current.radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    } else if (canShootRef.current && currentPlayerRef.current === 'white' && !strikerRef.current) {
      // Draw striker in ready position - only for player's turn when no active striker
      const strikerPos = strikerPositionRef.current;
      ctx.beginPath();
      ctx.arc(strikerPos.x, strikerPos.y, STRIKER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add shine effect
      const gradient = ctx.createRadialGradient(
        strikerPos.x - STRIKER_RADIUS / 3,
        strikerPos.y - STRIKER_RADIUS / 3,
        0,
        strikerPos.x,
        strikerPos.y,
        STRIKER_RADIUS
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw pulsing ring to indicate it's ready
      if (!isChargingRef.current) {
        ctx.beginPath();
        ctx.arc(strikerPos.x, strikerPos.y, STRIKER_RADIUS + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    // Draw aiming line when ready to shoot - only for player's turn
    if (canShootRef.current && currentPlayerRef.current === 'white' && !strikerRef.current) {
      const strikerPos = strikerPositionRef.current;
      const angle = aimAngleRef.current;
      const pow = powerRef.current;
      const charging = isChargingRef.current;
      
      ctx.beginPath();
      ctx.moveTo(strikerPos.x, strikerPos.y);
      const lineLength = charging ? (100 + pow * 2) : 80;
      const endX = strikerPos.x + Math.cos(angle) * lineLength;
      const endY = strikerPos.y + Math.sin(angle) * lineLength;
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = charging 
        ? `rgba(239, 68, 68, ${0.5 + pow / 100 * 0.5})`
        : 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Draw arrow head
      const arrowLength = 15;
      const arrowAngle = Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.strokeStyle = charging 
        ? `rgba(239, 68, 68, ${0.5 + pow / 100 * 0.5})`
        : 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw power indicator when charging
      if (charging) {
        ctx.beginPath();
        ctx.arc(strikerPos.x, strikerPos.y, STRIKER_RADIUS + 10 + pow / 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pow / 100 * 0.6})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  };

  const handleMouseDown = () => {
    if (!canShoot || striker || !gameStarted || currentPlayer !== 'white') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Start charging power when clicking anywhere on the board
    setIsCharging(true);
    setPower(0);

    // Auto-charge power
    chargeTimerRef.current = window.setInterval(() => {
      setPower(p => Math.min(p + 2, 100));
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canShoot || striker || currentPlayer !== 'white') return; // Only player controls white

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Allow moving striker horizontally along baseline when not charging
    let currentStrikerPos = strikerPosition;
    if (!isCharging) {
      const baselineY = BOARD_SIZE - 100;
      const minX = BOARD_PADDING + STRIKER_RADIUS + 20;
      const maxX = BOARD_SIZE - BOARD_PADDING - STRIKER_RADIUS - 20;
      const newX = Math.max(minX, Math.min(maxX, x));
      currentStrikerPos = { x: newX, y: baselineY };
      setStrikerPosition(currentStrikerPos);
    }

    // Update aim angle based on current striker position
    const angle = Math.atan2(y - currentStrikerPos.y, x - currentStrikerPos.x);
    setAimAngle(angle);
  };

  const handleMouseUp = () => {
    if (!isCharging || !canShoot || currentPlayer !== 'white') return;

    if (chargeTimerRef.current) {
      clearInterval(chargeTimerRef.current);
    }

    setIsCharging(false);

    // Only shoot if power is above minimum threshold
    if (power < 10) {
      setPower(0);
      return;
    }

    // Shoot striker
    shootStriker(strikerPosition, aimAngle, power);
  };

  const shootStriker = (position: Vector2D, angle: number, powerPercent: number) => {
    const speed = (powerPercent / 100) * MAX_STRIKER_POWER;
    const newStriker: Piece = {
      id: 'striker',
      type: 'striker',
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      radius: STRIKER_RADIUS,
      isPocketed: false,
      mass: 1.5
    };

    setStriker(newStriker);
    setCanShoot(false);
    setPower(0);
    setMessage('⚡ Shot fired!');
  };

  // Computer AI turn
  const computerTurn = () => {
    setMessage('🤖 Computer is thinking...');
    
    setTimeout(() => {
      // Find black pieces (computer's color)
      const blackPieces = piecesRef.current.filter(p => p.type === 'black' && !p.isPocketed);
      const centerX = BOARD_SIZE / 2;
      
      if (blackPieces.length === 0) {
        endGame(true);
        return;
      }

      // Pick a random black piece to target
      const targetPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      
      // Computer striker position (from top)
      const compStrikerPos = { x: centerX + (Math.random() - 0.5) * 100, y: BOARD_PADDING + 50 };
      
      // Aim at the target piece with some randomness
      const dx = targetPiece.position.x - compStrikerPos.x + (Math.random() - 0.5) * 40;
      const dy = targetPiece.position.y - compStrikerPos.y + (Math.random() - 0.5) * 40;
      const compAngle = Math.atan2(dy, dx);
      
      // Random power between 50-90%
      const compPower = 50 + Math.random() * 40;
      
      setMessage('🤖 Computer shooting!');
      setTimeout(() => {
        shootStriker(compStrikerPos, compAngle, compPower);
      }, 500);
    }, 1500);
  };

  const endGame = (won: boolean) => {
    setGameOver(true);
    setGameWon(won);

    const score = playerScore.white;
    const stars = score >= targetScore * 1.5 ? 3 : score >= targetScore ? 2 : score >= targetScore * 0.5 ? 1 : 0;

    setTimeout(() => onComplete(score, stars), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="max-w-2xl text-center">
            <h2 className="text-4xl font-game text-game-primary mb-4">🎯 Carrom Board</h2>
            <p className="text-xl font-game text-game-dark mb-6">
              The classic Indian board game with realistic physics!
            </p>
            <div className="mb-6 text-left bg-game-light rounded-lg p-6">
              <p className="font-game text-lg mb-3 font-bold">📋 Rules:</p>
              <ul className="text-base font-game space-y-2">
                <li>• Click and hold near the striker to charge power</li>
                <li>• Move mouse to aim, release to shoot</li>
                <li>• Pot your color coins (White pieces) to score</li>
                <li>• Red Queen = 50 points, Color coins = 10 points each</li>
                <li>• Don't pocket the striker or opponent's pieces (Foul!)</li>
                <li>• Reach {targetScore} points to win!</li>
                <li>• ⏱️ Time Limit: {formatTime(timeLimit)}</li>
                <li>• 🎯 Difficulty: {difficulty.toUpperCase()}</li>
              </ul>
            </div>
            <Button onClick={() => {
              initializeBoard();
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
                  You won the carrom match!
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">⏱️ Time: {formatTime(timeRemaining)} left</p>
                  <p className="font-game text-lg">🎯 Score: {playerScore.white} points</p>
                  <p className="font-game text-lg">🎲 Turns: {turn}</p>
                  <p className="font-game text-lg">⚠️ Fouls: {fouls}</p>
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
                  You didn't reach the target score in time.
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <p className="font-game text-lg">🎯 Score: {playerScore.white}/{targetScore}</p>
                  <p className="font-game text-lg">🎲 Turns: {turn}</p>
                  <p className="font-game text-lg">⚠️ Fouls: {fouls}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
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
                <h3 className="font-game text-2xl text-game-primary mb-1">🎯 Carrom Board</h3>
                <div className="flex gap-4 text-base font-game text-gray-700">
                  <span className={currentPlayer === 'white' ? 'font-bold text-green-600' : ''}>
                    ⚪ You: {playerScore.white}
                  </span>
                  <span className={currentPlayer === 'black' ? 'font-bold text-blue-600' : ''}>
                    🤖 Computer: {playerScore.black}
                  </span>
                  <span>🎯 Target: {targetScore}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Reset Button */}
              <Button 
                onClick={() => {
                  const baselineY = BOARD_SIZE - 100;
                  const centerX = BOARD_SIZE / 2;
                  setGameOver(false);
                  setGameWon(false);
                  setGameStarted(false);
                  setPieces([]);
                  setStriker(null);
                  setPlayerScore({ white: 0, black: 0 });
                  setTimeRemaining(timeLimit);
                  setTurn(1);
                  setCurrentPlayer('white');
                  setFouls(0);
                  setStrikerPosition({ x: centerX, y: baselineY });
                  setAimAngle(-Math.PI / 2);
                  setPower(0);
                  setIsCharging(false);
                  setCanShoot(true);
                  initializeBoard();
                }} 
                variant="secondary" 
                size="sm"
              >
                🔄 Restart
              </Button>
              {/* Current Player Indicator */}
              <div className={`
                font-game text-base font-bold px-4 py-2 rounded-lg
                ${currentPlayer === 'white' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
              `}>
                {currentPlayer === 'white' ? '👤 Your Turn' : '🤖 Computer'}
              </div>
              {/* Timer Display */}
              <div className={`
                font-game text-2xl font-bold px-6 py-3 rounded-lg
                ${timeRemaining <= 30 ? 'bg-red-100 text-red-600 animate-pulse' : 
                  timeRemaining <= 60 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-blue-100 text-blue-600'}
              `}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center font-game text-lg text-purple-600 font-bold"
            >
              {message}
            </motion.div>
          )}
        </Card>

        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={BOARD_SIZE}
            height={BOARD_SIZE}
            className="border-4 border-amber-800 rounded-lg shadow-2xl bg-white cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Power meter */}
        {isCharging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Card>
              <div className="text-center">
                <p className="font-game text-lg mb-2">Power: {power}%</p>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-red-500 h-6 rounded-full"
                    style={{ width: `${power}%` }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Instructions */}
        <Card className="mt-4">
          <div className="text-center font-game">
            {currentPlayer === 'black' ? (
              <p className="text-base text-blue-600 font-bold">🤖 Computer is playing... Watch the AI in action!</p>
            ) : canShoot ? (
              <div className="space-y-2">
                <p className="text-lg font-bold text-green-600">👤 Your Turn! Get Ready!</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>1️⃣ <strong>Move mouse left/right</strong> to position striker</p>
                  <p>2️⃣ <strong>Move mouse</strong> to aim at white coins ⚪</p>
                  <p>3️⃣ <strong>Click and hold</strong> to charge power</p>
                  <p>4️⃣ <strong>Release</strong> to shoot!</p>
                </div>
              </div>
            ) : (
              <p className="text-base text-orange-600 font-bold">⏳ Wait for pieces to stop moving...</p>
            )}
          </div>
        </Card>
      </div>

      {/* Game Over Overlay */}
      {renderGameOverOverlay()}
    </div>
  );
};

