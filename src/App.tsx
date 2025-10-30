/**
 * Main App - Multi-Game Platform
 * Navigation: Home → Game Library → Game Selection → Play
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSound } from './hooks/useSound';
import { useAuth } from './contexts/AuthContext';
import { HomeScreen } from './components/platform/HomeScreen';
import { GameLibrary } from './components/platform/GameLibrary';
import { LevelSelection } from './components/platform/LevelSelection';
import { MemoryMatchGame } from './components/game/MemoryMatchGame';
import { CarromGame } from './components/game/CarromGame';
import { SettingsMenu } from './components/scenes/SettingsMenu';
import { CreditsScene } from './components/scenes/CreditsScene';
import {
  GAMES,
  getGameById,
  getMiniGameLevels,
} from './data/games.data';
import { MUSIC_TRACKS, SOUND_EFFECTS, DEFAULT_SETTINGS } from './constants/gameConstants';
import { GameSettings } from './types/game.types';
import { PlatformProgress, MiniGameLevel } from './types/platform.types';
import { saveSettings, loadSettings } from './utils/storage.utils';

type AppScene = 
  | 'home' 
  | 'library' 
  | 'levelSelect' 
  | 'playing' 
  | 'settings' 
  | 'credits';

function App() {
  // Auth state
  const { user } = useAuth();
  
  // Platform state
  const [currentScene, setCurrentScene] = useState<AppScene>('home');
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');

  // Progress state
  const [platformProgress, setPlatformProgress] = useState<PlatformProgress>({
    games: {},
    totalPlayTime: 0,
    achievements: [],
    unlockedGames: ['memory_master', 'carrom_master'],
  });

  // Settings
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const { playMusic, playSFX } = useSound(settings);

  // Level data
  const [miniGameLevels, setMiniGameLevels] = useState<MiniGameLevel[]>([]);

  // Load saved data on mount and when user changes
  useEffect(() => {
    const userEmail = user?.email;
    const savedSettings = loadSettings(userEmail);
    if (savedSettings) {
      setSettings(savedSettings);
    }

    // Load progress from localStorage (user-specific)
    try {
      const storageKey = userEmail ? `platform_progress_${userEmail}` : 'platform_progress';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedProgress = JSON.parse(saved) as PlatformProgress;
        setPlatformProgress(parsedProgress);
      } else {
        // Reset to default if no user data found
        setPlatformProgress({
          games: {},
          totalPlayTime: 0,
          achievements: [],
          unlockedGames: ['memory_master', 'carrom_master'],
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, [user]);

  // Save progress whenever it changes (user-specific)
  useEffect(() => {
    try {
      const userEmail = user?.email;
      const storageKey = userEmail ? `platform_progress_${userEmail}` : 'platform_progress';
      localStorage.setItem(storageKey, JSON.stringify(platformProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [platformProgress, user]);

  // Play background music based on scene
  useEffect(() => {
    if (currentScene === 'home' || currentScene === 'library') {
      playMusic(MUSIC_TRACKS.MAIN_MENU);
    } else if (currentScene === 'playing') {
      const game = getGameById(selectedGameId);
      if (game?.gameType === 'story') {
        playMusic(MUSIC_TRACKS.ROMANTIC);
      } else {
        playMusic(MUSIC_TRACKS.COOKING);
      }
    }
  }, [currentScene, selectedGameId, playMusic]);

  const hasSaveData = Object.keys(platformProgress.games).length > 0;

  const handleStartGame = () => {
    playSFX(SOUND_EFFECTS.CLICK);
    setCurrentScene('library');
  };

  const handleContinue = () => {
    playSFX(SOUND_EFFECTS.CLICK);
    setCurrentScene('library');
  };

  const handleGameSelect = (gameId: string) => {
    playSFX(SOUND_EFFECTS.CLICK);
    setSelectedGameId(gameId);
    
    const game = getGameById(gameId);
    if (!game) return;

    // All remaining games have levels (no story games)
    if (game.hasLevels) {
      const levels = getMiniGameLevels(gameId);
      setMiniGameLevels(levels);
      setCurrentScene('levelSelect');
    }
  };

  const handleLevelSelect = (levelId: string) => {
    playSFX(SOUND_EFFECTS.CLICK);
    setSelectedLevelId(levelId);
    setCurrentScene('playing');
  };

  const handleGameComplete = (score: number, stars?: number) => {
    const isSuccess = score > 0;
    
    if (isSuccess) {
      playSFX(SOUND_EFFECTS.SUCCESS);
    }

    // Update progress only if successful
    if (isSuccess && selectedLevelId) {
      const gameProgress = platformProgress.games[selectedGameId] || {
        gameId: selectedGameId,
        completedChapters: [],
        completedLevels: [],
        totalScore: 0,
        totalStars: 0,
        playTime: 0,
        lastPlayed: Date.now(),
      };

      // Mark level as completed
      if (!gameProgress.completedLevels.includes(selectedLevelId)) {
        gameProgress.completedLevels.push(selectedLevelId);
      }
      gameProgress.totalScore += score;
      if (stars) gameProgress.totalStars += stars;

      // Update level unlock status - ONLY if successful
      const currentIndex = miniGameLevels.findIndex(lv => lv.id === selectedLevelId);
      if (currentIndex >= 0 && currentIndex < miniGameLevels.length - 1) {
        setMiniGameLevels(prev => prev.map((lv, idx) => 
          idx === currentIndex + 1 ? { ...lv, unlocked: true } : lv
        ));
      }

      // Update best score
      setMiniGameLevels(prev => prev.map(lv => 
        lv.id === selectedLevelId 
          ? { ...lv, completed: true, bestScore: Math.max(lv.bestScore, score), stars: Math.max(lv.stars, stars || 0) }
          : lv
      ));

      setPlatformProgress(prev => ({
        ...prev,
        games: {
          ...prev.games,
          [selectedGameId]: gameProgress,
        },
      }));
    }

    // Return to level select (after delay for overlay)
    setTimeout(() => {
      setCurrentScene('levelSelect');
    }, 2000);
  };

  const handleBackToLibrary = () => {
    playSFX(SOUND_EFFECTS.CLICK);
    setCurrentScene('library');
  };

  const handleBackToHome = () => {
    playSFX(SOUND_EFFECTS.CLICK);
    setCurrentScene('home');
  };

  const handleSettingsUpdate = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    const userEmail = user?.email;
    saveSettings(updated, userEmail);
  };

  const handleResetGame = () => {
    setPlatformProgress({
      games: {},
      totalPlayTime: 0,
      achievements: [],
      unlockedGames: ['memory_master', 'carrom_master'],
    });
    setCurrentScene('home');
  };

  const renderScene = () => {
    switch (currentScene) {
      case 'home':
        return (
          <HomeScreen
            hasSaveData={hasSaveData}
            onStartGame={handleStartGame}
            onContinue={handleContinue}
          />
        );

      case 'library':
        return (
          <GameLibrary
            games={GAMES.filter(g => platformProgress.unlockedGames.includes(g.id))}
            onGameSelect={handleGameSelect}
            onBack={handleBackToHome}
          />
        );

      case 'levelSelect':
        const miniGame = getGameById(selectedGameId);
        return (
          <LevelSelection
            gameTitle={miniGame?.title || ''}
            levels={miniGameLevels}
            onLevelSelect={handleLevelSelect}
            onBack={handleBackToLibrary}
          />
        );

      case 'playing':
        return renderGameContent();

      case 'settings':
        return (
          <SettingsMenu
            settings={settings}
            onSettingsChange={handleSettingsUpdate}
            onBack={handleBackToHome}
            onResetGame={handleResetGame}
          />
        );

      case 'credits':
        return <CreditsScene onBack={handleBackToHome} />;

      default:
        return (
          <HomeScreen
            hasSaveData={hasSaveData}
            onStartGame={handleStartGame}
            onContinue={handleContinue}
          />
        );
    }
  };

  const renderGameContent = () => {
    const game = getGameById(selectedGameId);
    if (!game) return <div>Game not found</div>;

    // Memory game
    if (game.gameType === 'memory' && selectedLevelId) {
      const level = miniGameLevels.find(lv => lv.id === selectedLevelId);
      if (!level) return <div>Level not found</div>;

      // Get pairs from level gameData
      const pairs = level.gameData?.pairs || [];
      
      if (pairs.length === 0) {
        return <div>No pairs found for this level</div>;
      }

      return (
        <MemoryMatchGame
          pairs={pairs}
          timeLimit={level.timeLimit}
          onComplete={(score) => handleGameComplete(score, Math.floor(score / 300))}
          onBack={() => {
            playSFX(SOUND_EFFECTS.CLICK);
            setCurrentScene('levelSelect');
          }}
        />
      );
    }

    // Carrom game
    if (game.gameType === 'casual' && selectedLevelId) {
      const level = miniGameLevels.find(lv => lv.id === selectedLevelId);
      if (!level) return <div>Level not found</div>;

      // Get target score from level gameData
      const targetScore = level.gameData?.targetScore || 50;

      return (
        <CarromGame
          targetScore={targetScore}
          timeLimit={level.timeLimit}
          difficulty={level.difficulty}
          onComplete={(score, stars) => handleGameComplete(score, stars)}
          onBack={() => {
            playSFX(SOUND_EFFECTS.CLICK);
            setCurrentScene('levelSelect');
          }}
        />
      );
    }

    return <div>Game type not supported yet</div>;
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
    </div>
  );
}

export default App;
