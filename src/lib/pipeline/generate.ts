import { Experience, QueueItem } from '../types';
import { generateDJScript } from '../minimax/m2';
import { startMusicGeneration, waitForMusicGeneration } from '../minimax/music';
import { generateDJAudio } from '../minimax/speech';
import { DJ_SYSTEM_PROMPT, buildUserContext } from './prompts';

// In-memory storage for experiences
const experiences = new Map<string, Experience>();

export function getExperience(id: string): Experience | undefined {
  return experiences.get(id);
}

export function setExperience(id: string, experience: Experience): void {
  experiences.set(id, experience);
}

export function updateExperience(
  id: string,
  updates: Partial<Experience>
): Experience | undefined {
  const existing = experiences.get(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...updates };
  experiences.set(id, updated);
  return updated;
}

function generateId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateQueueItemId(): string {
  return `qi_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface GenerateOptions {
  artists: string[];
  genres?: string[];
  mood?: string;
}

export async function startGeneration(options: GenerateOptions): Promise<string> {
  const experienceId = generateId();

  // Initialize experience
  const experience: Experience = {
    id: experienceId,
    status: 'generating',
    progress: { step: 'Initializing', percent: 0 },
    context: {
      artists: options.artists,
      genres: options.genres || [],
      mood: options.mood || 'energetic',
    },
  };

  setExperience(experienceId, experience);

  // Start async generation (don't await)
  runGeneration(experienceId, options).catch((error) => {
    console.error(`Generation failed for ${experienceId}:`, error);
    updateExperience(experienceId, {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  });

  return experienceId;
}

async function runGeneration(
  experienceId: string,
  options: GenerateOptions
): Promise<void> {
  // Step 1: Generate DJ script with M2.1
  updateExperience(experienceId, {
    progress: { step: 'Creating DJ script', percent: 10 },
  });

  const userContext = buildUserContext(
    options.artists,
    options.genres || [],
    options.mood || 'energetic'
  );

  const djScript = await generateDJScript(DJ_SYSTEM_PROMPT, userContext);

  updateExperience(experienceId, {
    djIntroText: djScript.dj_intro,
    djOutroText: djScript.dj_outro,
    aiSongTitle: djScript.song_title,
    progress: { step: 'Starting audio generation', percent: 20 },
  });

  // Step 2: Start all generations in parallel
  updateExperience(experienceId, {
    progress: { step: 'Generating audio', percent: 25 },
  });

  // Start music generation (async, will poll)
  const musicPromise = startMusicGeneration(djScript.song_lyrics, djScript.song_style);

  // Generate DJ intro and outro audio in parallel
  const [introAudio, outroAudio, musicInit] = await Promise.all([
    generateDJAudio(djScript.dj_intro, 'male_energetic'),
    generateDJAudio(djScript.dj_outro, 'male_energetic'),
    musicPromise,
  ]);

  updateExperience(experienceId, {
    progress: { step: 'Waiting for song generation', percent: 40 },
  });

  // Step 3: Poll for music completion
  const musicResult = await waitForMusicGeneration(musicInit.id, {
    maxWaitMs: 180000, // 3 minutes max
    pollIntervalMs: 3000,
    onProgress: () => {
      const exp = getExperience(experienceId);
      if (exp && exp.progress) {
        // Gradually increase progress while waiting
        const newPercent = Math.min(85, (exp.progress.percent || 40) + 2);
        updateExperience(experienceId, {
          progress: { step: 'Generating song', percent: newPercent },
        });
      }
    },
  });

  updateExperience(experienceId, {
    progress: { step: 'Assembling queue', percent: 90 },
  });

  // Step 4: Build the queue
  const queue: QueueItem[] = [
    {
      id: generateQueueItemId(),
      type: 'dj_intro',
      audioUrl: introAudio.audio_url || '',
      metadata: {
        title: 'DJ Intro',
        djText: djScript.dj_intro,
        isAiGenerated: true,
      },
      duration: introAudio.duration || 10,
    },
    {
      id: generateQueueItemId(),
      type: 'ai_song',
      audioUrl: musicResult.audio_url || '',
      metadata: {
        title: djScript.song_title,
        artist: 'AI Generated',
        isAiGenerated: true,
      },
      duration: musicResult.duration || 120,
    },
    {
      id: generateQueueItemId(),
      type: 'dj_outro',
      audioUrl: outroAudio.audio_url || '',
      metadata: {
        title: 'DJ Outro',
        djText: djScript.dj_outro,
        isAiGenerated: true,
      },
      duration: outroAudio.duration || 8,
    },
  ];

  // Step 5: Mark as ready
  updateExperience(experienceId, {
    status: 'ready',
    progress: { step: 'Complete', percent: 100 },
    queue,
  });
}
