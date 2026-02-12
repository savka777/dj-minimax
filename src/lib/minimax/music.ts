import {
  MusicGenerationRequest,
  MusicGenerationResponse,
  MusicStatusResponse,
  MiniMaxErrorResponse,
} from './types';

const MUSIC_GENERATION_URL = 'https://api.minimax.io/v1/music_generation';
const MAX_LYRICS_LENGTH = 3500;
const MAX_PROMPT_LENGTH = 2000;

function getApiKey(): string {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY environment variable is not set');
  }
  return apiKey;
}

export async function startMusicGeneration(
  lyrics: string,
  stylePrompt: string
): Promise<MusicGenerationResponse> {
  const apiKey = getApiKey();

  // Validate input lengths
  if (lyrics.length > MAX_LYRICS_LENGTH) {
    throw new Error(
      `Lyrics exceed maximum length of ${MAX_LYRICS_LENGTH} characters`
    );
  }
  if (stylePrompt.length > MAX_PROMPT_LENGTH) {
    throw new Error(
      `Style prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`
    );
  }

  const request: MusicGenerationRequest = {
    model: 'music-2.5',
    lyrics,
    prompt: stylePrompt,
  };

  const response = await fetch(MUSIC_GENERATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as MiniMaxErrorResponse;
    throw new Error(
      `MiniMax Music API error: ${errorData.error?.message || response.statusText}`
    );
  }

  return response.json() as Promise<MusicGenerationResponse>;
}

export async function checkMusicStatus(
  generationId: string
): Promise<MusicStatusResponse> {
  const apiKey = getApiKey();

  const response = await fetch(`${MUSIC_GENERATION_URL}/${generationId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as MiniMaxErrorResponse;
    throw new Error(
      `MiniMax Music status error: ${errorData.error?.message || response.statusText}`
    );
  }

  return response.json() as Promise<MusicStatusResponse>;
}

export async function waitForMusicGeneration(
  generationId: string,
  options?: {
    maxWaitMs?: number;
    pollIntervalMs?: number;
    onProgress?: (status: MusicStatusResponse) => void;
  }
): Promise<MusicStatusResponse> {
  const maxWaitMs = options?.maxWaitMs ?? 120000; // 2 minutes default
  const pollIntervalMs = options?.pollIntervalMs ?? 3000; // 3 seconds default
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const status = await checkMusicStatus(generationId);

    if (options?.onProgress) {
      options.onProgress(status);
    }

    if (status.status === 'completed') {
      return status;
    }

    if (status.status === 'failed') {
      throw new Error(`Music generation failed: ${status.error || 'Unknown error'}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(
    `Music generation timed out after ${maxWaitMs / 1000} seconds`
  );
}

export async function generateMusic(
  lyrics: string,
  stylePrompt: string,
  options?: {
    maxWaitMs?: number;
    pollIntervalMs?: number;
    onProgress?: (status: MusicStatusResponse) => void;
  }
): Promise<MusicStatusResponse> {
  const initResponse = await startMusicGeneration(lyrics, stylePrompt);

  if (initResponse.status === 'completed') {
    return initResponse;
  }

  return waitForMusicGeneration(initResponse.id, options);
}
