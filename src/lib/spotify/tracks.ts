export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl: string | null;
  duration: number;
  spotifyUrl?: string;
}

// Demo tracks as fallback (with preview URLs where available)
// These are real Spotify track IDs that can be fetched via the API
export const DEMO_TRACK_QUERIES = [
  { artist: 'Deftones', track: 'Change (In the House of Flies)' },
  { artist: 'The Cure', track: "Friday I'm in Love" },
  { artist: 'The Smiths', track: 'This Charming Man' },
  { artist: 'Deftones', track: 'Digital Bath' },
  { artist: 'The Cure', track: 'Lovesong' },
  { artist: 'The Smiths', track: 'There Is a Light That Never Goes Out' },
  { artist: 'Deftones', track: 'Passenger' },
  { artist: 'The Cure', track: "Boys Don't Cry" },
];

// Fallback demo tracks (used when Spotify API is unavailable)
export const DEMO_TRACKS: SpotifyTrack[] = [
  {
    id: 'deftones-change',
    title: 'Change (In the House of Flies)',
    artist: 'Deftones',
    album: 'White Pony',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273d8dcbf7f1e8e01966f70a543',
    previewUrl: null,
    duration: 299,
  },
  {
    id: 'cure-friday',
    title: "Friday I'm in Love",
    artist: 'The Cure',
    album: 'Wish',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2735b2b40c3c7ef9cdd39a48c85',
    previewUrl: null,
    duration: 215,
  },
  {
    id: 'smiths-charming',
    title: 'This Charming Man',
    artist: 'The Smiths',
    album: 'The Smiths',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2738b0c43587de49c14e42f5d5e',
    previewUrl: null,
    duration: 163,
  },
  {
    id: 'deftones-digital',
    title: 'Digital Bath',
    artist: 'Deftones',
    album: 'White Pony',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273d8dcbf7f1e8e01966f70a543',
    previewUrl: null,
    duration: 290,
  },
  {
    id: 'cure-lovesong',
    title: 'Lovesong',
    artist: 'The Cure',
    album: 'Disintegration',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273800da5b6720ec7e1af8e3ee3',
    previewUrl: null,
    duration: 203,
  },
  {
    id: 'smiths-heaven',
    title: 'There Is a Light That Never Goes Out',
    artist: 'The Smiths',
    album: 'The Queen Is Dead',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b27390c29a7e0adea6b4a7f4b8e7',
    previewUrl: null,
    duration: 250,
  },
  {
    id: 'deftones-passenger',
    title: 'Passenger',
    artist: 'Deftones',
    album: 'White Pony',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273d8dcbf7f1e8e01966f70a543',
    previewUrl: null,
    duration: 367,
  },
  {
    id: 'cure-boys',
    title: "Boys Don't Cry",
    artist: 'The Cure',
    album: "Boys Don't Cry",
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273de2747de0a2e459e11a87e63',
    previewUrl: null,
    duration: 154,
  },
];

// Convert SpotifyTrack to QueueItem format
export function spotifyTrackToQueueItem(track: SpotifyTrack) {
  return {
    id: track.id,
    type: 'spotify_track' as const,
    audioUrl: track.previewUrl || '',
    metadata: {
      title: track.title,
      artist: track.artist,
      albumArt: track.albumArt,
    },
    duration: track.duration,
  };
}

// Get unique artists from tracks
export function getArtistsFromTracks(tracks: SpotifyTrack[]): string[] {
  return [...new Set(tracks.map((t) => t.artist))];
}
