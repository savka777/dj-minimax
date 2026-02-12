'use client';

import Image from 'next/image';
import type { SpotifyTrack } from '@/lib/spotify/tracks';

interface AddedByUser {
  name: string;
  avatar: string;
}

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onClick: () => void;
  addedBy?: AddedByUser;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TrackRow({
  track,
  index,
  isCurrentTrack,
  isPlaying,
  onClick,
  addedBy,
}: TrackRowProps) {
  return (
    <div
      onClick={onClick}
      className={`group grid cursor-pointer grid-cols-[16px_4fr_2fr_2fr_1fr] items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-zinc-800/50 ${
        isCurrentTrack ? 'bg-zinc-800/30' : ''
      }`}
    >
      {/* Track number / playing indicator */}
      <div className="flex items-center justify-center">
        {isPlaying ? (
          <div className="flex items-end gap-0.5">
            <div className="h-3 w-0.5 animate-pulse bg-green-500" style={{ animationDelay: '0ms' }} />
            <div className="h-4 w-0.5 animate-pulse bg-green-500" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-0.5 animate-pulse bg-green-500" style={{ animationDelay: '300ms' }} />
          </div>
        ) : isCurrentTrack ? (
          <span className="text-sm text-green-500">{index}</span>
        ) : (
          <>
            <span className="text-sm text-zinc-400 group-hover:hidden">{index}</span>
            <button
              className="hidden text-white group-hover:block"
              aria-label={`Play ${track.title}`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Title and artist */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={track.albumArt}
            alt={track.album}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${
              isCurrentTrack ? 'text-green-500' : 'text-white'
            }`}
          >
            {track.title}
          </p>
          <p className="truncate text-sm text-zinc-400">{track.artist}</p>
        </div>
      </div>

      {/* Album */}
      <p className="truncate text-sm text-zinc-400 hover:text-white hover:underline">
        {track.album}
      </p>

      {/* Added by */}
      <div className="flex items-center gap-2 min-w-0">
        {addedBy && (
          <>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white">
              {addedBy.avatar}
            </div>
            <span className="truncate text-sm text-zinc-400 hover:text-white hover:underline cursor-pointer">
              {addedBy.name}
            </span>
          </>
        )}
      </div>

      {/* Duration */}
      <p className="text-right text-sm text-zinc-400">
        {formatDuration(track.duration)}
      </p>
    </div>
  );
}
