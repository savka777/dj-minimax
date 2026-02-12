import {
  SpeechRequest,
  SpeechResponse,
  SpeechVoiceSetting,
  SpeechAudioSetting,
  DJ_VOICE_PRESETS,
  DJVoicePreset,
  MiniMaxErrorResponse,
} from './types';

const SPEECH_API_URL = 'https://api.minimax.io/v1/t2a_v2';

function getApiKey(): string {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY environment variable is not set');
  }
  return apiKey;
}

export async function generateSpeech(
  text: string,
  voiceSetting: SpeechVoiceSetting,
  audioSetting?: SpeechAudioSetting
): Promise<SpeechResponse> {
  const apiKey = getApiKey();

  const request: SpeechRequest = {
    model: 'speech-2.8-hd',
    text,
    voice_setting: voiceSetting,
    audio_setting: audioSetting ?? {
      format: 'mp3',
      sample_rate: 44100,
    },
  };

  const response = await fetch(SPEECH_API_URL, {
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
      `MiniMax Speech API error: ${errorData.error?.message || response.statusText}`
    );
  }

  return response.json() as Promise<SpeechResponse>;
}

export async function generateDJAudio(
  text: string,
  voicePreset: DJVoicePreset = 'male_energetic'
): Promise<SpeechResponse> {
  const voiceSetting = DJ_VOICE_PRESETS[voicePreset];

  return generateSpeech(
    text,
    {
      voice_id: voiceSetting.voice_id,
      speed: voiceSetting.speed,
      vol: voiceSetting.vol,
      pitch: voiceSetting.pitch,
    },
    {
      format: 'mp3',
      sample_rate: 44100,
    }
  );
}

export { DJ_VOICE_PRESETS, type DJVoicePreset };
