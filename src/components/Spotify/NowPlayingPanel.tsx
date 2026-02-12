'use client';

import Image from 'next/image';
import type { SpotifyTrack } from '@/lib/spotify/tracks';
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb';

type DJSegment = 'dj_intro' | 'ai_song' | 'dj_outro';

interface NowPlayingPanelProps {
  track: SpotifyTrack | null;
  isDJPlaying?: boolean;
  djSegment?: DJSegment;
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

export function NowPlayingPanel({ track, isDJPlaying, djSegment }: NowPlayingPanelProps) {
  if (!track && !isDJPlaying) {
    return (
      <aside className="hidden w-80 flex-shrink-0 flex-col bg-zinc-900 p-4 lg:flex rounded-lg">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-zinc-500">No track playing</p>
        </div>
      </aside>
    );
  }

  // DJ Mode - show animated orb and info
  if (isDJPlaying) {
    return (
      <aside className="hidden w-80 flex-shrink-0 flex-col overflow-y-auto bg-zinc-900 lg:flex rounded-lg transition-shadow duration-300 animate-dj-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-bold text-purple-400">DJ Minimax</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>
        </div>

        {/* Animated Orb - centered */}
        <div className="flex items-center justify-center mx-4 aspect-square">
          <div className="w-64 h-64 relative">
            <VoicePoweredOrb
              enableVoiceControl={false}
              hue={280}
              maxRotationSpeed={1.5}
              maxHoverIntensity={0.6}
              className="rounded-full overflow-hidden"
            />
          </div>
        </div>

        {/* DJ Info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-bold text-white">DJ Minimax</h3>
              <p className="mt-1 truncate text-sm text-purple-400">
                Now Playing: {getDJSegmentLabel(djSegment)}
              </p>
            </div>
          </div>
        </div>

        {/* DJ Description */}
        <div className="p-4 pt-0">
          <p className="text-sm text-zinc-400">
            Your AI radio DJ is creating a personalized experience based on your music taste.
          </p>
        </div>
      </aside>
    );
  }

  // Normal track mode
  return (
    <aside className="hidden w-80 flex-shrink-0 flex-col overflow-y-auto bg-zinc-900 lg:flex rounded-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <span className="text-sm font-bold text-white">{track!.artist}</span>
        <div className="flex items-center gap-2">
          <button className="text-zinc-400 hover:text-white">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          <button className="text-zinc-400 hover:text-white">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Large Album Art */}
      <div className="relative mx-4 aspect-square overflow-hidden rounded-lg">
        <Image
          src={track!.albumArt}
          alt={track!.album}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Track Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-white">{track!.title}</h3>
            <p className="mt-1 truncate text-sm text-zinc-400 hover:text-white hover:underline cursor-pointer">
              {track!.artist}
            </p>
          </div>
          <button className="ml-4 text-green-500 hover:text-green-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Related music videos section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Related music videos</h4>
          <button className="text-xs text-zinc-400 hover:text-white hover:underline">
            Show all
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Placeholder video thumbnails */}
          <div className="flex items-center gap-3 rounded-md p-2 hover:bg-zinc-800/50 cursor-pointer">
            <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
              <Image
                src={track!.albumArt}
                alt="Video thumbnail"
                fill
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{track!.title}</p>
              <p className="truncate text-xs text-zinc-400">{track!.artist} - Official Video</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md p-2 hover:bg-zinc-800/50 cursor-pointer">
            <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
              <Image
                src={track!.albumArt}
                alt="Video thumbnail"
                fill
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{track!.title} (Live)</p>
              <p className="truncate text-xs text-zinc-400">{track!.artist} - Live Performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credits section */}
      <div className="p-4">
        <h4 className="text-sm font-bold text-white">Credits</h4>
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-sm text-white">{track!.artist}</p>
            <p className="text-xs text-zinc-400">Main Artist</p>
          </div>
        </div>
        <button className="mt-3 text-xs font-medium text-zinc-400 hover:text-white hover:underline">
          Show all
        </button>
      </div>
    </aside>
  );
}
