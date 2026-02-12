'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import type { QueueItem } from '@/lib/types';

const CROSSFADE_DURATION = 2000; // 2 seconds

interface UseAudioPlayerReturn {
  currentItem: QueueItem | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: QueueItem[];
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setQueue: (items: QueueItem[]) => void;
  appendToQueue: (items: QueueItem[]) => void;
  insertAfterCurrent: (items: QueueItem[]) => void;
  playAtIndex: (index: number) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [queue, setQueueState] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const currentHowlRef = useRef<Howl | null>(null);
  const nextHowlRef = useRef<Howl | null>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);
  const crossfadeTimeoutRef = useRef<number | null>(null);
  const hasStartedPlaybackRef = useRef(false);

  const currentItem = queue[currentIndex] || null;

  // Clear time update interval
  const clearTimeUpdate = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Clear crossfade timeout
  const clearCrossfadeTimeout = useCallback(() => {
    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = null;
    }
  }, []);

  // Start time update interval
  const startTimeUpdate = useCallback((howl: Howl) => {
    clearTimeUpdate();
    timeUpdateIntervalRef.current = window.setInterval(() => {
      const seek = howl.seek();
      if (typeof seek === 'number') {
        setCurrentTime(seek);
      }
    }, 100);
  }, [clearTimeUpdate]);

  // Play a specific queue item
  const playItem = useCallback(
    (item: QueueItem, startVolume: number = volume) => {
      // Clean up previous howl
      if (currentHowlRef.current) {
        currentHowlRef.current.unload();
        currentHowlRef.current = null;
      }

      // Guard against empty audio URLs
      if (!item.audioUrl) {
        console.warn('[Audio Player] No audio URL for track:', item.id, '- skipping audio playback');
        setIsPlaying(false);
        setDuration(item.duration || 0);
        return;
      }

      console.log('[Audio Player] Playing track:', item.id, 'URL:', item.audioUrl);

      const howl = new Howl({
        src: [item.audioUrl],
        html5: true,
        volume: startVolume,
        onplay: () => {
          setIsPlaying(true);
          setDuration(howl.duration());
          startTimeUpdate(howl);
        },
        onpause: () => {
          setIsPlaying(false);
          clearTimeUpdate();
        },
        onend: () => {
          // Track ended naturally - this is handled by crossfade logic
        },
        onloaderror: (_, error) => {
          console.error('Audio load error:', error);
        },
        onplayerror: (_, error) => {
          console.error('Audio play error:', error);
        },
      });

      currentHowlRef.current = howl;
      howl.play();

      // Schedule crossfade to next track
      const setupCrossfade = () => {
        const trackDuration = howl.duration() * 1000; // Convert to ms
        const crossfadeStart = trackDuration - CROSSFADE_DURATION;

        if (crossfadeStart > 0) {
          clearCrossfadeTimeout();
          crossfadeTimeoutRef.current = window.setTimeout(() => {
            // Start crossfade
            const nextIndex = currentIndex + 1;
            if (nextIndex < queue.length) {
              const nextItem = queue[nextIndex];

              // Create next howl and start fading
              nextHowlRef.current = new Howl({
                src: [nextItem.audioUrl],
                html5: true,
                volume: 0,
              });

              nextHowlRef.current.play();

              // Fade out current, fade in next
              howl.fade(volume, 0, CROSSFADE_DURATION);
              nextHowlRef.current.fade(0, volume, CROSSFADE_DURATION);

              // After crossfade, switch to next track
              setTimeout(() => {
                howl.unload();
                currentHowlRef.current = nextHowlRef.current;
                nextHowlRef.current = null;
                setCurrentIndex(nextIndex);
                setCurrentTime(0);
                if (currentHowlRef.current) {
                  setDuration(currentHowlRef.current.duration());
                  startTimeUpdate(currentHowlRef.current);
                  // Setup crossfade for the new track
                  setupCrossfade();
                }
              }, CROSSFADE_DURATION);
            }
          }, crossfadeStart);
        }
      };

      // Wait for duration to be available
      howl.once('load', setupCrossfade);
    },
    [volume, currentIndex, queue, clearCrossfadeTimeout, clearTimeUpdate, startTimeUpdate]
  );

  // Play current track
  const play = useCallback(() => {
    if (currentHowlRef.current) {
      currentHowlRef.current.play();
    } else if (currentItem) {
      playItem(currentItem);
    }
  }, [currentItem, playItem]);

  // Pause current track
  const pause = useCallback(() => {
    if (currentHowlRef.current) {
      currentHowlRef.current.pause();
    }
  }, []);

  // Skip to next track
  const next = useCallback(() => {
    console.log('[Audio Player] next() called, currentIndex:', currentIndex, 'queue length:', queue.length);
    clearCrossfadeTimeout();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      console.log('[Audio Player] Advancing to index:', nextIndex, 'track:', queue[nextIndex]?.id);
      setCurrentIndex(nextIndex);
      setCurrentTime(0);
      hasStartedPlaybackRef.current = true;
      // Always play the next track when user presses next
      try {
        playItem(queue[nextIndex]);
      } catch (error) {
        console.error('[Audio Player] Error playing next track:', error);
      }
    } else {
      console.log('[Audio Player] Cannot advance, already at end of queue');
    }
  }, [currentIndex, queue, playItem, clearCrossfadeTimeout]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (currentHowlRef.current) {
      currentHowlRef.current.volume(clampedVolume);
    }
  }, []);

  // Set queue
  const setQueue = useCallback((items: QueueItem[]) => {
    // Clean up current playback
    if (currentHowlRef.current) {
      currentHowlRef.current.unload();
      currentHowlRef.current = null;
    }
    if (nextHowlRef.current) {
      nextHowlRef.current.unload();
      nextHowlRef.current = null;
    }
    clearTimeUpdate();
    clearCrossfadeTimeout();

    // Reset playback tracking for new queue
    hasStartedPlaybackRef.current = false;

    setQueueState(items);
    setCurrentIndex(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [clearTimeUpdate, clearCrossfadeTimeout]);

  // Append items to end of queue
  const appendToQueue = useCallback((items: QueueItem[]) => {
    setQueueState((prev) => [...prev, ...items]);
  }, []);

  // Insert items after current track (for DJ injection)
  const insertAfterCurrent = useCallback((items: QueueItem[]) => {
    setQueueState((prev) => {
      const before = prev.slice(0, currentIndex + 1);
      const after = prev.slice(currentIndex + 1);
      return [...before, ...items, ...after];
    });
  }, [currentIndex]);

  // Previous track
  const previous = useCallback(() => {
    clearCrossfadeTimeout();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      setCurrentTime(0);
      // Always play the previous track when user presses previous
      playItem(queue[prevIndex]);
    }
  }, [currentIndex, queue, playItem, clearCrossfadeTimeout]);

  // Seek to a specific time
  const seek = useCallback((time: number) => {
    if (currentHowlRef.current) {
      currentHowlRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  // Play at a specific index
  const playAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      clearCrossfadeTimeout();
      setCurrentIndex(index);
      setCurrentTime(0);
      playItem(queue[index]);
    }
  }, [queue, playItem, clearCrossfadeTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentHowlRef.current) {
        currentHowlRef.current.unload();
      }
      if (nextHowlRef.current) {
        nextHowlRef.current.unload();
      }
      clearTimeUpdate();
      clearCrossfadeTimeout();
    };
  }, [clearTimeUpdate, clearCrossfadeTimeout]);

  // Auto-play when queue is first set (only once)
  useEffect(() => {
    if (queue.length > 0 && !hasStartedPlaybackRef.current) {
      hasStartedPlaybackRef.current = true;
      // Only auto-play if the first track has an audio URL
      if (queue[0].audioUrl) {
        playItem(queue[0]);
      }
    }
  }, [queue, playItem]);

  return {
    currentItem,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    setQueue,
    appendToQueue,
    insertAfterCurrent,
    playAtIndex,
  };
}
