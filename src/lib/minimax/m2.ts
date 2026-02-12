import {
  M2Request,
  M2Response,
  M2Message,
  DJScriptOutput,
  MiniMaxErrorResponse,
} from './types';

const MINIMAX_API_URL = 'https://api.minimax.io/v1/chat/completions';

/**
 * Extracts the first complete JSON object from a string.
 * Handles nested objects, strings containing braces, and escape sequences.
 */
function extractFirstJsonObject(content: string): string | null {
  const startIndex = content.indexOf('{');
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\' && inString) {
      escape = true;
      continue;
    }

    if (char === '"' && !escape) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') depth++;
      if (char === '}') {
        depth--;
        if (depth === 0) {
          return content.slice(startIndex, i + 1);
        }
      }
    }
  }

  return null;
}

function getApiKey(): string {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY environment variable is not set');
  }
  return apiKey;
}

export async function chatCompletion(
  messages: M2Message[],
  options?: { temperature?: number; top_p?: number; max_tokens?: number }
): Promise<M2Response> {
  const apiKey = getApiKey();

  const request: M2Request = {
    model: 'MiniMax-M2',
    messages,
    temperature: options?.temperature ?? 1.0,
    top_p: options?.top_p ?? 0.95,
    max_tokens: options?.max_tokens,
  };

  const response = await fetch(MINIMAX_API_URL, {
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
      `MiniMax M2 API error: ${errorData.error?.message || response.statusText}`
    );
  }

  return response.json() as Promise<M2Response>;
}

export async function generateDJScript(
  systemPrompt: string,
  userContext: string
): Promise<DJScriptOutput> {
  const messages: M2Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContext },
  ];

  const response = await chatCompletion(messages, {
    temperature: 1.0,
    top_p: 0.95,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in M2 response');
  }

  // Debug logging for raw response
  console.log('[M2] Raw content length:', content.length);
  console.log('[M2] Raw content preview:', content.slice(0, 500));

  // Parse JSON from the response
  // The model may include thinking tags or markdown code blocks
  let jsonContent = content.trim();

  // Remove <think>...</think> tags if present (model reasoning)
  jsonContent = jsonContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  console.log('[M2] After think-tag removal length:', jsonContent.length);

  // Remove markdown code blocks if present
  if (jsonContent.startsWith('```json')) {
    jsonContent = jsonContent.slice(7);
  } else if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.slice(3);
  }
  if (jsonContent.endsWith('```')) {
    jsonContent = jsonContent.slice(0, -3);
  }
  jsonContent = jsonContent.trim();

  // Extract first complete JSON object using bracket-balanced parser
  const extractedJson = extractFirstJsonObject(jsonContent);
  if (extractedJson) {
    jsonContent = extractedJson;
    console.log('[M2] Extracted JSON length:', jsonContent.length);
    console.log('[M2] Extracted JSON preview:', jsonContent.slice(0, 500));
  } else {
    console.log('[M2] No JSON object found in content');
    console.log('[M2] Content after processing:', jsonContent.slice(0, 500));
  }

  try {
    const parsed = JSON.parse(jsonContent) as DJScriptOutput;

    // Validate required fields
    if (
      !parsed.dj_intro ||
      !parsed.song_style ||
      !parsed.song_lyrics ||
      !parsed.song_title ||
      !parsed.dj_outro
    ) {
      throw new Error('Missing required fields in DJ script output');
    }

    return parsed;
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('[M2] JSON parse error:', e.message);
      console.error('[M2] Failed content:', jsonContent.slice(0, 1000));
      throw new Error(
        `Failed to parse DJ script JSON: ${e.message}. Content preview: ${jsonContent.slice(0, 200)}...`
      );
    }
    throw e;
  }
}
