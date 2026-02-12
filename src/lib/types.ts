export interface QueueItem {
  id: string;
  type: 'spotify_track' | 'dj_intro' | 'ai_song' | 'dj_outro';
  audioUrl: string;
  metadata: {
    title: string;
    artist?: string;
    albumArt?: string;
    djText?: string;
    isAiGenerated?: boolean;
  };
  duration: number;
}

export interface Experience {
  id: string;
  status: 'generating' | 'ready' | 'error';
  progress?: { step: string; percent: number };
  queue?: QueueItem[];
  djIntroText?: string;
  djOutroText?: string;
  aiSongTitle?: string;
  context?: { artists: string[]; genres: string[]; mood: string };
  error?: string;
}

export interface GenerateRequest {
  artists: string[];
  genres?: string[];
  mood?: string;
}

export interface GenerateResponse {
  experienceId: string;
}
