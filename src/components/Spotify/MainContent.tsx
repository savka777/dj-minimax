'use client';

import { TrackRow } from './TrackRow';
import { AlbumArtGrid } from './AlbumArtGrid';
import type { SpotifyTrack } from '@/lib/spotify/tracks';

interface MainContentProps {
  tracks: SpotifyTrack[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onTrackSelect: (track: SpotifyTrack, index: number) => void;
  djStatus?: 'idle' | 'generating' | 'ready' | 'error';
}

// Mock users for "Added by" column
const MOCK_USERS = [
  { name: 'Caitlin Yardley', avatar: 'C' },
  { name: 'Sav', avatar: 'S' },
];

export function MainContent({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
  djStatus,
}: MainContentProps) {
  // Get unique album art for the grid (first 4 unique)
  const uniqueAlbumArts = [...new Set(tracks.map((t) => t.albumArt))].slice(0, 4);

  // Calculate total duration
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.round(totalDuration / 60);

  return (
    <div className="min-h-full">
      {/* Playlist header with gradient */}
      <div className="bg-gradient-to-b from-purple-900/60 to-zinc-900 px-6 pb-6 pt-16">
        <div className="flex items-end gap-6">
          {/* Playlist cover - 2x2 grid */}
          <AlbumArtGrid images={uniqueAlbumArts} size={192} />

          {/* Playlist info */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium">Public Playlist</span>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Daily Mix 4
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
              {/* Creator avatars */}
              <div className="flex -space-x-2">
                {MOCK_USERS.map((user) => (
                  <div
                    key={user.name}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white ring-2 ring-zinc-900"
                    title={user.name}
                  >
                    {user.avatar}
                  </div>
                ))}
              </div>
              <span className="font-medium text-white hover:underline cursor-pointer">
                Caitlin Yardley
              </span>
              <span>and</span>
              <span className="font-medium text-white hover:underline cursor-pointer">
                Sav
              </span>
              <span className="text-zinc-400">•</span>
              <span>{tracks.length} songs,</span>
              <span className="text-zinc-400">about {totalMinutes} min</span>
              {djStatus === 'generating' && (
                <>
                  <span className="text-zinc-400">•</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                    AI DJ generating...
                  </span>
                </>
              )}
              {djStatus === 'ready' && (
                <>
                  <span className="text-zinc-400">•</span>
                  <span className="text-green-400">AI DJ ready</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center gap-4 bg-zinc-900/60 px-6 py-4">
        {/* Play button */}
        <button
          onClick={() => tracks[0] && onTrackSelect(tracks[0], 0)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-lg transition-transform hover:scale-105 hover:bg-green-400"
          aria-label="Play"
        >
          <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Shuffle button */}
        <button className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        </button>

        {/* Add to library button */}
        <button className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8m-4-4h8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Download button */}
        <button className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 4v4H7l5 5 5-5h-4V8h-2z" />
          </svg>
        </button>

        {/* More options button */}
        <button className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* List view toggle */}
        <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <span>List</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Track list */}
      <div className="px-6 pb-24">
        {/* Header row */}
        <div className="grid grid-cols-[16px_4fr_2fr_2fr_1fr] items-center gap-4 border-b border-zinc-800 px-4 py-2 text-sm text-zinc-400">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Added by</span>
          <span className="text-right">
            <svg className="ml-auto h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
          </span>
        </div>

        {/* Track rows */}
        <div className="mt-2">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index + 1}
              isCurrentTrack={track.id === currentTrackId}
              isPlaying={isPlaying && track.id === currentTrackId}
              onClick={() => onTrackSelect(track, index)}
              addedBy={MOCK_USERS[index % MOCK_USERS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
