import { NextRequest, NextResponse } from 'next/server';
import { getExperience } from '@/lib/pipeline/generate';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Experience ID is required' },
      { status: 400 }
    );
  }

  const experience = getExperience(id);

  if (!experience) {
    return NextResponse.json(
      { error: 'Experience not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(experience);
}
