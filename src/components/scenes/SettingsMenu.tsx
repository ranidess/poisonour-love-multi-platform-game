/**
 * Settings Menu Component
 * Game settings and preferences
 */

import { motion } from 'framer-motion';
import { GameSettings } from '../../types/game.types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SettingsMenuProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onBack: () => void;
  onResetGame?: () => void;
}

export const SettingsMenu = ({
  settings,
  onSettingsChange,
  onBack,
  onResetGame,
}: SettingsMenuProps) => {
  const handleVolumeChange = (type: 'music' | 'sfx', value: number) => {
    if (type === 'music') {
      onSettingsChange({ musicVolume: value });
    } else {
      onSettingsChange({ sfxVolume: value });
    }
  };

  const handleToggle = (setting: keyof GameSettings) => {
    onSettingsChange({ [setting]: !settings[setting] });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-game-dark to-game-accent flex items-center justify-center p-4"
    >
      <Card className="max-w-2xl w-full">
        <h2 className="text-3xl font-game text-game-primary mb-6 text-center">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Music settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-game text-game-dark">Music</label>
              <button
                onClick={() => handleToggle('musicEnabled')}
                className={`
                  w-12 h-6 rounded-full transition-colors
                  ${settings.musicEnabled ? 'bg-game-primary' : 'bg-gray-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.musicEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
            {settings.musicEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* SFX settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-game text-game-dark">Sound Effects</label>
              <button
                onClick={() => handleToggle('sfxEnabled')}
                className={`
                  w-12 h-6 rounded-full transition-colors
                  ${settings.sfxEnabled ? 'bg-game-primary' : 'bg-gray-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.sfxEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
            {settings.sfxEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <label className="font-game text-game-dark">Animations</label>
            <button
              onClick={() => handleToggle('animationsEnabled')}
              className={`
                w-12 h-6 rounded-full transition-colors
                ${settings.animationsEnabled ? 'bg-game-primary' : 'bg-gray-300'}
              `}
            >
              <motion.div
                animate={{ x: settings.animationsEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Reset game */}
          {onResetGame && (
            <div className="pt-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 font-game mb-3">
                ⚠️ This will delete all progress and start fresh
              </p>
              <Button
                onClick={onResetGame}
                variant="danger"
                size="sm"
                fullWidth
              >
                Reset Game Data
              </Button>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-8">
          <Button onClick={onBack} variant="secondary" fullWidth>
            ← Back to Menu
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

