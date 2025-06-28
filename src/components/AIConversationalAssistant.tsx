import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Mic, MicOff, Send, Volume2, StopCircle, Play, Pause, Settings, Loader2 } from 'lucide-react';
import { UserProfileData } from '../types';
import { SpeechRecognition, SpeechRecognitionConstructor } from '../types/speechRecognition';
import { businessModules } from '../data/modules';
import { 
  generateSpeech, 
  isElevenLabsConfigured, 
  ELEVENLABS_CONFIG, 
  type SupportedLanguage 
} from '../config/elevenlabs';
import { isGeminiAvailable } from '../config/gemini';
import { generateAIResponse } from '../services/aiConversationService';
import { useLanguage } from '../config/language';

interface AIConversationalAssistantProps {
  user: User;
  userProfile: UserProfileData;
  isDarkMode: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIConversationalAssistant: React.FC<AIConversationalAssistantProps> = ({
  user,
  userProfile,
  isDarkMode,
}) => {
  // Estado para la conversación
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estado para el reconocimiento de voz
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Estado para ElevenLabs
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(ELEVENLABS_CONFIG.defaultVoiceIndex);
  
  // Language context
  const { language, t, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  
  // Referencias para el manejo del scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Verificar si ElevenLabs está configurado
  useEffect(() => {
    setIsVoiceEnabled(isElevenLabsConfigured());
  }, []);
  
  // Sync the selected language with the app language
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);
  
  // Verificar si el reconocimiento de voz está disponible
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setRecognitionSupported(true);
    }
  }, []);
  
  // Limpiar recursos de audio al desmontar
  useEffect(() => {
    const cleanupAudioResources = () => {
      if (audioElement) {
        audioElement.oncanplaythrough = null;
        audioElement.onerror = null;
        audioElement.onended = null;
        audioElement.pause();
        audioElement.src = '';
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    
    return cleanupAudioResources;
  }, [audioElement, audioUrl]);
  
  // Auto-scroll inteligente cuando se agregan nuevos mensajes
  useEffect(() => {
    const scrollToBottom = () => {
      if (!messagesContainerRef.current || !messagesEndRef.current) return;
      
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Solo hacer scroll si el usuario está cerca del final o si es el primer mensaje
      if (isNearBottom || messages.length <= 1) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    };

    // Usar setTimeout para evitar múltiples scrolls rápidos
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages]);
  
  // Mensaje inicial de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = t('assistant', 'welcomeMessage')
        .replace('{name}', user.email?.split('@')[0] || 'user')
        .replace('{businessType}', userProfile.businessType);
      
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
      
      // Reproducir mensaje de bienvenida si la voz está habilitada
      if (isVoiceEnabled) {
        generateVoiceResponse(welcomeMessage);
      }
    }
  }, []);
  
  // Función para iniciar/detener reconocimiento de voz
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        throw new Error(t('assistant', 'speechRecognitionNotAvailable'));
      }
      const recognition = new SpeechRecognitionAPI();
      
      recognition.lang = selectedLanguage === 'es' ? 'es-ES' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error(t('assistant', 'voiceRecognitionError') + ':', event.error);
        setIsListening(false);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (error) {
      console.error(t('assistant', 'voiceRecognitionStartError') + ':', error);
      setRecognitionSupported(false);
    }
  };
  
  // Función para limpiar texto para síntesis de voz
  const cleanTextForVoice = (text: string): string => {
    return text
      // Remover markdown (asteriscos, guiones bajos, etc.)
      .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** -> bold
      .replace(/\*(.*?)\*/g, '$1')     // *italic* -> italic
      .replace(/__(.*?)__/g, '$1')     // __underline__ -> underline
      .replace(/_(.*?)_/g, '$1')       // _italic_ -> italic
      // Remover emojis de números
      .replace(/[0-9]️⃣/g, '')
      // Limpiar caracteres especiales que no se leen bien
      .replace(/[#`]/g, '')
      // Reemplazar guiones largos con pausas
      .replace(/---+/g, '. ')
      // Normalizar espacios múltiples
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Función para generar respuesta de voz con ElevenLabs
  const generateVoiceResponse = async (text: string) => {
    if (!isVoiceEnabled || isGeneratingAudio) return;
    
    setIsGeneratingAudio(true);
    
    try {
      // Limpiar el texto para síntesis de voz
      const cleanedText = cleanTextForVoice(text);
      
      // Verificar que el texto no esté vacío
      if (!cleanedText || cleanedText.trim().length === 0) {
        throw new Error('El texto para generar voz está vacío');
      }
      
      // Generar audio con ElevenLabs usando el texto limpio
      const audioBlob = await generateSpeech(
        cleanedText,
        selectedLanguage,
        selectedVoiceIndex,
        {
          ...ELEVENLABS_CONFIG.defaultVoiceSettings,
          stability: 0.6,
          similarity_boost: 0.7
        }
      );
      
      // Verificar que el blob de audio sea válido
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('El servidor devolvió un blob de audio vacío o inválido');
      }
      
      // Crear un nuevo blob con el tipo MIME correcto explícito
      const safeBlob = new Blob([await audioBlob.arrayBuffer()], { 
        type: audioBlob.type || 'audio/mpeg' 
      });
      
      // Crear URL del blob
      const audioUrl = URL.createObjectURL(safeBlob);
      setAudioUrl(audioUrl);
      
      // Crear un nuevo elemento de audio
      const audio = new Audio();
      
      // Configurar opciones importantes
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      
      // Configurar manejadores de eventos antes de asignar src
      audio.onerror = () => {
        // Limpiar recursos en caso de error
        setIsPlaying(false);
        setIsGeneratingAudio(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      // Asignar el src al audio y esperar a que se cargue
      audio.src = audioUrl;
      
      // Guardar referencia al elemento de audio
      setAudioElement(audio);
      
      // Esperar a que el audio esté listo para reproducir
      audio.oncanplaythrough = () => {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((playError) => {
            console.error('Error al iniciar reproducción:', playError);
            setIsPlaying(false);
          });
      };
      
    } catch (error) {
      console.error(t('assistant', 'elevenLabsError') + ':', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  // Función para detener/reanudar la reproducción de audio
  const toggleAudioPlayback = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error al reanudar audio:', error));
    }
  };
  
  // Función para procesar la entrada del usuario y obtener respuesta de Gemini
  const processUserInput = async () => {
    if (!inputText.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    
    try {
      // Preparar el historial de conversación para el servicio
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Preparar el contexto del usuario
      const context = {
        userProfile,
        userEmail: user.email || '',
        userName: user.email?.split('@')[0] || 'usuario'
      };
      
      // Obtener respuesta del servicio de IA
      const assistantResponse = await generateAIResponse(
        inputText,
        conversationHistory,
        context,
        selectedLanguage
      );
      
      // Crear mensaje con la respuesta
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Generar respuesta de voz si está habilitado
      if (isVoiceEnabled) {
        generateVoiceResponse(assistantResponse);
      }
      
    } catch (error) {
      console.error(t('assistant', 'responseProcessingError') + ':', error);
      
      // Mensaje de error como respuesta del asistente
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('assistant', 'errorProcessing'),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processUserInput();
  };
  
  // Cambiar idioma
  const handleLanguageChange = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    setLanguage(language);
    setSelectedVoiceIndex(0);
    
    // Detener audio actual si existe
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setIsPlaying(false);
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setAudioElement(null);
  };
  
  // Cambiar voz
  const handleVoiceChange = (voiceIndex: number) => {
    setSelectedVoiceIndex(voiceIndex);
    
    // Detener audio actual si existe
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setIsPlaying(false);
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setAudioElement(null);
  };
  
  return (
    <div className="flex flex-col h-full max-h-[600px] rounded-xl overflow-hidden border"
      style={{ 
        background: 'var(--card-bg)',
        borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.3)' : 'rgba(148, 163, 184, 0.3)'
      }}
    >
      {/* Cabecera */}
      <div className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.2)' : 'rgba(148, 163, 184, 0.2)' }}
      >
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-gradient-to-r from-iridescent-blue to-iridescent-violet mr-3">
            <Volume2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('welcome', 'conversationalAssistant')}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {isVoiceEnabled ? t('welcome', 'fullyFunctional') : t('welcome', 'notConfigured')} • {isGeminiAvailable ? t('assistant', 'geminiActive') : t('assistant', 'basicMode')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Configuración de idioma */}
          <div className="relative group">
            <button 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={t('common', 'language')}
            >
              <Settings className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 hidden group-hover:block z-10">
              <div className="mb-3">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('common', 'language')}:</p>
                <div className="flex space-x-2">
                  {Object.entries(ELEVENLABS_CONFIG.languages).map(([langCode, langConfig]) => (
                    <button
                      key={langCode}
                      onClick={() => handleLanguageChange(langCode as SupportedLanguage)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        selectedLanguage === langCode
                          ? 'bg-iridescent-blue text-white'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {langConfig.flag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('welcome', 'voice')}:</p>
                <div className="flex space-x-2">
                  {[0, 1, 2].map((voiceIndex) => (
                    <button
                      key={voiceIndex}
                      onClick={() => handleVoiceChange(voiceIndex)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        selectedVoiceIndex === voiceIndex
                          ? 'bg-iridescent-violet text-white'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {voiceIndex + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Control de audio */}
          {isVoiceEnabled && (isPlaying || isGeneratingAudio) && (
            <button
              onClick={toggleAudioPlayback}
              disabled={isGeneratingAudio}
              className={`p-2 rounded-full transition-colors ${
                isGeneratingAudio 
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={isPlaying ? t('welcome', 'pause') : t('welcome', 'play')}
            >
              {isGeneratingAudio ? (
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--text-secondary)' }} />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <Play className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4" 
        style={{ background: isDarkMode ? 'rgba(26, 29, 41, 0.3)' : 'rgba(241, 245, 249, 0.3)' }}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet text-white' 
                  : isDarkMode 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-800'
              } shadow-sm`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de entrada */}
      <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2"
        style={{ borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.2)' : 'rgba(148, 163, 184, 0.2)' }}
      >
        {/* Botón de micrófono */}
        {recognitionSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isListening ? t('assistant', 'stopRecording') : t('assistant', 'recordVoice')}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
        
        {/* Campo de entrada de texto */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('assistant', 'placeholder')}
          className="flex-1 p-2 rounded-lg outline-none"
          style={{ 
            background: isDarkMode ? 'rgba(30, 33, 57, 0.8)' : 'white',
            color: 'var(--text-primary)',
            border: `1px solid ${isDarkMode ? 'rgba(0, 212, 255, 0.2)' : 'rgba(148, 163, 184, 0.3)'}`
          }}
          disabled={isProcessing}
        />
        
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className={`p-2 rounded-full ${
            !inputText.trim() || isProcessing
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-violet hover:to-iridescent-cyan text-white'
          }`}
          title={t('assistant', 'send')}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default AIConversationalAssistant; 