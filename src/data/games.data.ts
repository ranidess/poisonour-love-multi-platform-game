/**
 * Games Library Data
 * All available games in the platform
 */

import { GameInfo, StoryChapter, MiniGameLevel } from '../types/platform.types';

// ============================================
// GAME LIBRARY
// ============================================

export const GAMES: GameInfo[] = [
  {
    id: 'memory_master',
    title: '🧠 Memory Master',
    subtitle: 'Card Match Challenge',
    description: 'Test your memory! Match pairs of cards as quickly as possible. Multiple difficulty levels await.',
    gameType: 'memory',
    category: 'minigame',
    coverImage: '🎴',
    icon: '🧠',
    unlockRequirement: 0,
    isLocked: false,
    hasChapters: false,
    hasLevels: true,
    estimatedTime: '5-10 min',
  },
  {
    id: 'carrom_master',
    title: '🎯 Carrom Master',
    subtitle: 'Classic Board Game',
    description: 'Master the traditional Indian board game! 100 challenging levels with realistic physics and strategic shots.',
    gameType: 'casual',
    category: 'minigame',
    coverImage: '🎯',
    icon: '🎯',
    unlockRequirement: 0,
    isLocked: false,
    hasChapters: false,
    hasLevels: true,
    estimatedTime: '10-15 min',
  },
  {
    id: 'snake_master',
    title: '🐍 Snake Master',
    subtitle: 'Classic Arcade Game',
    description: 'Guide the snake to eat food and grow longer! 100 levels from beginner to insanely fast expert challenges!',
    gameType: 'arcade',
    category: 'minigame',
    coverImage: '🐍',
    icon: '🐍',
    unlockRequirement: 0,
    isLocked: false,
    hasChapters: false,
    hasLevels: true,
    estimatedTime: '5-10 min',
  },
  {
    id: 'ant_smasher',
    title: '🐜 Ant Smasher',
    subtitle: 'Fast Reaction Game',
    description: 'Smash the invading ants! 100 levels with increasing speed. Avoid bombs and build combos for high scores!',
    gameType: 'arcade',
    category: 'minigame',
    coverImage: '🐜',
    icon: '🐜',
    unlockRequirement: 0,
    isLocked: false,
    hasChapters: false,
    hasLevels: true,
    estimatedTime: '3-5 min',
  },
  {
    id: 'heart_puzzle',
    title: '💖 Heart Puzzle',
    subtitle: 'Romantic Sliding Puzzle',
    description: 'Solve romantic-themed sliding puzzles. Complete beautiful pixel art images piece by piece.',
    gameType: 'puzzle',
    category: 'minigame',
    coverImage: '🧩',
    icon: '💖',
    unlockRequirement: 50,
    isLocked: true,
    hasChapters: false,
    hasLevels: true,
    estimatedTime: '10-15 min',
  },
];

// ============================================
// MINI GAME: MEMORY MASTER
// ============================================

