'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';
import { NowPlayingPanel } from './NowPlayingPanel';
import type { SpotifyTrack } from '@/lib/spotify/tracks';

interface LayoutProps {
  children: ReactNode;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentIndex?: number;
  queueLength?: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  djStatus?: 'idle' | 'generating' | 'ready' | 'error';
  isDJPlaying?: boolean;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Layout({
  children,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  currentIndex = 0,
  queueLength = 0,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
  djStatus,
  isDJPlaying,
  isAuthenticated,
  onLogin,
  onLogout,
}: LayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Top Header Bar */}
      <Header isAuthenticated={isAuthenticated} onLogin={onLogin} onLogout={onLogout} />

      {/* Main area with sidebar, content, and now playing panel */}
      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        {/* Sidebar - 280px */}
        <Sidebar djStatus={djStatus} />

        {/* Main content - flex-1 */}
        <main className="flex-1 overflow-y-auto rounded-lg bg-gradient-to-b from-zinc-900 to-black">
          {children}
        </main>

        {/* Now Playing Panel - 320px */}
        <NowPlayingPanel track={currentTrack} isDJPlaying={isDJPlaying} />
      </div>

      {/* Fixed bottom player bar */}
      <PlayerBar
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        currentIndex={currentIndex}
        queueLength={queueLength}
        onPlay={onPlay}
        onPause={onPause}
        onNext={onNext}
        onPrevious={onPrevious}
        onVolumeChange={onVolumeChange}
        onSeek={onSeek}
      />
    </div>
  );
}
