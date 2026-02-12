import { NextRequest, NextResponse } from 'next/server';
import { searchTracks, convertSpotifyTrack } from '@/lib/spotify/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const tracks = await searchTracks(query, limit);
    const converted = tracks.map(convertSpotifyTrack);

    return NextResponse.json({ tracks: converted });
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json(
      { error: 'Failed to search Spotify' },
      { status: 500 }
    );
  }
}
