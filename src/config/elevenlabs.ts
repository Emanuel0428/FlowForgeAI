// Supported languages
export type SupportedLanguage = 'en' | 'es';

// Language configuration interface
interface LanguageConfig {
  voices: {
    voice1: string;
    voice2: string;
    voice3: string;
  };
  model: string;
  name: string;
  flag: string;
}

// ElevenLabs API Configuration
export const ELEVENLABS_CONFIG = {
  // Base URL for ElevenLabs API
  baseUrl: 'https://api.elevenlabs.io/v1',
  
  // Default voice settings
  defaultVoiceSettings: {
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true
  },
  
  // Language-specific configuration
  languages: {
    en: {
      voices: {
        voice1: 'sfJopaWaOtauCD3HKX6Q',  // English voice 1
        voice2: 'QCOsaFukRxK1IUh7WVlM',  // English voice 2
        voice3: 'UGTtbzgh3HObxRjWaSpr',  // English voice 3
      },
      model: 'eleven_turbo_v2',
      name: 'English',
      flag: '🇺🇸'
    } as LanguageConfig,
    es: {
      voices: {
        voice1: 'J2Jb9yZNvpXUNAL3a2bw',  // Spanish voice 1
        voice2: '57D8YIbQSuE3REDPO6Vm',  // Spanish voice 2
        voice3: 'UgBBYS2sOqTuMpoF3BR0',  // Spanish voice 3
      },
      model: 'eleven_turbo_v2_5',
      name: 'Español',
      flag: '🇪🇸'
    } as LanguageConfig
  },
  
  // Default language
  defaultLanguage: 'es' as SupportedLanguage,
  
  // Default voice index (0-2 for voice1, voice2, voice3)
  defaultVoiceIndex: 0,
  
  // Legacy voices (kept for backwards compatibility)
  legacyVoices: {
    adam: 'pNInz6obpgDQGcFmaJgB',
    bella: 'EXAVITQu4vr4xnSDxMaL',
    antoni: 'ErXwobaYiN019PkySvjV',
    elli: 'MF3mGyEYCl7XYWbV9V6O',
    josh: 'TxGEqnHWrfWFTfGW9XjX',
    arnold: '3TF6kpgajhHjhqD6Sjcb',
    domi: 'AZnzlk1XvdvUeBnXmlld',
    freya: 'jsCqWAovK2LkecY7zXl4',
    grace: 'oWAxZDx7w5VEj9dCyTzz',
    daniel: 'onwK4e9ZLuTAKqWW03F9',
  }
};

// Get voice ID by language and voice index
export const getVoiceId = (language: SupportedLanguage = ELEVENLABS_CONFIG.defaultLanguage, voiceIndex: number = ELEVENLABS_CONFIG.defaultVoiceIndex): string => {
  const langConfig = ELEVENLABS_CONFIG.languages[language];
  const voiceKeys = Object.keys(langConfig.voices) as Array<keyof typeof langConfig.voices>;
  const selectedVoiceKey = voiceKeys[voiceIndex] || voiceKeys[0];
  return langConfig.voices[selectedVoiceKey];
};

// Get model by language
export const getModelByLanguage = (language: SupportedLanguage = ELEVENLABS_CONFIG.defaultLanguage): string => {
  return ELEVENLABS_CONFIG.languages[language].model;
};

// Get welcome message by language
export const getWelcomeMessage = (language: SupportedLanguage, greeting: string, userName: string): string => {
  const messages = {
    en: `${greeting}! I'm your FlowForge AI assistant. I help you transform data into strategic decisions with artificial intelligence. How can I assist you today?`,
    es: `¡${greeting}! Soy tu asistente de FlowForge AI. Te ayudo a transformar datos en decisiones estratégicas con inteligencia artificial. ¿En qué puedo asistirte hoy?`
  };
  
  return messages[language];
};

// Voice generation function with language support
export const generateSpeech = async (
  text: string, 
  language: SupportedLanguage = ELEVENLABS_CONFIG.defaultLanguage,
  voiceIndex: number = ELEVENLABS_CONFIG.defaultVoiceIndex,
  voiceSettings = ELEVENLABS_CONFIG.defaultVoiceSettings
) => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY in your .env file.');
  }

  const voiceId = getVoiceId(language, voiceIndex);
  const model = getModelByLanguage(language);

  const response = await fetch(`${ELEVENLABS_CONFIG.baseUrl}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: voiceSettings,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return response.blob();
};

// Helper function to check if ElevenLabs is configured
export const isElevenLabsConfigured = (): boolean => {
  return !!import.meta.env.VITE_ELEVENLABS_API_KEY;
};
