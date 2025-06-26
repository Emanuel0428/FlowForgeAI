import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Mic,
  Volume2,
  Play,
  Pause,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Settings,
  Circle,
  Globe
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { UserProfileData } from '../types';
import { businessModules } from '../data/modules';
import { 
  generateSpeech, 
  isElevenLabsConfigured, 
  ELEVENLABS_CONFIG, 
  getWelcomeMessage,
  type SupportedLanguage 
} from '../config/elevenlabs';
import AIConversationalAssistant from './AIConversationalAssistant';
import { useLanguage } from '../config/language';

interface WelcomeDashboardProps {
  user: User;
  userProfile: UserProfileData;
  isDarkMode: boolean;
  onGetStarted: () => void;
  onModuleSelect: (moduleId: string) => void;
}

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  user,
  userProfile,
  isDarkMode,
  onGetStarted,
  onModuleSelect,
}) => {  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [voicePreview, setVoicePreview] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(ELEVENLABS_CONFIG.defaultLanguage);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(ELEVENLABS_CONFIG.defaultVoiceIndex);
  const [showConversationalAssistant, setShowConversationalAssistant] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    setIsVoiceEnabled(isElevenLabsConfigured());
  }, []);

  // Sync the selected language with the app language
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Efecto para limpiar recursos de audio al desmontar o cuando cambian
  useEffect(() => {
    // Función para limpiar recursos de audio
    const cleanupAudioResources = () => {
      if (audioElement) {
        // Detener reproducción y eliminar listeners
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
    
    // Limpiar al desmontar o cuando cambian las dependencias
    return cleanupAudioResources;
  }, [audioElement, audioUrl]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('welcome', 'goodMorning');
    if (hour < 18) return t('welcome', 'goodAfternoon');
    return t('welcome', 'goodEvening');
  };

  const stats = [
    {
      icon: Target,
      label: t('welcome', 'availableAnalyses'),
      value: businessModules.length,
      color: 'from-iridescent-blue to-iridescent-cyan',
      description: t('welcome', 'specializedModules')
    },
    {
      icon: TrendingUp,
      label: t('welcome', 'aiAccuracy'),
      value: '98%',
      color: 'from-iridescent-violet to-iridescent-blue',
      description: t('welcome', 'accurateAnalysis')
    },
    {
      icon: Users,
      label: t('welcome', 'companiesBenefited'),
      value: '10K+',
      color: 'from-iridescent-cyan to-iridescent-violet',
      description: t('welcome', 'successCases')
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: t('welcome', 'intelligentAnalysis'),
      description: t('welcome', 'getDeepInsights'),
      color: 'text-iridescent-blue'
    },
    {
      icon: Lightbulb,
      title: t('welcome', 'personalizedRecommendations'),
      description: t('welcome', 'strategiesAdapted'),
      color: 'text-iridescent-violet'
    },
    {
      icon: MessageSquare,
      title: t('welcome', 'detailedReports'),
      description: t('welcome', 'completeDocumentation'),
      color: 'text-iridescent-cyan'
    }  
  ];  
    // Función para generar audio con ElevenLabs
  const generateVoiceMessage = async () => {
    if (!isVoiceEnabled || isGeneratingAudio) return;

    setIsGeneratingAudio(true);
    
    try {
      // Generar mensaje de bienvenida en el idioma seleccionado
      const welcomeMessage = getWelcomeMessage(
        selectedLanguage, 
        getGreeting(), 
        user.email?.split('@')[0] || 'usuario'
      );

      // Usar la nueva API con idioma y voz seleccionados
      const audioBlob = await generateSpeech(
        welcomeMessage, 
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
        setVoicePreview(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setVoicePreview(false);
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
            setVoicePreview(true);
          })
          .catch((playError) => {
            console.error('Error al iniciar reproducción:', playError);
            setIsPlaying(false);
            setVoicePreview(false);
          });
      };
      
    } catch (error) {
      console.error('Error con ElevenLabs:', error);
      alert('Error al generar el audio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const toggleVoicePreview = () => {
    if (!isVoiceEnabled) {
      alert('API key de ElevenLabs no configurada');
      return;
    }

    if (voicePreview && audioElement) {
      // Pausar audio
      audioElement.pause();
      setIsPlaying(false);
      setVoicePreview(false);
    } else {
      // Siempre generar nuevo audio para evitar problemas de recursos
      // Limpiar recursos anteriores primero
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      
      setAudioElement(null);
      
      // Generar nuevo audio
      generateVoiceMessage();
    }
  };

  // Función para cambiar idioma y regenerar audio
  const handleLanguageChange = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    setSelectedVoiceIndex(0); 
    
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      setVoicePreview(false);
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  // Función para cambiar voz dentro del mismo idioma
  const handleVoiceChange = (voiceIndex: number) => {
    setSelectedVoiceIndex(voiceIndex);
    
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      setVoicePreview(false);
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  // Función para alternar entre el asistente conversacional y el panel de bienvenida
  const toggleConversationalAssistant = () => {
    setShowConversationalAssistant(prev => !prev);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || Circle;
    return Icon;
  };
  
  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8 lg:mb-12">
        <div className="p-4 lg:p-6 rounded-3xl bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow-hover organic-shape mb-6 lg:mb-8 mx-auto w-fit">
          <Brain className="h-16 lg:h-20 w-16 lg:w-20 text-white" />
        </div>
        
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 iridescent-text">
          {getGreeting()}, {user.email?.split('@')[0]}
        </h1>
        
        <p className="text-base lg:text-lg xl:text-xl mb-6 leading-relaxed max-w-3xl mx-auto px-4" style={{ color: 'var(--text-secondary)' }}>
          {t('welcome', 'welcomeTo')} <span className="iridescent-text font-semibold">FlowForge AI</span>,
          <br />
          {t('welcome', 'transformData')}
        </p>          
        
        {/* Asistente Conversacional o Asistente de Voz */}
        <div className="max-w-2xl mx-auto mb-6 lg:mb-8 px-4">
          <div 
            className="liquid-card p-4 lg:p-6 border relative overflow-hidden"
            style={{ 
              background: 'var(--card-bg)',
              borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.3)' : 'rgba(148, 163, 184, 0.3)'
            }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
              isVoiceEnabled 
                ? 'from-iridescent-violet to-iridescent-cyan' 
                : 'from-gray-400 to-gray-500'
            }`}></div>
            
            {/* Botones para alternar entre asistentes */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
                <button
                  onClick={() => setShowConversationalAssistant(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    !showConversationalAssistant 
                      ? 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {t('welcome', 'voiceAssistantButton')}
                </button>
                <button
                  onClick={() => setShowConversationalAssistant(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    showConversationalAssistant 
                      ? 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {t('welcome', 'conversationalAssistant')}
                </button>
              </div>
            </div>
            
            {showConversationalAssistant ? (
              // Mostrar el asistente conversacional
              <div className="h-[400px]">
                <AIConversationalAssistant 
                  user={user}
                  userProfile={userProfile}
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : (
              // Mostrar el asistente de voz original
              <>
                <div className="flex items-center justify-center mb-3 lg:mb-4">
                  <div className={`p-2 lg:p-3 rounded-xl mr-3 ${
                    isVoiceEnabled 
                      ? 'bg-gradient-to-br from-iridescent-violet/30 to-iridescent-cyan/30' 
                      : 'bg-gray-500/30'
                  }`}>
                    <Volume2 className={`h-5 lg:h-6 w-5 lg:w-6 ${
                      isVoiceEnabled ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {isVoiceEnabled ? t('welcome', 'voiceAssistant') : t('welcome', 'notConfigured')}
                  </h3>
                </div>
                  <p className="text-xs lg:text-sm mb-3 lg:mb-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  {isVoiceEnabled 
                    ? t('welcome', 'interactWithVoice')
                    : t('welcome', 'configureApiKey')
                  }
                  <br />
                  <em>{isVoiceEnabled ? t('welcome', 'fullyFunctional') : t('welcome', 'addApiKey')}</em>
                </p>
                
                {/* Language and Voice Selection */}
                {isVoiceEnabled && (
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-iridescent-blue/5 to-iridescent-violet/5 border border-iridescent-blue/20">
                    <div className="flex flex-col space-y-3">
                      {/* Language Selection */}
                      <div className="flex items-center justify-center space-x-3">
                        <Globe className="w-4 h-4 text-iridescent-blue" />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t('common', 'language')}:</span>
                        <div className="flex space-x-2">
                          {Object.entries(ELEVENLABS_CONFIG.languages).map(([langCode, langConfig]) => (
                            <button
                              key={langCode}
                              onClick={() => handleLanguageChange(langCode as SupportedLanguage)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                selectedLanguage === langCode
                                  ? 'bg-iridescent-blue text-white shadow-md'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              {langConfig.flag} {langConfig.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Voice Selection */}
                      <div className="flex items-center justify-center space-x-3">
                        <Mic className="w-4 h-4 text-iridescent-violet" />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t('welcome', 'voice')}:</span>
                        <div className="flex space-x-2">
                          {[0, 1, 2].map((voiceIndex) => (
                            <button
                              key={voiceIndex}
                              onClick={() => handleVoiceChange(voiceIndex)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                selectedVoiceIndex === voiceIndex
                                  ? 'bg-iridescent-violet text-white shadow-md'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                              }`}
                              title={`${t('welcome', 'voice')} ${voiceIndex + 1} ${t('common', 'in')} ${ELEVENLABS_CONFIG.languages[selectedLanguage].name}`}
                            >
                              {t('welcome', 'voice')} {voiceIndex + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={toggleVoicePreview}
                    disabled={!isVoiceEnabled || isGeneratingAudio}
                    className={`flex items-center px-3 lg:px-4 py-2 rounded-xl text-white text-sm transition-all duration-300 ${
                      isVoiceEnabled && !isGeneratingAudio
                        ? 'bg-gradient-to-r from-iridescent-violet to-iridescent-cyan hover:from-iridescent-blue hover:to-iridescent-violet transform hover:scale-105 cursor-pointer'
                        : 'bg-gray-500/50 opacity-70 cursor-not-allowed'
                    }`}
                    title={isVoiceEnabled ? 'Escucha el mensaje de bienvenida' : 'Configura ElevenLabs API'}
                  >
                    {isGeneratingAudio ? (
                      <>
                        <div className="w-3 lg:w-4 h-3 lg:h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        {isPlaying ? <Pause className="w-3 lg:w-4 h-3 lg:h-4 mr-2" /> : <Play className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />}
                        {isPlaying ? 'Pausar' : 'Escuchar'}
                      </>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <Mic className={`w-3 lg:w-4 h-3 lg:h-4 ${
                      isVoiceEnabled ? 'text-iridescent-blue' : 'text-gray-400'
                    }`} />
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {isVoiceEnabled ? 'ElevenLabs activo' : 'API no configurada'}
                    </span>
                  </div>
                </div>
                  {/* Status Indicator */}
                <div className={`mt-3 lg:mt-4 p-2 lg:p-3 rounded-lg border ${
                  isVoiceEnabled 
                    ? 'bg-gradient-to-r from-green-500/10 to-iridescent-cyan/10 border-green-500/20'
                    : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                }`}>
                  <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                    {isVoiceEnabled 
                      ? `✅ ElevenLabs activo • ${ELEVENLABS_CONFIG.languages[selectedLanguage].name} • ${ELEVENLABS_CONFIG.languages[selectedLanguage].model}`
                      : '⚠️ Configura VITE_ELEVENLABS_API_KEY para activar'
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 px-4">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden text-sm lg:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            <Zap className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3" />
            {t('common', 'startAnalysis')}
            <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
          </button>
          
          <div className="text-xs lg:text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-iridescent-cyan rounded-full mr-2 animate-pulse"></div>
              {t('welcome', 'profileConfiguredAs')} {userProfile.businessType}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 px-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="liquid-card p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-xl liquid-glow-hover"
            style={{ background: 'var(--card-bg)' }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 mx-auto w-fit mb-4`}>
              <stat.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </h3>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>      
      {/* Features Section */}
      <div className="mb-8 lg:mb-12 px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
          {t('welcome', 'whatMakesSpecial')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="liquid-card p-6 lg:p-8 text-center transition-all duration-300 hover:shadow-xl liquid-glow-hover"
              style={{ background: 'var(--card-bg)' }}
            >
              <feature.icon className={`h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-3 lg:mb-4 ${feature.color}`} />
              <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="mb-8 lg:mb-12 px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
          {t('welcome', 'popularModules')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {businessModules.slice(0, 6).map((module) => {
            const Icon = getIcon(module.icon);
            return (
              <button
                key={module.id}
                onClick={() => onModuleSelect(module.id)}
                className="liquid-card p-6 text-left transition-all duration-300 hover:shadow-xl liquid-glow-hover hover:scale-105 group"
                style={{ background: 'var(--card-bg)' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-iridescent-blue/30 to-iridescent-violet/30 group-hover:from-iridescent-cyan/30 group-hover:to-iridescent-blue/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {module.name[language]}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {module.description[language]}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-iridescent-blue opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>      
      {/* Call to Action */}
      <div className="text-center px-4">
        <div 
          className="liquid-card p-6 lg:p-8 bg-gradient-to-br from-iridescent-blue/10 to-iridescent-violet/10 border relative overflow-hidden"
          style={{ borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.3)' : 'rgba(148, 163, 184, 0.3)' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
          
          <Sparkles className="h-12 lg:h-16 w-12 lg:w-16 text-iridescent-cyan mx-auto mb-4 lg:mb-6" />
          <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('common', 'transformYourBusiness')}
          </h3>
          <p className="text-base lg:text-lg mb-4 lg:mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {t('welcome', 'transformData')}
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan hover:from-iridescent-blue hover:to-iridescent-violet text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover text-sm lg:text-base"
          >
            <Brain className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3" />
            {t('common', 'startNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
