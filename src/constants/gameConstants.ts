/**
 * Game Constants
 * Central configuration and magic numbers
 */

export const GAME_CONFIG = {
  // Affection system
  MAX_AFFECTION: 100,
  MIN_AFFECTION: 0,
  AFFECTION_THRESHOLDS: {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    MAX: 90,
  },

  // Scoring
  PERFECT_SCORE: 1000,
  STAR_THRESHOLDS: {
    ONE_STAR: 300,
    TWO_STAR: 600,
    THREE_STAR: 850,
  },

  // Timing
  BASE_TIME_LIMIT: 60, // seconds
  TIME_BONUS_MULTIPLIER: 2,
  COMBO_TIME_WINDOW: 3, // seconds

  // Gameplay
  MAX_MISTAKES: 3,
  COMBO_THRESHOLD: 3,
  UNLOCK_THRESHOLD: 500,
} as const;

export const STORAGE_KEYS = {
  GAME_STATE: 'pixelChef_gameState',
  SETTINGS: 'pixelChef_settings',
  PROGRESS: 'pixelChef_progress',
  ACHIEVEMENTS: 'pixelChef_achievements',
} as const;

export const ANIMATION_DURATIONS = {
  FADE: 0.3,
  SLIDE: 0.5,
  DIALOGUE: 0.4,
  BUTTON_HOVER: 0.2,
  HEART_BEAT: 1,
} as const;

export const SOUND_EFFECTS = {
  CLICK: 'click',
  SUCCESS: 'success',
  ERROR: 'error',
  COOKING: 'cooking',
  CHOP: 'chop',
  POUR: 'pour',
  SIZZLE: 'sizzle',
  AFFECTION_UP: 'affection_up',
  STAR: 'star',
  DIALOGUE_NEXT: 'dialogue_next',
} as const;

export const MUSIC_TRACKS = {
  MAIN_MENU: 'menu_theme',
  CAFE_DAY: 'cafe_day',
  CAFE_EVENING: 'cafe_evening',
  COOKING: 'cooking_theme',
  ROMANTIC: 'romantic_theme',
  DRAMATIC: 'dramatic_theme',
  ENDING_HAPPY: 'ending_happy',
  ENDING_SAD: 'ending_sad',
} as const;

export const CHARACTER_NAMES = {
  PLAYER: 'Yuki',
  RIVAL: 'Akari',
} as const;

export const DIALOGUE_SCENES = {
  INTRO: 'intro_001',
  FIRST_MEETING: 'meet_001',
  AFTER_ROUND_1: 'round1_end',
  AFTER_ROUND_2: 'round2_end',
  ROMANTIC_MOMENT: 'romantic_001',
  CONFLICT: 'conflict_001',
  RESOLUTION: 'resolution_001',
  ENDING_TRUE_LOVE: 'ending_love',
  ENDING_FRIENDSHIP: 'ending_friend',
  ENDING_BETRAYAL: 'ending_betray',
} as const;

export const DEFAULT_SETTINGS = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,
  animationsEnabled: true,
} as const;

export const DEFAULT_PROGRESS = {
  currentScene: 'mainMenu' as const,
  currentDialogueId: DIALOGUE_SCENES.INTRO,
  currentChapterId: 'chapter_1',
  currentLevelId: '',
  currentRecipeIndex: 0,
  affectionLevel: 50,
  storyPath: 'neutral' as const,
  completedRecipes: [],
  unlockedRecipes: ['ramen'],
  completedLevels: [],
  achievements: [],
  totalScore: 0,
  totalStars: 0,
  playTime: 0,
};

