import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse } from '@/lib/types';
import { startGeneration } from '@/lib/pipeline/generate';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateRequest;

    // Validate request
    if (!body.artists || !Array.isArray(body.artists) || body.artists.length === 0) {
      return NextResponse.json(
        { error: 'At least one artist is required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const artists = body.artists
      .map((a) => String(a).trim())
      .filter((a) => a.length > 0)
      .slice(0, 10); // Limit to 10 artists

    const genres = (body.genres || [])
      .map((g) => String(g).trim())
      .filter((g) => g.length > 0)
      .slice(0, 5); // Limit to 5 genres

    const mood = body.mood ? String(body.mood).trim().slice(0, 100) : undefined;

    // Start generation
    const experienceId = await startGeneration({
      artists,
      genres,
      mood,
    });

    const response: GenerateResponse = {
      experienceId,
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start generation' },
      { status: 500 }
    );
  }
}
