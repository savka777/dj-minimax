## DJ Minimax

An AI radio DJ experience that:
- pulls real tracks from Spotify based on your taste
- generates a DJ intro + an AI-composed song + an outro via MiniMax
- injects the AI audio into the listening queue

Built with Next.js (App Router), TypeScript, Tailwind, and a dual-player approach:
- **Spotify Web Playback SDK** for authenticated Spotify Premium users
- **Howler.js fallback player** for AI audio (and for non-authenticated users)

## Quickstart

### Prerequisites

- Node.js 20+ recommended
- A MiniMax API key
- A Spotify developer app (Client ID + Client Secret)

### Install

```bash
npm install
```

### Configure environment

Create `.env.local` in the project root:

```bash
MINIMAX_API_KEY=your_minimax_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Run locally

```bash
npm run dev
```

Then open `http://127.0.0.1:3000`.

## Spotify setup notes

### Redirect URI (local dev)

This project currently uses a **hard-coded** Spotify OAuth redirect URI:

- `http://127.0.0.1:3000/api/auth/callback/spotify`

Add that exact URL to your Spotify app’s Redirect URIs in the Spotify Developer Dashboard.

### Premium requirement (Web Playback SDK)

Spotify’s Web Playback SDK typically requires a **Spotify Premium** account to control playback in-browser. The app will still work in fallback mode for the AI-generated DJ segments.

## How it works (high level)

### Core flow

- The UI fetches tracks via `src/hooks/useSpotifyTracks.ts` (server route: `GET /api/spotify/tracks`)
- Around track index ~2, `src/hooks/useDJGeneration.ts` kicks off generation via `POST /api/generate`
- The generation pipeline (`src/lib/pipeline/generate.ts`) does:
  - **MiniMax M2**: generate a structured DJ script (intro, song title/style/lyrics, outro)
  - **Parallel**:
    - **MiniMax Speech**: TTS for intro/outro (`speech-2.8-hd`)
    - **MiniMax Music**: AI song generation + polling (`music-2.5`)
  - Assemble the three audio items into a playable queue
- The client injects the DJ items into the queue and plays them with the fallback player (Howler)

### Experience lifecycle

- `POST /api/generate` returns an `experienceId` (202 Accepted)
- `GET /api/experience/[id]` polls status/progress until the experience is ready

Important: experiences are stored in an **in-memory Map** in `src/lib/pipeline/generate.ts`. Restarting the server will lose existing experiences.

## API routes

### Generation

- `POST /api/generate`: start a new experience
- `GET /api/experience/[id]`: poll generation status + results (queue)

### Spotify

- `GET /api/spotify/search?q=...&limit=...`: search tracks
- `GET /api/spotify/tracks?artists=a,b,c&limit=3`: fetch tracks by artist names

### Auth (Spotify OAuth for playback)

- `GET /api/auth/spotify`: redirects to Spotify authorize
- `GET /api/auth/callback/spotify`: exchanges code for tokens, stores HTTP-only cookies
- `GET /api/auth/token`: returns current access token (for the Web Playback SDK)
- `POST /api/auth/token`: refreshes access token using refresh token
- `POST /api/auth/logout`: clears auth cookies

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production server
npm run lint    # eslint
```

## Troubleshooting

### “Missing Spotify credentials”

Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`.

### OAuth redirect mismatch

Make sure your Spotify app redirect URI includes:
- `http://127.0.0.1:3000/api/auth/callback/spotify`

### MiniMax errors

Set `MINIMAX_API_KEY` in `.env.local`, and verify the key has access to:
- chat completions (`MiniMax-M2`)
- TTS (`speech-2.8-hd`)
- music generation (`music-2.5`)
