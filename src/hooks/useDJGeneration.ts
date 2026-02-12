'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { QueueItem } from '@/lib/types';

interface UseDJGenerationOptions {
  artists: string[];
  triggerAtIndex?: number; // Default: 4 (track 5)
}

interface UseDJGenerationReturn {
  status: 'idle' | 'generating' | 'ready' | 'error';
  djContent: QueueItem[] | null;
  error: string | null;
  reset: () => void;
}

// Hardcoded DJ content using pre-generated files
const HARDCODED_DJ_CONTENT: QueueItem[] = [
  {
    id: 'dj-intro',
    type: 'dj_intro',
    audioUrl: '/dj/intro.mp3',
    metadata: {
      title: 'DJ Minimax Intro',
      djText: "Hey what's up everyone, DJ Minimax here...",
      isAiGenerated: true,
    },
    duration: 15,
  },
  {
    id: 'dj-song',
    type: 'ai_song',
    audioUrl: '/dj/song.mp3',
    metadata: {
      title: 'Deftones Vibe',
      artist: 'DJ Minimax',
      albumArt: '/dj-album-art.png',
      isAiGenerated: true,
    },
    duration: 120,
  },
  {
    id: 'dj-outro',
    type: 'dj_outro',
    audioUrl: '/dj/outro.mp3',
    metadata: {
      title: 'DJ Minimax Outro',
      djText: 'That was fire! Thanks for listening...',
      isAiGenerated: true,
    },
    duration: 10,
  },
];

export function useDJGeneration(
  currentIndex: number,
  options: UseDJGenerationOptions
): UseDJGenerationReturn {
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [djContent, setDJContent] = useState<QueueItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generationStartedRef = useRef(false);

  const triggerIndex = options.triggerAtIndex ?? 4; // Default to track 5 (index 4)

  // Reset function to allow re-triggering
  const reset = useCallback(() => {
    generationStartedRef.current = false;
    setStatus('idle');
    setDJContent(null);
    setError(null);
  }, []);

  // Trigger generation when reaching the target track index
  useEffect(() => {
    // Trigger at specified index or index + 1 (to catch both tracks 5 and 6)
    const shouldTrigger =
      (currentIndex === triggerIndex || currentIndex === triggerIndex + 1) &&
      !generationStartedRef.current &&
      options.artists.length > 0;

    console.log('[DJ Generation] Check:', {
      currentIndex,
      triggerIndex,
      generationStarted: generationStartedRef.current,
      artistsCount: options.artists.length,
      shouldTrigger,
    });

    if (shouldTrigger) {
      generationStartedRef.current = true;
      console.log('[DJ Generation] Triggering with hardcoded content for demo');

      // Use setTimeout to defer state update and avoid cascading render warning
      setTimeout(() => {
        setDJContent(HARDCODED_DJ_CONTENT);
        setStatus('ready');
        console.log('[DJ Generation] Ready! Queue items:', HARDCODED_DJ_CONTENT.length);
      }, 0);
    }
  }, [currentIndex, triggerIndex, options.artists]);

  return { status, djContent, error, reset };
}
