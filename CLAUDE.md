# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

**Requirements**: Node.js 20+

## Environment Variables

Required in `.env.local`:
- `MINIMAX_API_KEY` - MiniMax API key for AI generation
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify app client secret

Spotify OAuth redirect URI (must be added to Spotify Developer Dashboard):
- `http://127.0.0.1:3000/api/auth/callback/spotify`

## Architecture

DJ Minimax is an AI radio DJ experience that generates personalized DJ intros, AI-composed songs, and outros based on user's music preferences. It integrates with Spotify for track playback and MiniMax APIs for AI content generation.

### Core Flow

1. **Track Selection**: Users see Spotify tracks fetched via `useSpotifyTracks` hook
2. **DJ Trigger**: When user reaches track index 4-5 (tracks 5-6), `useDJGeneration` hook initiates AI content generation
3. **Pipeline Execution** (`src/lib/pipeline/generate.ts`):
   - MiniMax M2 generates DJ script (intro text, song lyrics/style, outro text)
   - Parallel generation: DJ speech audio + AI song
   - Results assembled into queue items
4. **Playback**: Content injected into queue via `useAudioPlayer` or played through Spotify Web Playback SDK

### MiniMax API Integration (`src/lib/minimax/`)

- `m2.ts` - Text generation for DJ scripts using MiniMax-M2 chat completions
- `music.ts` - Music generation using music-2.5 (async polling pattern)
- `speech.ts` - TTS for DJ voice using speech-2.8-hd
- `types.ts` - All MiniMax API types and DJ voice presets

### Dual Audio Playback

- **Spotify Player** (`useSpotifyPlayer`): OAuth flow + Web Playback SDK for premium users
- **Fallback Player** (`useAudioPlayer`): Howler.js-based for AI content and non-authenticated users

### API Routes

- `POST /api/generate` - Start DJ experience generation (returns experienceId)
- `GET /api/experience/[id]` - Poll for generation status/results
- `/api/spotify/*` - Spotify track search and auth endpoints
- `/api/auth/*` - Spotify OAuth flow

### State Management

- Zustand not currently used despite being installed
- Experience state stored in-memory Map (`src/lib/pipeline/generate.ts`) - restarting server loses existing experiences
- Client state managed through React hooks

### Demo Mode

The `useDJGeneration` hook currently uses hardcoded DJ content from `/public/dj/` (intro.mp3, song.mp3, outro.mp3) instead of calling the generation API. This allows testing playback without MiniMax API calls.

### Key Types (`src/lib/types.ts`)

- `QueueItem` - Unified type for all playable items with `type: 'spotify_track' | 'dj_intro' | 'ai_song' | 'dj_outro'`
- `Experience` - Server-side generation state with status, progress, and resulting queue

### Path Alias

`@/*` maps to `./src/*`
