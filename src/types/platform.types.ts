/**
 * Game Platform Types
 * Defines structure for multi-game platform
 */

export type GameType = 'story' | 'puzzle' | 'memory' | 'sequence' | 'casual' | 'arcade';

export type GameCategory = 'featured' | 'story' | 'minigame' | 'arcade';

export interface GameInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gameType: GameType;
  category: GameCategory;
  coverImage: string;
  icon: string;
  unlockRequirement: number; // affection or score needed
  isLocked: boolean;
  hasChapters: boolean;
  hasLevels: boolean;
  estimatedTime: string; // e.g., "30 min", "5 min"
}

export interface StoryChapter {
  id: string;
  gameId: string;
  chapterNumber: number;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  startDialogueId: string;
  estimatedTime: string;
}

export interface MiniGameLevel {
  id: string;
  gameId: string;
  levelNumber: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  stars: number;
  timeLimit: number;
  gameData?: any; // Game-specific data (e.g., pairs for memory game)
}

export interface LevelData {
  levelId: string;
  bestScore: number;
  stars: number;
  timesPlayed: number;
}

export interface GameProgress {
  gameId: string;
  currentChapter?: number;
  currentLevel?: number;
  completedChapters: string[];
  completedLevels: string[];
  totalScore: number;
  totalStars: number;
  playTime: number;
  lastPlayed: number;
  levelData?: LevelData[];
}

export interface PlatformProgress {
  games: Record<string, GameProgress>;
  totalPlayTime: number;
  achievements: string[];
  unlockedGames: string[];
}

