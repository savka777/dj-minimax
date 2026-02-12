'use client';

import Image from 'next/image';
import type { SpotifyTrack } from '@/lib/spotify/tracks';

type DJSegment = 'dj_intro' | 'ai_song' | 'dj_outro';

interface PlayerBarProps {
  track: SpotifyTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentIndex?: number;
  queueLength?: number;
  isDJPlaying?: boolean;
  djSegment?: DJSegment;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
}

function getDJSegmentLabel(segment?: DJSegment): string {
  switch (segment) {
    case 'dj_intro':
      return 'Intro';
    case 'ai_song':
      return 'AI Song';
    case 'dj_outro':
      return 'Outro';
    default:
      return 'Playing';
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Simple CSS-animated DJ orb for the player bar
function DJOrbSmall({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative h-14 w-14 flex-shrink-0 flex items-center justify-center">
      {/* Animated pulse rings */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-dj-pulse" />
          <div className="absolute inset-1 rounded-full bg-purple-500/30 animate-dj-pulse-delayed" />
        </>
      )}
      {/* Inner orb */}
      <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-500/30">
        {/* Headphones icon */}
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
        </svg>
      </div>
    </div>
  );
}

export function PlayerBar({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  currentIndex = 0,
  queueLength = 0,
  isDJPlaying,
  djSegment,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
}: PlayerBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex h-[90px] items-center justify-between border-t border-zinc-800 bg-black px-4">
      {/* Now playing info (left) */}
      <div className="flex w-[30%] min-w-[180px] items-center gap-3">
        {isDJPlaying ? (
          <>
            <DJOrbSmall isPlaying={isPlaying} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-purple-400">
                DJ Minimax
              </p>
              <p className="truncate text-xs text-purple-300">
                {getDJSegmentLabel(djSegment)}
              </p>
            </div>
          </>
        ) : track ? (
          <>
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={track.albumArt}
                alt={track.album}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {track.title}
              </p>
              <p className="truncate text-xs text-zinc-400">{track.artist}</p>
            </div>
          </>
        ) : (
          <div className="text-sm text-zinc-500">No track selected</div>
        )}
      </div>

      {/* Playback controls (center) */}
      <div className="flex max-w-[722px] flex-1 flex-col items-center gap-2">
        {/* Control buttons */}
        <div className="flex items-center gap-4">
          {/* Shuffle */}
          <button
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Shuffle"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
          </button>

          {/* Previous */}
          <button
            onClick={onPrevious}
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Previous"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Next"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Repeat */}
          <button
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Repeat"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex w-full items-center gap-2">
          <span className="w-10 text-right text-xs text-zinc-400">
            {formatTime(currentTime)}
          </span>
          <div className="group relative h-1 flex-1 rounded-full bg-zinc-600">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white group-hover:bg-green-500"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>
          <span className="w-10 text-xs text-zinc-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume + extras (right) */}
      <div className="flex w-[30%] min-w-[180px] items-center justify-end gap-3">
        {/* Track index indicator (debug) */}
        <span className="text-xs text-zinc-500">
          Track {currentIndex + 1}/{queueLength}
        </span>

        {/* Queue button */}
        <button
          className="text-zinc-400 transition-colors hover:text-white"
          aria-label="Queue"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
          </svg>
        </button>

        {/* Volume */}
        <button
          onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
          className="text-zinc-400 transition-colors hover:text-white"
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        >
          {volume === 0 ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : volume < 0.5 ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
        <div className="group relative h-1 w-24 rounded-full bg-zinc-600">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white group-hover:bg-green-500"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
