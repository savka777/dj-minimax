import { NextRequest, NextResponse } from 'next/server';
import { searchTracks, convertSpotifyTrack } from '@/lib/spotify/client';

// Get tracks by artist names using search - returns tracks with preview URLs
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artists = searchParams.get('artists')?.split(',') || [];
  const tracksPerArtist = parseInt(searchParams.get('limit') || '3', 10);

  if (artists.length === 0) {
    return NextResponse.json({ error: 'Missing artists parameter' }, { status: 400 });
  }

  try {
    const allTracks = [];

    for (const artistName of artists) {
      // Search for tracks by this artist (max 10 results in dev mode)
      const searchResults = await searchTracks(artistName.trim(), 10);

      // Take the requested number of tracks (preview URLs are largely deprecated by Spotify)
      const artistTracks = searchResults.slice(0, tracksPerArtist);

      allTracks.push(...artistTracks.map(convertSpotifyTrack));
    }

    return NextResponse.json({ tracks: allTracks });
  } catch (error) {
    console.error('Spotify tracks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify tracks' },
      { status: 500 }
    );
  }
}
