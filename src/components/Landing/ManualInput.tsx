'use client';

import { useState } from 'react';
import type { GenerateRequest } from '@/lib/types';

interface ManualInputProps {
  onSubmit: (data: GenerateRequest) => void;
  isLoading?: boolean;
}

export function ManualInput({ onSubmit, isLoading = false }: ManualInputProps) {
  const [artistsInput, setArtistsInput] = useState('');
  const [genresInput, setGenresInput] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const artists = artistsInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (artists.length === 0) return;

    const genres = genresInput
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    onSubmit({
      artists,
      genres: genres.length > 0 ? genres : undefined,
      mood: mood.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Artists Input - Required */}
      <div className="space-y-2">
        <label
          htmlFor="artists"
          className="block text-sm font-medium text-zinc-300"
        >
          Artists <span className="text-purple-400">*</span>
        </label>
        <input
          id="artists"
          type="text"
          value={artistsInput}
          onChange={(e) => setArtistsInput(e.target.value)}
          placeholder="Drake, The Weeknd, Travis Scott"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-zinc-500">
          Enter artist names separated by commas
        </p>
      </div>

      {/* Genres Input - Optional */}
      <div className="space-y-2">
        <label
          htmlFor="genres"
          className="block text-sm font-medium text-zinc-300"
        >
          Genres <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          id="genres"
          type="text"
          value={genresInput}
          onChange={(e) => setGenresInput(e.target.value)}
          placeholder="Hip-Hop, R&B, Pop"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          disabled={isLoading}
        />
      </div>

      {/* Mood Input - Optional */}
      <div className="space-y-2">
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-zinc-300"
        >
          Mood <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          id="mood"
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Energetic, Chill, Party vibes"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || artistsInput.trim().length === 0}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-amber-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-purple-500 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          'Generate My Experience'
        )}
      </button>
    </form>
  );
}
