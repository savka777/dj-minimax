'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state: unknown) => void) => void;
  removeListener: (event: string) => void;
  getCurrentState: () => Promise<SpotifyPlaybackState | null>;
  setName: (name: string) => void;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string;
      uri: string;
      name: string;
      duration_ms: number;
      artists: Array<{ name: string; uri: string }>;
      album: {
        name: string;
        uri: string;
        images: Array<{ url: string; height: number; width: number }>;
      };
    };
    previous_tracks: Array<unknown>;
    next_tracks: Array<unknown>;
  };
}

interface UseSpotifyPlayerResult {
  isReady: boolean;
  isAuthenticated: boolean;
  deviceId: string | null;
  currentTrack: {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    duration: number;
  } | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  play: (spotifyUri?: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export function useSpotifyPlayer(): UseSpotifyPlayerResult {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<UseSpotifyPlayerResult['currentTrack']>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.5);

  const playerRef = useRef<SpotifyPlayer | null>(null);
  const tokenRef = useRef<string | null>(null);
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          tokenRef.current = data.access_token;
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Load Spotify SDK and initialize player
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load SDK script
    if (!document.getElementById('spotify-sdk')) {
      const script = document.createElement('script');
      script.id = 'spotify-sdk';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'DJ Minimax',
        getOAuthToken: async (cb) => {
          // Try to get fresh token
          try {
            const response = await fetch('/api/auth/token');
            if (response.ok) {
              const data = await response.json();
              tokenRef.current = data.access_token;
              cb(data.access_token);
            } else {
              // Try to refresh
              const refreshResponse = await fetch('/api/auth/token', { method: 'POST' });
              if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                tokenRef.current = data.access_token;
                cb(data.access_token);
              }
            }
          } catch (error) {
            console.error('Failed to get token:', error);
          }
        },
        volume: 0.5,
      });

      player.addListener('ready', (state: unknown) => {
        const { device_id } = state as { device_id: string };
        console.log('Spotify Player ready with Device ID:', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener('not_ready', (state: unknown) => {
        const { device_id } = state as { device_id: string };
        console.log('Device ID has gone offline:', device_id);
        setIsReady(false);
      });

      player.addListener('player_state_changed', (state: unknown) => {
        if (!state) return;
        const playbackState = state as SpotifyPlaybackState;

        const track = playbackState.track_window.current_track;
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || '',
          duration: Math.round(track.duration_ms / 1000),
        });
        setIsPlaying(!playbackState.paused);
        setPosition(Math.round(playbackState.position / 1000));
        setDuration(Math.round(playbackState.duration / 1000));
      });

      player.addListener('initialization_error', (state: unknown) => {
        const { message } = state as { message: string };
        console.error('Spotify initialization error:', message);
      });

      player.addListener('authentication_error', (state: unknown) => {
        const { message } = state as { message: string };
        console.error('Spotify authentication error:', message);
        setIsAuthenticated(false);
      });

      player.addListener('account_error', (state: unknown) => {
        const { message } = state as { message: string };
        console.error('Spotify account error:', message);
      });

      player.connect();
      playerRef.current = player;
    };

    // If SDK already loaded
    if (window.Spotify) {
      window.onSpotifyWebPlaybackSDKReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Position tracking interval
  useEffect(() => {
    if (isPlaying) {
      positionIntervalRef.current = setInterval(() => {
        setPosition((prev) => prev + 1);
      }, 1000);
    } else {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    }

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const play = useCallback(
    async (spotifyUri?: string) => {
      if (!deviceId || !tokenRef.current) return;

      try {
        // First, transfer playback to our web player
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: false,
          }),
        });

        // Small delay to ensure transfer completes
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Now play the track
        const body: { uris?: string[]; context_uri?: string } = {};

        if (spotifyUri) {
          if (spotifyUri.includes(':track:')) {
            body.uris = [spotifyUri];
          } else {
            body.context_uri = spotifyUri;
          }
        }

        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.error('Play error:', error);
      }
    },
    [deviceId]
  );

  const pause = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.pause();
    }
  }, []);

  const resume = useCallback(async () => {
    if (!deviceId || !tokenRef.current) {
      if (playerRef.current) {
        await playerRef.current.resume();
      }
      return;
    }

    try {
      // Transfer playback to our device and start playing
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true,
        }),
      });
    } catch (error) {
      console.error('Resume error:', error);
      // Fallback to SDK method
      if (playerRef.current) {
        await playerRef.current.resume();
      }
    }
  }, [deviceId]);

  const seek = useCallback(async (positionSeconds: number) => {
    if (playerRef.current) {
      await playerRef.current.seek(positionSeconds * 1000);
      setPosition(positionSeconds);
    }
  }, []);

  const setVolume = useCallback(async (newVolume: number) => {
    if (playerRef.current) {
      await playerRef.current.setVolume(newVolume);
      setVolumeState(newVolume);
    }
  }, []);

  const nextTrack = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.nextTrack();
    }
  }, []);

  const previousTrack = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.previousTrack();
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = '/api/auth/spotify';
  }, []);

  const logout = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.disconnect();
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setIsReady(false);
    setDeviceId(null);
    tokenRef.current = null;
  }, []);

  return {
    isReady,
    isAuthenticated,
    deviceId,
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    login,
    logout,
  };
}
