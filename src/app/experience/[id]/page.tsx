'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { GenerationProgress } from '@/components/Loading/GenerationProgress';
import { PlayerExperience } from '@/components/Player/PlayerExperience';
import type { Experience } from '@/lib/types';

interface ExperiencePageProps {
  params: Promise<{ id: string }>;
}

const POLL_INTERVAL = 2000; // 2 seconds

export default function ExperiencePage({ params }: ExperiencePageProps) {
  const { id } = use(params);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    try {
      const response = await fetch(`/api/experience/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experience');
      }
      const data: Experience = await response.json();
      setExperience(data);

      if (data.status === 'error') {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, [id]);

  useEffect(() => {
    // Initial fetch
    fetchExperience();

    // Poll while generating
    const interval = setInterval(() => {
      if (experience?.status !== 'ready' && experience?.status !== 'error') {
        fetchExperience();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchExperience, experience?.status]);

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <svg
              className="h-10 w-10 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Something went wrong
          </h1>
          <p className="text-zinc-400">{error}</p>
          <a
            href="/"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-amber-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  // Loading / initial state
  if (!experience) {
    return (
      <GenerationProgress step="Initializing..." percent={0} />
    );
  }

  // Generating state
  if (experience.status === 'generating') {
    return (
      <GenerationProgress
        step={experience.progress?.step || 'Processing...'}
        percent={experience.progress?.percent || 0}
      />
    );
  }

  // Ready state
  if (experience.status === 'ready' && experience.queue) {
    return <PlayerExperience queue={experience.queue} />;
  }

  // Fallback loading
  return (
    <GenerationProgress step="Loading..." percent={0} />
  );
}
