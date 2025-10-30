/**
 * Sound Effects Hook
 * Manages audio playback for SFX and music
 */

import { useCallback, useEffect, useRef } from 'react';
import { GameSettings } from '../types/game.types';

export const useSound = (settings: GameSettings) => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      musicRef.current?.pause();
      sfxRefs.current.forEach((audio) => audio.pause());
    };
  }, []);

  const playMusic = useCallback(
    (trackName: string, loop: boolean = true) => {
      if (!settings.musicEnabled) return;

      try {
        if (musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
        }

        const audio = new Audio(`/assets/music/${trackName}.mp3`);
        audio.volume = settings.musicVolume;
        audio.loop = loop;
        
        audio.play().catch((err) => {
          console.warn('Music playback failed:', err);
        });

        musicRef.current = audio;
      } catch (error) {
        console.error('Failed to play music:', error);
      }
    },
    [settings.musicEnabled, settings.musicVolume]
  );

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      musicRef.current = null;
    }
  }, []);

  const pauseMusic = useCallback(() => {
    musicRef.current?.pause();
  }, []);

  const resumeMusic = useCallback(() => {
    if (settings.musicEnabled) {
      musicRef.current?.play().catch((err) => {
        console.warn('Resume music failed:', err);
      });
    }
  }, [settings.musicEnabled]);

  const playSFX = useCallback(
    (sfxName: string) => {
      if (!settings.sfxEnabled) return;

      try {
        const audio = new Audio(`/assets/sfx/${sfxName}.mp3`);
        audio.volume = settings.sfxVolume;
        
        audio.play().catch((err) => {
          console.warn('SFX playback failed:', err);
        });

        sfxRefs.current.set(sfxName, audio);

        // Cleanup after playing
        audio.addEventListener('ended', () => {
          sfxRefs.current.delete(sfxName);
        });
      } catch (error) {
        console.error('Failed to play SFX:', error);
      }
    },
    [settings.sfxEnabled, settings.sfxVolume]
  );

  const setMusicVolume = useCallback((volume: number) => {
    if (musicRef.current) {
      musicRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    playSFX,
    setMusicVolume,
  };
};

