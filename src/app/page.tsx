'use client';

import { useEffect, useRef, useState } from 'react';
import { Layout, MainContent } from '@/components/Spotify';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useDJGeneration } from '@/hooks/useDJGeneration';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import {
  spotifyTrackToQueueItem,
  getArtistsFromTracks,
} from '@/lib/spotify/tracks';
import type { SpotifyTrack } from '@/lib/spotify/tracks';
export default function Home() {
  // Fallback audio player (for non-Spotify audio like AI DJ content)
  const fallbackPlayer = useAudioPlayer();

  // Spotify Web Playback SDK
  const spotifyPlayer = useSpotifyPlayer();

  // Track play counter - independent of which player is active
  const [trackPlayCount, setTrackPlayCount] = useState(0);

  // Track current Spotify index (since we don't use Spotify's internal queue)
  const [spotifyTrackIndex, setSpotifyTrackIndex] = useState(0);

  // Fetch real Spotify tracks
  const { tracks, isLoading: tracksLoading } = useSpotifyTracks({
    artists: ['Deftones', 'The Cure', 'The Smiths'],
    tracksPerArtist: 3,
  });

  // Get unique artists from tracks for DJ generation
  const artists = getArtistsFromTracks(tracks);

  // DJ generation hook - triggers after N tracks played
  const { status: djStatus, djContent } = useDJGeneration(trackPlayCount, {
    artists,
    triggerAtIndex: 4, // Trigger after 4 songs (when reaching track 5)
  });

  // Track whether we've already injected DJ content
  const djInjectedRef = useRef(false);
  // Track whether we've initialized the queue
  const queueInitializedRef = useRef(false);

  // Initialize queue when tracks are loaded - Spotify tracks first
  useEffect(() => {
    if (tracks.length > 0 && !queueInitializedRef.current) {
      const spotifyQueueItems = tracks.map(spotifyTrackToQueueItem);
      console.log('[Home] Setting queue with Spotify tracks:', spotifyQueueItems.length, 'items');
      fallbackPlayer.setQueue(spotifyQueueItems);
      queueInitializedRef.current = true;
    }
  }, [tracks, fallbackPlayer.setQueue]);

  // Inject DJ content when ready
  useEffect(() => {
    console.log('[Home] DJ injection check:', { djStatus, hasDJContent: !!djContent, injected: djInjectedRef.current });

    if (djStatus === 'ready' && djContent && !djInjectedRef.current) {
      djInjectedRef.current = true;
      console.log('[Home] Injecting DJ content:', djContent.length, 'items');

      // Pause Spotify if it's playing
      if (spotifyPlayer.isPlaying) {
        console.log('[Home] Pausing Spotify');
        spotifyPlayer.pause();
      }

      // Set queue to DJ content and it will auto-play the first item
      console.log('[Home] Setting queue to DJ content');
      fallbackPlayer.setQueue(djContent);
    }
  }, [djStatus, djContent, fallbackPlayer.setQueue, spotifyPlayer]);

  // Determine which player state to use
  // Use Spotify for authenticated users, fallback player otherwise
  const useSpotify = spotifyPlayer.isAuthenticated && spotifyPlayer.isReady;

  // Current track - from Spotify player if authenticated, otherwise from queue
  const currentTrack: SpotifyTrack | null = useSpotify && spotifyPlayer.currentTrack
    ? {
        id: spotifyPlayer.currentTrack.id,
        title: spotifyPlayer.currentTrack.name,
        artist: spotifyPlayer.currentTrack.artist,
        album: spotifyPlayer.currentTrack.album,
        albumArt: spotifyPlayer.currentTrack.albumArt,
        previewUrl: null,
        duration: spotifyPlayer.currentTrack.duration,
      }
    : fallbackPlayer.currentItem
    ? {
        id: fallbackPlayer.currentItem.id,
        title: fallbackPlayer.currentItem.metadata.title,
        artist: fallbackPlayer.currentItem.metadata.artist || 'DJ Minimax',
        album:
          fallbackPlayer.currentItem.type === 'ai_song'
            ? 'AI Generated'
            : fallbackPlayer.currentItem.type === 'dj_intro' || fallbackPlayer.currentItem.type === 'dj_outro'
            ? 'DJ Minimax'
            : '',
        albumArt:
          fallbackPlayer.currentItem.metadata.albumArt ||
          'https://i.scdn.co/image/ab67616d0000b273d8dcbf7f1e8e01966f70a543',
        previewUrl: fallbackPlayer.currentItem.audioUrl,
        duration: fallbackPlayer.currentItem.duration,
      }
    : null;

  // Playback state
  const isPlaying = useSpotify ? spotifyPlayer.isPlaying : fallbackPlayer.isPlaying;
  const currentTime = useSpotify ? spotifyPlayer.position : fallbackPlayer.currentTime;
  const duration = useSpotify ? spotifyPlayer.duration : fallbackPlayer.duration;
  const volume = useSpotify ? spotifyPlayer.volume : fallbackPlayer.volume;

  // Check if DJ content is currently playing (for glow effect)
  const isDJPlaying = fallbackPlayer.currentItem?.type === 'dj_intro' ||
    fallbackPlayer.currentItem?.type === 'ai_song' ||
    fallbackPlayer.currentItem?.type === 'dj_outro';

  // Handle track selection - play via Spotify if authenticated
  const handleTrackSelect = (track: SpotifyTrack, index: number) => {
    console.log('[Page] handleTrackSelect called, index:', index, 'trackPlayCount:', trackPlayCount);
    setTrackPlayCount(prev => prev + 1);  // Increment play count for DJ trigger

    if (useSpotify && track.spotifyUrl) {
      // Extract track URI from spotifyUrl or use the track ID
      const spotifyUri = `spotify:track:${track.id}`;
      spotifyPlayer.play(spotifyUri);
      setSpotifyTrackIndex(index);  // Keep index in sync
    } else {
      fallbackPlayer.playAtIndex(index);
    }
  };

  // Playback controls
  const handlePlay = () => {
    if (useSpotify) {
      spotifyPlayer.resume();
    } else {
      fallbackPlayer.play();
    }
  };

  const handlePause = () => {
    if (useSpotify) {
      spotifyPlayer.pause();
    } else {
      fallbackPlayer.pause();
    }
  };

  const handleNext = () => {
    console.log('[Page] handleNext called, useSpotify:', useSpotify, 'trackPlayCount:', trackPlayCount);
    setTrackPlayCount(prev => prev + 1);

    if (useSpotify) {
      const nextIndex = spotifyTrackIndex + 1;
      if (nextIndex < tracks.length) {
        const nextTrack = tracks[nextIndex];
        console.log('[Page] Playing next Spotify track:', nextTrack.title);
        spotifyPlayer.play(`spotify:track:${nextTrack.id}`);
        setSpotifyTrackIndex(nextIndex);
      } else {
        console.log('[Page] No more tracks');
      }
    } else {
      console.log('[Page] Using fallback player');
      fallbackPlayer.next();
    }
  };

  const handlePrevious = () => {
    if (useSpotify) {
      const prevIndex = spotifyTrackIndex - 1;
      if (prevIndex >= 0) {
        const prevTrack = tracks[prevIndex];
        console.log('[Page] Playing previous Spotify track:', prevTrack.title);
        spotifyPlayer.play(`spotify:track:${prevTrack.id}`);
        setSpotifyTrackIndex(prevIndex);
      } else {
        console.log('[Page] Already at first track');
      }
    } else {
      fallbackPlayer.previous();
    }
  };

  const handleSeek = (time: number) => {
    if (useSpotify) {
      spotifyPlayer.seek(time);
    } else {
      fallbackPlayer.seek(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (useSpotify) {
      spotifyPlayer.setVolume(newVolume);
    } else {
      fallbackPlayer.setVolume(newVolume);
    }
  };

  return (
    <Layout
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
      currentIndex={fallbackPlayer.currentIndex}
      queueLength={fallbackPlayer.queue.length}
      onPlay={handlePlay}
      onPause={handlePause}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onVolumeChange={handleVolumeChange}
      onSeek={handleSeek}
      djStatus={djStatus}
      isDJPlaying={isDJPlaying}
      isAuthenticated={spotifyPlayer.isAuthenticated}
      onLogin={spotifyPlayer.login}
      onLogout={spotifyPlayer.logout}
    >
      <MainContent
        tracks={tracks}
        currentTrackId={currentTrack?.id || null}
        isPlaying={isPlaying}
        onTrackSelect={handleTrackSelect}
        djStatus={tracksLoading ? 'generating' : djStatus}
      />
    </Layout>
  );
}
