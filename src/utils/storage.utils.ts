/**
 * LocalStorage Utilities
 * Handles saving and loading game state
 * Now supports per-user data storage based on email
 */

import { GameState, GameProgress, GameSettings } from '../types/game.types';
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_PROGRESS } from '../constants/gameConstants';

// Get storage key with user prefix if logged in
const getUserKey = (baseKey: string, userEmail?: string | null): string => {
  if (userEmail) {
    return `${baseKey}_${userEmail}`;
  }
  return baseKey;
};

export const StorageUtils = {
  /**
   * Save complete game state to localStorage
   */
  saveGameState(state: GameState, userEmail?: string | null): boolean {
    try {
      const stateWithTimestamp = {
        ...state,
        lastSaved: new Date().toISOString(),
      };
      const key = getUserKey(STORAGE_KEYS.GAME_STATE, userEmail);
      localStorage.setItem(
        key,
        JSON.stringify(stateWithTimestamp)
      );
      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      return false;
    }
  },

  /**
   * Load complete game state from localStorage
   */
  loadGameState(userEmail?: string | null): GameState | null {
    try {
      const key = getUserKey(STORAGE_KEYS.GAME_STATE, userEmail);
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      return JSON.parse(saved) as GameState;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  },

  /**
   * Save only progress data
   */
  saveProgress(progress: GameProgress, userEmail?: string | null): boolean {
    try {
      const key = getUserKey(STORAGE_KEYS.PROGRESS, userEmail);
      localStorage.setItem(
        key,
        JSON.stringify(progress)
      );
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  },

  /**
   * Load progress data
   */
  loadProgress(userEmail?: string | null): GameProgress | null {
    try {
      const key = getUserKey(STORAGE_KEYS.PROGRESS, userEmail);
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      return JSON.parse(saved) as GameProgress;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  },

  /**
   * Save settings
   */
  saveSettings(settings: GameSettings, userEmail?: string | null): boolean {
    try {
      const key = getUserKey(STORAGE_KEYS.SETTINGS, userEmail);
      localStorage.setItem(
        key,
        JSON.stringify(settings)
      );
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  },

  /**
   * Load settings
   */
  loadSettings(userEmail?: string | null): GameSettings {
    try {
      const key = getUserKey(STORAGE_KEYS.SETTINGS, userEmail);
      const saved = localStorage.getItem(key);
      if (!saved) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Check if save data exists
   */
  hasSaveData(userEmail?: string | null): boolean {
    const key = getUserKey(STORAGE_KEYS.GAME_STATE, userEmail);
    return localStorage.getItem(key) !== null;
  },

  /**
   * Clear all save data
   */
  clearAllData(userEmail?: string | null): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      const userKey = getUserKey(key, userEmail);
      localStorage.removeItem(userKey);
    });
  },

  /**
   * Get initial game state
   */
  getInitialState(): GameState {
    return {
      progress: DEFAULT_PROGRESS,
      settings: DEFAULT_SETTINGS,
      isGameStarted: false,
      isPaused: false,
      lastSaved: new Date().toISOString(),
    };
  },

  /**
   * Export save data as JSON string
   */
  exportSaveData(): string | null {
    try {
      const state = this.loadGameState();
      if (!state) return null;
      return JSON.stringify(state, null, 2);
    } catch (error) {
      console.error('Failed to export save data:', error);
      return null;
    }
  },

  /**
   * Import save data from JSON string
   */
  importSaveData(jsonData: string): boolean {
    try {
      const state = JSON.parse(jsonData) as GameState;
      return this.saveGameState(state);
    } catch (error) {
      console.error('Failed to import save data:', error);
      return false;
    }
  },
};

// Export individual functions for convenience
export const {
  saveGameState,
  loadGameState,
  saveProgress,
  loadProgress,
  saveSettings,
  loadSettings,
  hasSaveData,
  clearAllData,
  getInitialState,
  exportSaveData,
  importSaveData,
} = StorageUtils;
