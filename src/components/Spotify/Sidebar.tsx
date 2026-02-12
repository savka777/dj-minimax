'use client';

import { useState } from 'react';

interface SidebarProps {
  djStatus?: 'idle' | 'generating' | 'ready' | 'error';
}

type FilterTab = 'playlists' | 'artists' | 'albums' | 'podcasts';

const MOCK_PLAYLISTS = [
  {
    id: 'liked-songs',
    name: 'Liked Songs',
    type: 'Playlist',
    icon: 'heart',
    count: '2,084 songs',
  },
  {
    id: 'your-episodes',
    name: 'Your Episodes',
    type: 'Saved & downloaded episodes',
    icon: 'episode',
  },
  {
    id: 'daily-mix-4',
    name: 'Daily Mix 4',
    type: 'Playlist • Caitlin Yardley and Sav',
    icon: null,
    isActive: true,
  },
  {
    id: 'discover-weekly',
    name: 'Discover Weekly',
    type: 'Playlist • Spotify',
    icon: null,
  },
  {
    id: 'release-radar',
    name: 'Release Radar',
    type: 'Playlist • Spotify',
    icon: null,
  },
  {
    id: 'chill-vibes',
    name: 'Chill Vibes',
    type: 'Playlist • 120 songs',
    icon: null,
  },
];

export function Sidebar({ djStatus }: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('playlists');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <aside className="hidden w-72 flex-shrink-0 flex-col bg-black md:flex">
      {/* Navigation */}
      <nav className="rounded-lg bg-zinc-900 p-2">
        <a
          href="#"
          className="flex items-center gap-4 rounded-md px-3 py-2 text-zinc-400 transition-colors hover:text-white"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33z" />
          </svg>
          <span className="font-medium">Home</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-4 rounded-md px-3 py-2 text-zinc-400 transition-colors hover:text-white"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353 1.414-1.414-4.291-4.291a9.284 9.284 0 002.024-5.87c0-5.139-4.226-9.278-9.407-9.278zm0 2c4.08 0 7.407 3.239 7.407 7.279s-3.326 7.279-7.407 7.279c-4.08 0-7.407-3.239-7.407-7.279s3.326-7.279 7.407-7.279z" />
          </svg>
          <span className="font-medium">Search</span>
        </a>
      </nav>

      {/* Library section */}
      <div className="mt-2 flex flex-1 flex-col overflow-hidden rounded-lg bg-zinc-900">
        {/* Library header */}
        <div className="flex items-center justify-between p-4">
          <button className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 22a1 1 0 01-1-1V3a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1H3zm1-2h16V4H4v16z" />
              <path d="M10.5 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
            </svg>
            <span className="font-medium">Your Library</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 px-4 pb-2">
          {(['playlists', 'artists', 'albums', 'podcasts'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                activeFilter === tab
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and sort */}
        <div className="flex items-center justify-between px-4 py-2">
          <button className="text-zinc-400 hover:text-white">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353 1.414-1.414-4.291-4.291a9.284 9.284 0 002.024-5.87c0-5.139-4.226-9.278-9.407-9.278zm0 2c4.08 0 7.407 3.239 7.407 7.279s-3.326 7.279-7.407 7.279c-4.08 0-7.407-3.239-7.407-7.279s3.326-7.279 7.407-7.279z" />
            </svg>
          </button>
          <button className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
            <span>Recents</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Playlist list */}
        <div className="flex-1 overflow-y-auto px-2">
          {MOCK_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              className={`flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-zinc-800 cursor-pointer ${
                playlist.isActive ? 'bg-zinc-800/50' : ''
              }`}
            >
              {/* Playlist icon */}
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded ${
                  playlist.icon === 'heart'
                    ? 'bg-gradient-to-br from-purple-700 to-blue-300'
                    : playlist.icon === 'episode'
                    ? 'bg-gradient-to-br from-green-800 to-green-600'
                    : 'bg-gradient-to-br from-purple-600 via-pink-500 to-amber-500'
                }`}
              >
                {playlist.icon === 'heart' ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : playlist.icon === 'episode' ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{playlist.name}</p>
                <p className="truncate text-xs text-zinc-400">
                  {playlist.count || playlist.type}
                </p>
              </div>
              {/* DJ Status indicator for Daily Mix 4 */}
              {playlist.id === 'daily-mix-4' && djStatus === 'generating' && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                  <span className="text-xs text-amber-500">AI</span>
                </div>
              )}
              {playlist.id === 'daily-mix-4' && djStatus === 'ready' && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-500">Ready</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
