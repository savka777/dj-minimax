'use client';

import type { QueueItem } from '@/lib/types';

interface TrackDisplayProps {
  item: QueueItem | null;
  currentTime: number;
  duration: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TrackDisplay({ item, currentTime, duration }: TrackDisplayProps) {
  if (!item) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-zinc-900">
        <p className="text-zinc-500">No track loaded</p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isAiGenerated = item.metadata.isAiGenerated || item.type === 'ai_song';
  const isDjSegment = item.type === 'dj_intro' || item.type === 'dj_outro';

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background */}
      <div className="relative aspect-square w-full max-w-md">
        {/* Album art or gradient background */}
        {item.metadata.albumArt ? (
          <img
            src={item.metadata.albumArt}
            alt={item.metadata.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`h-full w-full ${
              isDjSegment
                ? 'bg-gradient-to-br from-purple-900 via-zinc-900 to-purple-900'
                : isAiGenerated
                  ? 'bg-gradient-to-br from-amber-900 via-zinc-900 to-purple-900'
                  : 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800'
            }`}
          >
            {/* Animated background for AI song */}
            {isAiGenerated && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 animate-pulse bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10"
                  style={{ animationDuration: '2s' }}
                />
                {/* Sparkle effects */}
                <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-ping rounded-full bg-amber-400/50" />
                <div
                  className="absolute right-1/3 top-1/2 h-1 w-1 animate-ping rounded-full bg-purple-400/50"
                  style={{ animationDelay: '0.5s' }}
                />
                <div
                  className="absolute bottom-1/3 left-1/2 h-1.5 w-1.5 animate-ping rounded-full bg-amber-400/50"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            )}

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isDjSegment ? (
                <svg
                  className="h-24 w-24 text-purple-400/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : isAiGenerated ? (
                <svg
                  className="h-24 w-24 text-amber-400/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                </svg>
              ) : (
                <svg
                  className="h-24 w-24 text-zinc-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        {/* DJ Text/Captions overlay */}
        {isDjSegment && item.metadata.djText && (
          <div className="absolute inset-x-0 bottom-24 px-6">
            <div className="rounded-lg bg-black/60 p-4 backdrop-blur-sm">
              <p className="text-center text-lg italic text-white">
                "{item.metadata.djText}"
              </p>
            </div>
          </div>
        )}

        {/* Track info overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          {/* AI generated badge */}
          {isAiGenerated && (
            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-3 py-1 text-sm">
              <svg
                className="h-4 w-4 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
              <span className="text-amber-200">AI Generated</span>
            </div>
          )}

          {/* Title and artist */}
          <h2 className="mb-1 text-2xl font-bold text-white">
            {item.metadata.title}
          </h2>
          {item.metadata.artist && (
            <p className="text-lg text-zinc-400">{item.metadata.artist}</p>
          )}

          {/* Progress bar */}
          <div className="mt-4 space-y-2">
            <div className="h-1 overflow-hidden rounded-full bg-zinc-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
