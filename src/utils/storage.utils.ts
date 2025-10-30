/**
 * LocalStorage Utilities
 * Handles saving and loading game state
 */

import { GameState, GameProgress, GameSettings } from '../types/game.types';
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_PROGRESS } from '../constants/gameConstants';

export const StorageUtils = {
  /**
   * Save complete game state to localStorage
   */
  saveGameState(state: GameState): boolean {
    try {
      const stateWithTimestamp = {
        ...state,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
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
  loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
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
  saveProgress(progress: GameProgress): boolean {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PROGRESS,
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
  loadProgress(): GameProgress | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
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
  saveSettings(settings: GameSettings): boolean {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
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
  loadSettings(): GameSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
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
  hasSaveData(): boolean {
    return localStorage.getItem(STORAGE_KEYS.GAME_STATE) !== null;
  },

  /**
   * Clear all save data
   */
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
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
