'use client';

import type { QueueItem } from '@/lib/types';

interface QueueListProps {
  queue: QueueItem[];
  currentIndex: number;
}

// Icon components for different track types
function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function getTrackIcon(type: QueueItem['type']) {
  switch (type) {
    case 'dj_intro':
    case 'dj_outro':
      return MicIcon;
    case 'ai_song':
      return SparklesIcon;
    case 'spotify_track':
    default:
      return MusicNoteIcon;
  }
}

function getTrackTypeLabel(type: QueueItem['type']) {
  switch (type) {
    case 'dj_intro':
      return 'DJ Intro';
    case 'dj_outro':
      return 'DJ Outro';
    case 'ai_song':
      return 'AI Generated';
    case 'spotify_track':
      return 'Track';
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function QueueList({ queue, currentIndex }: QueueListProps) {
  return (
    <div className="w-full space-y-2">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Queue
      </h3>
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {queue.map((item, index) => {
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          const Icon = getTrackIcon(item.type);

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30'
                  : isPast
                    ? 'opacity-50'
                    : 'hover:bg-zinc-800/50'
              }`}
            >
              {/* Track icon */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  isCurrent
                    ? 'bg-gradient-to-br from-purple-500 to-amber-500 text-white'
                    : item.type === 'ai_song'
                      ? 'bg-amber-500/20 text-amber-400'
                      : item.type === 'dj_intro' || item.type === 'dj_outro'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate font-medium ${
                    isCurrent ? 'text-white' : 'text-zinc-300'
                  }`}
                >
                  {item.metadata.title}
                </p>
                <p className="truncate text-sm text-zinc-500">
                  {item.metadata.artist || getTrackTypeLabel(item.type)}
                </p>
              </div>

              {/* Duration */}
              <span className="flex-shrink-0 text-sm text-zinc-500">
                {formatDuration(item.duration)}
              </span>

              {/* Playing indicator */}
              {isCurrent && (
                <div className="flex gap-0.5">
                  <div className="h-3 w-0.5 animate-pulse bg-purple-400" />
                  <div
                    className="h-3 w-0.5 animate-pulse bg-amber-400"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="h-3 w-0.5 animate-pulse bg-purple-400"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
