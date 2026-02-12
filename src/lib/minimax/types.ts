// MiniMax API Types

// ============================================
// M2.1 Text Generation (Chat Completions)
// ============================================

export interface M2Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface M2Request {
  model: 'MiniMax-M2' | 'MiniMax-M2.1';
  messages: M2Message[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface M2Choice {
  index: number;
  message: M2Message;
  finish_reason: string;
}

export interface M2Response {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: M2Choice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DJScriptOutput {
  dj_intro: string;
  song_style: string;
  song_lyrics: string;
  song_title: string;
  dj_outro: string;
}

// ============================================
// Music 2.5 Generation
// ============================================

export interface MusicGenerationRequest {
  model: 'music-2.5';
  lyrics: string;
  prompt: string;
}

export interface MusicGenerationResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  audio_url?: string;
  duration?: number;
  error?: string;
}

export interface MusicStatusResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  audio_url?: string;
  duration?: number;
  error?: string;
}

// Structural tags for lyrics
export type MusicStructuralTag =
  | '[Intro]'
  | '[Verse]'
  | '[Pre Chorus]'
  | '[Chorus]'
  | '[Interlude]'
  | '[Bridge]'
  | '[Outro]'
  | '[Hook]'
  | '[Build Up]'
  | '[Solo]'
  | '[Inst]';

// ============================================
// Speech 2.8 TTS
// ============================================

export interface SpeechVoiceSetting {
  voice_id: string;
  speed?: number;
  vol?: number;
  pitch?: number;
}

export interface SpeechAudioSetting {
  format?: 'mp3' | 'wav' | 'pcm' | 'flac';
  sample_rate?: 44100 | 32000 | 24000 | 22050 | 16000;
}

export interface SpeechRequest {
  model: 'speech-2.8-hd';
  text: string;
  voice_setting: SpeechVoiceSetting;
  audio_setting?: SpeechAudioSetting;
}

export interface SpeechResponse {
  audio_url?: string;
  audio_data?: string; // base64 encoded audio
  duration?: number;
  error?: string;
}

// ============================================
// Common Types
// ============================================

export interface MiniMaxError {
  code: string;
  message: string;
}

export interface MiniMaxErrorResponse {
  error: MiniMaxError;
}

// Voice presets for DJ
export const DJ_VOICE_PRESETS = {
  male_energetic: {
    voice_id: 'male-qn-qingse',
    speed: 1.0,
    vol: 1.0,
    pitch: 0,
  },
  male_calm: {
    voice_id: 'male-qn-jingying',
    speed: 0.9,
    vol: 1.0,
    pitch: 0,
  },
  female_energetic: {
    voice_id: 'female-shaonv',
    speed: 1.0,
    vol: 1.0,
    pitch: 0,
  },
} as const;

export type DJVoicePreset = keyof typeof DJ_VOICE_PRESETS;
