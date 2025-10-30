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
  return [];
};

export const getAllGames = (): GameInfo[] => {
  return GAMES;
};

