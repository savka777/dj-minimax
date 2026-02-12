// Spotify Web API Client using Client Credentials Flow

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrackResponse {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrackResponse[];
    total: number;
    limit: number;
    offset: number;
  };
}

interface SpotifyPlaylistResponse {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  tracks: {
    items: Array<{
      track: SpotifyTrackResponse;
      added_at: string;
      added_by: {
        id: string;
      };
    }>;
    total: number;
  };
}

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials in environment variables');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
  }

  const data: SpotifyTokenResponse = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

async function spotifyFetch<T>(endpoint: string): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Spotify API error details:`, errorBody);
    throw new Error(`Spotify API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

export async function searchTracks(query: string, limit = 10): Promise<SpotifyTrackResponse[]> {
  // Note: Spotify dev mode apps are limited to max 10 results
  const clampedLimit = Math.min(limit, 10);
  const data = await spotifyFetch<SpotifySearchResponse>(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=${clampedLimit}`
  );
  return data.tracks.items;
}

export async function getTrack(trackId: string): Promise<SpotifyTrackResponse> {
  return spotifyFetch<SpotifyTrackResponse>(`/tracks/${trackId}`);
}

export async function getTracks(trackIds: string[]): Promise<SpotifyTrackResponse[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrackResponse[] }>(
    `/tracks?ids=${trackIds.join(',')}`
  );
  return data.tracks;
}

export async function getPlaylist(playlistId: string): Promise<SpotifyPlaylistResponse> {
  return spotifyFetch<SpotifyPlaylistResponse>(`/playlists/${playlistId}`);
}

export async function getArtistTopTracks(
  artistId: string,
  market = 'US'
): Promise<SpotifyTrackResponse[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrackResponse[] }>(
    `/artists/${artistId}/top-tracks?market=${market}`
  );
  return data.tracks;
}

export async function searchArtists(query: string, limit = 5) {
  const data = await spotifyFetch<{
    artists: {
      items: Array<{
        id: string;
        name: string;
        images: SpotifyImage[];
        genres: string[];
      }>;
    };
  }>(`/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`);
  return data.artists.items;
}

// Helper to convert Spotify track to our app's format
export function convertSpotifyTrack(track: SpotifyTrackResponse) {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    previewUrl: track.preview_url,
    duration: Math.round(track.duration_ms / 1000),
    spotifyUrl: track.external_urls.spotify,
  };
}
