/**
 * Game Types and Interfaces
 * Defines all core data structures for the game
 */

export type GameScene = 
  | 'mainMenu' 
  | 'intro'
  | 'chapterSelect'
  | 'levelSelect'
  | 'cooking' 
  | 'dialogue' 
  | 'minigame'
  | 'ending' 
  | 'settings'
  | 'credits';

export type StoryPath = 'friendly' | 'secret' | 'betrayal' | 'neutral';

export type DialogueOption = {
  id: string;
  text: string;
  affectionChange: number;
  nextDialogueId?: string;
  pathInfluence?: StoryPath;
};

export type DialogueData = {
  id: string;
  sceneNumber: number;
  characterName: string;
  characterSprite?: string;
  text: string;
  options?: DialogueOption[];
  nextDialogueId?: string;
  backgroundMusic?: string;
};

export type Recipe = {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // seconds
  ingredients: Ingredient[];
  tools: CookingTool[];
  steps: CookingStep[];
  perfectScore: number;
};

export type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  required: boolean;
};

export type CookingTool = {
  id: string;
  name: string;
  emoji: string;
  required: boolean;
};

export type CookingStep = {
  id: string;
  description: string;
  correctIngredient?: string;
  correctTool?: string;
  timeAllowed: number;
};

export type CookingResult = {
  score: number;
  stars: number;
  accuracy: number;
  timeBonus: number;
  passed: boolean;
};

export type AchievementType = 
  | 'perfect_cook' 
  | 'romantic_ending' 
  | 'speed_demon' 
  | 'collector'
  | 'heartbreaker';

export type Achievement = {
  id: AchievementType;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
};

export type GameProgress = {
  currentScene: GameScene;
  currentDialogueId: string;
  currentChapterId: string;
  currentLevelId: string;
  currentRecipeIndex: number;
  affectionLevel: number;
  storyPath: StoryPath;
  completedRecipes: string[];
  unlockedRecipes: string[];
  completedLevels: string[];
  achievements: Achievement[];
  totalScore: number;
  totalStars: number;
  playTime: number; // in seconds
};

export type GameSettings = {
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  animationsEnabled: boolean;
};

export type GameState = {
  progress: GameProgress;
  settings: GameSettings;
  isGameStarted: boolean;
  isPaused: boolean;
  lastSaved: string;
};

export type EndingType = 
  | 'true_love' 
  | 'friendship' 
  | 'bittersweet' 
  | 'betrayal' 
  | 'neutral';

export type Ending = {
  id: EndingType;
  title: string;
  description: string;
  requiredAffection: number;
  requiredPath: StoryPath;
  unlockAchievement?: AchievementType;
};

export type Character = {
  id: string;
  name: string;
  role: 'player' | 'rival' | 'supporting';
  description: string;
  defaultSprite: string;
  emotions: {
    [key: string]: string; // emotion name to sprite URL
  };
};

