'use client';

import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '@/lib/spotify/tracks';
import { DEMO_TRACKS } from '@/lib/spotify/tracks';

interface UseSpotifyTracksOptions {
  artists?: string[];
  tracksPerArtist?: number;
}

interface UseSpotifyTracksResult {
  tracks: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
}

export function useSpotifyTracks(options: UseSpotifyTracksOptions = {}): UseSpotifyTracksResult {
  const { artists = ['Deftones', 'The Cure', 'The Smiths'], tracksPerArtist = 3 } = options;

  const [tracks, setTracks] = useState<SpotifyTrack[]>(DEMO_TRACKS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/spotify/tracks?artists=${encodeURIComponent(artists.join(','))}&limit=${tracksPerArtist}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }

        const data = await response.json();

        if (data.tracks && data.tracks.length > 0) {
          // Use Spotify tracks for metadata/album art
          // Note: Preview URLs are largely deprecated by Spotify
          setTracks(data.tracks);
        } else {
          setTracks(DEMO_TRACKS);
        }
      } catch (err) {
        console.error('Error fetching Spotify tracks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fall back to demo tracks on error
        setTracks(DEMO_TRACKS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTracks();
  }, [artists.join(','), tracksPerArtist]);

  return { tracks, isLoading, error };
}

// Hook to search for tracks
export function useSpotifySearch(query: string, limit = 20) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setTracks([]);
      return;
    }

    const controller = new AbortController();

    async function search() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Search error:', err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const timeoutId = setTimeout(search, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, limit]);

  return { tracks, isLoading, error };
}