// All available emoji pairs for memory game (50 total)
const ALL_EMOJI_PAIRS = [
  { id: 'tomato', emoji: '🍅', name: 'Tomato' },
  { id: 'egg', emoji: '🥚', name: 'Egg' },
  { id: 'fish', emoji: '🐟', name: 'Fish' },
  { id: 'rice', emoji: '🍚', name: 'Rice' },
  { id: 'cheese', emoji: '🧀', name: 'Cheese' },
  { id: 'bread', emoji: '🍞', name: 'Bread' },
  { id: 'apple', emoji: '🍎', name: 'Apple' },
  { id: 'milk', emoji: '🥛', name: 'Milk' },
  { id: 'carrot', emoji: '🥕', name: 'Carrot' },
  { id: 'grape', emoji: '🍇', name: 'Grape' },
  { id: 'banana', emoji: '🍌', name: 'Banana' },
  { id: 'coffee', emoji: '☕', name: 'Coffee' },
  { id: 'pizza', emoji: '🍕', name: 'Pizza' },
  { id: 'burger', emoji: '🍔', name: 'Burger' },
  { id: 'cake', emoji: '🍰', name: 'Cake' },
  { id: 'cookie', emoji: '🍪', name: 'Cookie' },
  { id: 'icecream', emoji: '🍦', name: 'Ice Cream' },
  { id: 'donut', emoji: '🍩', name: 'Donut' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon' },
  { id: 'orange', emoji: '🍊', name: 'Orange' },
  { id: 'lemon', emoji: '🍋', name: 'Lemon' },
  { id: 'peach', emoji: '🍑', name: 'Peach' },
  { id: 'pear', emoji: '🍐', name: 'Pear' },
  { id: 'cherry', emoji: '🍒', name: 'Cherry' },
  { id: 'avocado', emoji: '🥑', name: 'Avocado' },
  { id: 'broccoli', emoji: '🥦', name: 'Broccoli' },
  { id: 'mushroom', emoji: '🍄', name: 'Mushroom' },
  { id: 'corn', emoji: '🌽', name: 'Corn' },
  { id: 'potato', emoji: '🥔', name: 'Potato' },
  { id: 'croissant', emoji: '🥐', name: 'Croissant' },
  { id: 'bagel', emoji: '🥯', name: 'Bagel' },
  { id: 'pretzel', emoji: '🥨', name: 'Pretzel' },
  { id: 'pancake', emoji: '🥞', name: 'Pancake' },
  { id: 'waffle', emoji: '🧇', name: 'Waffle' },
  { id: 'bacon', emoji: '🥓', name: 'Bacon' },
  { id: 'steak', emoji: '🥩', name: 'Steak' },
  { id: 'chicken', emoji: '🍗', name: 'Chicken' },
  { id: 'sushi', emoji: '🍣', name: 'Sushi' },
  { id: 'ramen', emoji: '🍜', name: 'Ramen' },
  { id: 'taco', emoji: '🌮', name: 'Taco' },
  { id: 'burrito', emoji: '🌯', name: 'Burrito' },
  { id: 'salad', emoji: '🥗', name: 'Salad' },
  { id: 'popcorn', emoji: '🍿', name: 'Popcorn' },
  { id: 'hotdog', emoji: '🌭', name: 'Hot Dog' },
  { id: 'sandwich', emoji: '🥪', name: 'Sandwich' },
  { id: 'fries', emoji: '🍟', name: 'Fries' },
  { id: 'noodles', emoji: '🍝', name: 'Noodles' },
  { id: 'soup', emoji: '🍲', name: 'Soup' },
  { id: 'bento', emoji: '🍱', name: 'Bento' },
];

// Generate 100 levels with increasing difficulty
function generateMemoryLevels(): MiniGameLevel[] {
  const levels: MiniGameLevel[] = [];
  
  for (let i = 1; i <= 100; i++) {
    // Determine difficulty based on level
    let pairCount: number;
    let timeLimit: number;
    let difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    let title: string;
    
    if (i <= 10) {
      // Levels 1-10: Easy (6-8 pairs)
      pairCount = 6 + Math.floor((i - 1) / 5);
      timeLimit = 60 + (i - 1) * 5;
      difficulty = 'easy';
      title = `Beginner ${i}`;
    } else if (i <= 30) {
      // Levels 11-30: Medium (8-12 pairs)
      pairCount = 8 + Math.floor((i - 11) / 5);
      timeLimit = 90 + (i - 11) * 3;
      difficulty = 'medium';
      title = `Intermediate ${i}`;
    } else if (i <= 60) {
      // Levels 31-60: Hard (12-18 pairs)
      pairCount = 12 + Math.floor((i - 31) / 5);
      timeLimit = 120 + (i - 31) * 2;
      difficulty = 'hard';
      title = `Advanced ${i}`;
    } else {
      // Levels 61-100: Expert (18-25 pairs)
      pairCount = 18 + Math.floor((i - 61) / 6);
      timeLimit = 180 + (i - 61) * 2;
      difficulty = 'expert';
      title = `Master ${i}`;
    }
    
    // Cap at 25 pairs max (we have 50 emojis, so 25 pairs)
    pairCount = Math.min(pairCount, 25);
    
    // Select pairs for this level (deterministic based on level number for consistency)
    const selectedPairs = [...ALL_EMOJI_PAIRS]
      .sort((a, b) => {
        // Pseudo-random but consistent for same level
        const hashA = (a.id.charCodeAt(0) * i * 37) % 1000;
        const hashB = (b.id.charCodeAt(0) * i * 37) % 1000;
        return hashA - hashB;
      })
      .slice(0, pairCount);
    
    levels.push({
      id: `memory_level_${i}`,
      gameId: 'memory_master',
      levelNumber: i,
      title: title,
      difficulty,
      description: `Match ${pairCount} pairs in ${Math.floor(timeLimit / 60)}:${String(timeLimit % 60).padStart(2, '0')} - ${difficulty.toUpperCase()}`,
      unlocked: i === 1,
      completed: false,
      bestScore: 0,
      stars: 0,
      timeLimit,
      gameData: {
        pairs: selectedPairs,
      },
    });
  }
  
  return levels;
}

export const MEMORY_LEVELS: MiniGameLevel[] = generateMemoryLevels();


// ============================================
// MINI GAME: CARROM MASTER
// ============================================

function generateCarromLevels(): MiniGameLevel[] {
  const levels: MiniGameLevel[] = [];
  
  for (let i = 1; i <= 100; i++) {
    let targetScore: number;
    let timeLimit: number;
    let difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    let title: string;
    
    if (i <= 15) {
      // Levels 1-15: Easy (low score targets)
      targetScore = 30 + (i - 1) * 5;
      timeLimit = 300;
      difficulty = 'easy';
      title = `Beginner ${i}`;
    } else if (i <= 40) {
      // Levels 16-40: Medium (medium score targets)
      targetScore = 105 + (i - 16) * 8;
      timeLimit = 360;
      difficulty = 'medium';
      title = `Intermediate ${i}`;
    } else if (i <= 70) {
      // Levels 41-70: Hard (high score targets)
      targetScore = 305 + (i - 41) * 12;
      timeLimit = 420;
      difficulty = 'hard';
      title = `Advanced ${i}`;
    } else {
      // Levels 71-100: Expert (very high score targets)
      targetScore = 665 + (i - 71) * 15;
      timeLimit = 480;
      difficulty = 'expert';
      title = `Master ${i}`;
    }
    
    levels.push({
      id: `carrom_level_${i}`,
      gameId: 'carrom_master',
      levelNumber: i,
      title: title,
      difficulty,
      description: `Score ${targetScore} points - ${difficulty.toUpperCase()}`,
      unlocked: i === 1,
      completed: false,
      bestScore: 0,
      stars: 0,
      timeLimit,
      gameData: {
        targetScore,
      },
    });
  }
  
  return levels;
}

export const CARROM_LEVELS: MiniGameLevel[] = generateCarromLevels();


// ============================================
// MINI GAME: SNAKE MASTER
// ============================================

function generateSnakeLevels(): MiniGameLevel[] {
  const levels: MiniGameLevel[] = [];
  
  for (let i = 1; i <= 100; i++) {
    let foodTarget: number;
    let speed: number;
    let difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    let title: string;
    
    if (i <= 15) {
      // Levels 1-15: Easy (low food targets, slower speed)
      foodTarget = 5 + i;
      speed = 150 - (i - 1) * 3; // 150ms to 108ms
      difficulty = 'easy';
      title = `Beginner ${i}`;
    } else if (i <= 40) {
      // Levels 16-40: Medium (medium food targets, moderate speed)
      foodTarget = 20 + (i - 15);
      speed = 105 - Math.floor((i - 16) * 1.2); // 105ms to 75ms
      difficulty = 'medium';
      title = `Intermediate ${i}`;
    } else if (i <= 70) {
      // Levels 41-70: Hard (high food targets, faster speed)
      foodTarget = 45 + (i - 40);
      speed = 75 - Math.floor((i - 41) * 0.8); // 75ms to 51ms
      difficulty = 'hard';
      title = `Advanced ${i}`;
    } else {
      // Levels 71-100: Expert (very high food targets, very fast)
      foodTarget = 75 + (i - 70) * 2;
      speed = Math.max(30, 50 - (i - 71)); // 50ms to 30ms (minimum 30ms)
      difficulty = 'expert';
      title = `Master ${i}`;
    }
    
    levels.push({
      id: `snake_level_${i}`,
      gameId: 'snake_master',
      levelNumber: i,
      title: title,
      difficulty,
      description: `Eat ${foodTarget} food items - ${difficulty.toUpperCase()}`,
      unlocked: i === 1,
      completed: false,
      bestScore: 0,
      stars: 0,
      timeLimit: 0, // No time limit for snake
      gameData: {
        foodTarget,
        speed,
      },
    });
  }
  
  return levels;
}

export const SNAKE_LEVELS: MiniGameLevel[] = generateSnakeLevels();


// ============================================
// MINI GAME: ANT SMASHER
// ============================================

function generateAntSmasherLevels(): MiniGameLevel[] {
  const levels: MiniGameLevel[] = [];
  
  for (let i = 1; i <= 100; i++) {
    let antsToSmash: number;
    let timeLimit: number;
    let antSpeed: number;
    let spawnRate: number;
    let difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    let title: string;
    
    if (i <= 15) {
      // Levels 1-15: Easy (few ants, slow speed, more time)
      antsToSmash = 10 + (i - 1) * 2;
      timeLimit = 60;
      antSpeed = 1.0 + (i - 1) * 0.08;
      spawnRate = 2000 - (i - 1) * 80; // 2000ms to 880ms
      difficulty = 'easy';
      title = `Beginner ${i}`;
    } else if (i <= 40) {
      // Levels 16-40: Medium (more ants, faster, less time)
      antsToSmash = 38 + (i - 16) * 2;
      timeLimit = 55 - Math.floor((i - 16) / 5); // 55s to 50s
      antSpeed = 1.8 + (i - 16) * 0.06;
      spawnRate = 850 - (i - 16) * 15; // 850ms to 475ms
      difficulty = 'medium';
      title = `Intermediate ${i}`;
    } else if (i <= 70) {
      // Levels 41-70: Hard (many ants, very fast)
      antsToSmash = 88 + (i - 41) * 2;
      timeLimit = 50 - Math.floor((i - 41) / 6); // 50s to 45s
      antSpeed = 3.3 + (i - 41) * 0.05;
      spawnRate = 450 - (i - 41) * 8; // 450ms to 210ms
      difficulty = 'hard';
      title = `Advanced ${i}`;
    } else {
      // Levels 71-100: Expert (insane ants, extreme speed)
      antsToSmash = 148 + (i - 71) * 3;
      timeLimit = 45 - Math.floor((i - 71) / 10); // 45s to 42s
      antSpeed = 4.8 + (i - 71) * 0.07;
      spawnRate = Math.max(100, 200 - (i - 71) * 3); // 200ms to 100ms (minimum 100ms)
      difficulty = 'expert';
      title = `Master ${i}`;
    }
    
    levels.push({
      id: `ant_level_${i}`,
      gameId: 'ant_smasher',
      levelNumber: i,
      title: title,
      difficulty,
      description: `Smash ${antsToSmash} ants in ${timeLimit}s - ${difficulty.toUpperCase()}`,
      unlocked: i === 1,
      completed: false,
      bestScore: 0,
      stars: 0,
      timeLimit,
      gameData: {
        antsToSmash,
        antSpeed,
        spawnRate,
      },
    });
  }
  
  return levels;
}

export const ANT_SMASHER_LEVELS: MiniGameLevel[] = generateAntSmasherLevels();


// ============================================
// HELPER FUNCTIONS
// ============================================

export const getGameById = (gameId: string): GameInfo | undefined => {
  return GAMES.find((game) => game.id === gameId);
};

export const getGamesByCategory = (category: string): GameInfo[] => {
  return GAMES.filter((game) => game.category === category);
};

export const getStoryChapters = (): StoryChapter[] => {
  return [];
};

export const getMiniGameLevels = (gameId: string): MiniGameLevel[] => {
  if (gameId === 'memory_master') return MEMORY_LEVELS;
  if (gameId === 'carrom_master') return CARROM_LEVELS;
  if (gameId === 'snake_master') return SNAKE_LEVELS;
  if (gameId === 'ant_smasher') return ANT_SMASHER_LEVELS;
  return [];
};

export const getAllGames = (): GameInfo[] => {
  return GAMES;
};

