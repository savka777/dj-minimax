'use client';

import { useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { TrackDisplay } from './TrackDisplay';
import { QueueList } from './QueueList';
import type { QueueItem } from '@/lib/types';

interface PlayerExperienceProps {
  queue: QueueItem[];
}

export function PlayerExperience({ queue: initialQueue }: PlayerExperienceProps) {
  const {
    currentItem,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    play,
    pause,
    next,
    setVolume,
    setQueue,
  } = useAudioPlayer();

  // Load queue on mount
  useEffect(() => {
    if (initialQueue.length > 0) {
      setQueue(initialQueue);
    }
  }, [initialQueue, setQueue]);

  const isDjSegment =
    currentItem?.type === 'dj_intro' || currentItem?.type === 'dj_outro';
  const isAiSong = currentItem?.type === 'ai_song';

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      {/* Animated background based on current item type */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {isDjSegment && (
          <>
            <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-900/20 blur-3xl" />
            <div
              className="absolute bottom-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-800/15 blur-3xl"
              style={{ animationDelay: '1s' }}
            />
          </>
        )}
        {isAiSong && (
          <>
            <div className="absolute left-1/3 top-1/3 h-96 w-96 animate-pulse rounded-full bg-amber-900/20 blur-3xl" />
            <div
              className="absolute bottom-1/3 right-1/3 h-72 w-72 animate-pulse rounded-full bg-purple-900/15 blur-3xl"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}
        {!isDjSegment && !isAiSong && (
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/30 blur-3xl" />
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
        {/* Track display */}
        <TrackDisplay
          item={currentItem}
          currentTime={currentTime}
          duration={duration}
        />

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Play/Pause button */}
          <button
            onClick={isPlaying ? pause : play}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-amber-500 text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next button */}
          <button
            onClick={next}
            disabled={currentIndex >= queue.length - 1}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next track"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 4v16l10-8z" />
              <rect x="17" y="4" width="2" height="16" />
            </svg>
          </button>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : volume < 0.5 ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-purple-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Queue sidebar */}
      <div className="relative z-10 border-t border-zinc-800 bg-zinc-900/50 px-4 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-md">
          <QueueList queue={queue} currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  );
}
