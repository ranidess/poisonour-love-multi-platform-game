/**
 * Credits Scene Component
 * Game credits and acknowledgments
 */

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CreditsSceneProps {
  onBack: () => void;
}

export const CreditsScene = ({ onBack }: CreditsSceneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-game-accent to-game-dark flex items-center justify-center p-4"
    >
      <Card className="max-w-2xl">
        <h2 className="text-3xl font-game text-game-primary mb-6 text-center">
          Credits
        </h2>

        <div className="space-y-6 text-game-dark font-game">
          <div>
            <h3 className="text-xl font-bold mb-2">Game Design & Development</h3>
            <p>Created with React, TypeScript, and Framer Motion</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Story & Writing</h3>
            <p>Original GL-inspired narrative</p>
            <p className="text-sm text-gray-600 mt-1">
              Inspired by visual novels and cooking games
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Art Direction</h3>
            <p>Pixel art aesthetic with emoji graphics</p>
            <p className="text-sm text-gray-600 mt-1">
              For custom pixel art, visit: Kenney.nl, itch.io, or OpenGameArt
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Recommended Assets</h3>
            <ul className="text-sm space-y-2">
              <li>• 🎨 Pixel Art: Kenney.nl (free game assets)</li>
              <li>• 🖼️ Characters: itch.io/game-assets</li>
              <li>• 🎵 Music: Free Music Archive, OpenGameArt</li>
              <li>• 🔊 SFX: Freesound.org, Zapsplat</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Vite'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="bg-game-light px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-game-primary to-game-accent text-white rounded-lg p-4 text-center">
            <p className="text-lg">💕</p>
            <p className="text-sm mt-2">
              Made with love for game lovers everywhere
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={onBack} variant="secondary" fullWidth>
            ← Back to Menu
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

