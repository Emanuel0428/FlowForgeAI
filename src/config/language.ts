import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, ELEVENLABS_CONFIG } from './elevenlabs';

// Interface for translations
interface Translations {
  [key: string]: {
    [language: string]: {
      [key: string]: string;
    };
  };
}

// Translations dictionary
export const translations: Translations = {
  // Common UI elements
  common: {
    en: {
      darkMode: 'Dark mode',
      lightMode: 'Light mode',
      signOut: 'Sign Out',
      exitApplication: 'Exit application',
      viewProfile: 'View Profile',
      goToHome: 'Go to Home',
      dashboard: 'Dashboard',
      reportHistory: 'Report History',
      viewPreviousReports: 'View previous reports',
      language: 'Language',
      welcomeToDashboard: 'Welcome to Dashboard',
      businessIntelligence: 'Business Intelligence',
      getStarted: 'Get Started',
      startAnalysis: 'Start Analysis',
      transformYourBusiness: 'Ready to transform your business?',
      startNow: 'Start Now',
      in: 'in',
      selectModule: 'Select a Module',
    },
    es: {
      darkMode: 'Modo oscuro',
      lightMode: 'Modo claro',
      signOut: 'Cerrar Sesión',
      exitApplication: 'Salir de la aplicación',
      viewProfile: 'Ver Perfil',
      goToHome: 'Volver al Inicio',
      dashboard: 'Dashboard',
      reportHistory: 'Historial de Reportes',
      viewPreviousReports: 'Ver reportes anteriores',
      language: 'Idioma',
      welcomeToDashboard: 'Dashboard Activo',
      businessIntelligence: 'Inteligencia de Negocios',
      getStarted: 'Comenzar',
      startAnalysis: 'Comenzar Análisis',
      transformYourBusiness: '¿Listo para transformar tu negocio?',
      startNow: 'Empezar Ahora',
      in: 'en',
      selectModule: 'Selecciona un Módulo',
    }
  },
  
  // Welcome dashboard
  welcome: {
    en: {
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good night',
      welcomeTo: 'Welcome to',
      transformData: 'We transform data into strategic decisions with artificial intelligence tailored to you.',
      voiceAssistant: 'AI Voice Assistant',
      notConfigured: 'AI Voice Assistant (Not configured)',
      interactWithVoice: 'Interact with FlowForge using your voice. Powered by ElevenLabs.',
      configureApiKey: 'Configure your ElevenLabs API key to activate the voice assistant.',
      fullyFunctional: 'Fully functional!',
      addApiKey: 'Add VITE_ELEVENLABS_API_KEY to your .env',
      voice: 'Voice',
      profileConfiguredAs: 'Profile configured as',
      availableAnalyses: 'Available Analyses',
      specializedModules: 'Specialized modules',
      aiAccuracy: 'AI Accuracy',
      accurateAnalysis: 'Accurate analysis',
      companiesBenefited: 'Companies Benefited',
      successCases: 'Success cases',
      whatMakesSpecial: 'What makes FlowForge AI special?',
      intelligentAnalysis: 'Intelligent Analysis',
      getDeepInsights: 'Get deep insights about your business with advanced AI',
      personalizedRecommendations: 'Personalized Recommendations',
      strategiesAdapted: 'Strategies adapted to your business type and stage',
      detailedReports: 'Detailed Reports',
      completeDocumentation: 'Complete documentation ready to implement',
      popularModules: 'Most Popular Modules',
      conversationalAssistant: 'Conversational Assistant',
      voiceAssistantButton: 'Voice Assistant',
      pause: 'Pause',
      play: 'Play',
    },
    es: {
      goodMorning: 'Buenos días',
      goodAfternoon: 'Buenas tardes',
      goodEvening: 'Buenas noches',
      welcomeTo: 'Bienvenido a',
      transformData: 'Transformamos datos en decisiones estratégicas con inteligencia artificial a tu medida.',
      voiceAssistant: 'Asistente de Voz IA',
      notConfigured: 'Asistente de Voz IA (Sin configurar)',
      interactWithVoice: 'Interactúa con FlowForge usando tu voz. Powered by ElevenLabs.',
      configureApiKey: 'Configura tu API key de ElevenLabs para activar el asistente de voz.',
      fullyFunctional: '¡Totalmente funcional!',
      addApiKey: 'Agrega VITE_ELEVENLABS_API_KEY a tu .env',
      voice: 'Voz',
      profileConfiguredAs: 'Perfil configurado como',
      availableAnalyses: 'Análisis Disponibles',
      specializedModules: 'Módulos especializados',
      aiAccuracy: 'Precisión IA',
      accurateAnalysis: 'Análisis certero',
      companiesBenefited: 'Empresas Beneficiadas',
      successCases: 'Casos de éxito',
      whatMakesSpecial: '¿Qué hace especial a FlowForge AI?',
      intelligentAnalysis: 'Análisis Inteligente',
      getDeepInsights: 'Obtén insights profundos sobre tu negocio con IA avanzada',
      personalizedRecommendations: 'Recomendaciones Personalizadas',
      strategiesAdapted: 'Estrategias adaptadas a tu tipo de negocio y etapa',
      detailedReports: 'Reportes Detallados',
      completeDocumentation: 'Documentación completa lista para implementar',
      popularModules: 'Módulos Más Populares',
      conversationalAssistant: 'Asistente Conversacional',
      voiceAssistantButton: 'Asistente de Voz',
      pause: 'Pausar',
      play: 'Reproducir',
    }
  },
  
  // Menu items
  menu: {
    en: {
      userMenu: 'User Menu',
      interfaceTheme: 'Interface Theme',
      darkLiquidMode: 'Dark liquid mode',
      lightLiquidMode: 'Light liquid mode',
    },
    es: {
      userMenu: 'Menú de Usuario',
      interfaceTheme: 'Tema de Interfaz',
      darkLiquidMode: 'Modo líquido oscuro',
      lightLiquidMode: 'Modo líquido claro',
    }
  }
};

// Type for the language context
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (section: string, key: string) => string;
}

// Create the language context
export const LanguageContext = createContext<LanguageContextType>({
  language: ELEVENLABS_CONFIG.defaultLanguage,
  setLanguage: () => {},
  t: (section: string, key: string) => key
});

// Provider component props
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    () => {
      const savedLanguage = localStorage.getItem('flowforge-language');
      return (savedLanguage as SupportedLanguage) || ELEVENLABS_CONFIG.defaultLanguage;
    }
  );

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('flowforge-language', language);
  }, [language]);

  // Function to set language
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
  };

  // Translation function
  const t = (section: string, key: string): string => {
    if (translations[section] && translations[section][language] && translations[section][language][key]) {
      return translations[section][language][key];
    }
    
    // Fallback to English if translation is missing
    if (translations[section] && translations[section]['en'] && translations[section]['en'][key]) {
      return translations[section]['en'][key];
    }
    
    // Return the key if no translation found
    return key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
}

// Custom hook to use the language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 