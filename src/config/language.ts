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
  
  // Auth modal
  auth: {
    en: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      resetPassword: 'Reset Password',
      accessYourAIConsultant: 'Access your AI consultant',
      joinFlowForgeAI: 'Join FlowForge AI',
      recoverAccess: 'Recover your access',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      createOne: 'Create one',
      signInHere: 'Sign in here',
      resetPasswordButton: 'Send reset instructions',
      backToSignIn: 'Back to sign in',
      signInButton: 'Sign In',
      signUpButton: 'Sign Up',
      passwordRequirements: 'Password must be at least 6 characters',
      emailRequired: 'Email is required',
      validEmail: 'Enter a valid email',
      passwordRequired: 'Password is required',
      passwordLength: 'Password must be at least 6 characters',
      passwordsDontMatch: 'Passwords do not match',
      unexpectedError: 'Unexpected error. Please try again.',
      accountCreated: 'Account created successfully. Signing in...',
      signedInSuccessfully: 'Signed in successfully',
      resetEmailSent: 'An email with reset instructions has been sent',
    },
    es: {
      signIn: 'Iniciar Sesión',
      signUp: 'Crear Cuenta',
      resetPassword: 'Restablecer Contraseña',
      accessYourAIConsultant: 'Accede a tu consultor IA',
      joinFlowForgeAI: 'Únete a FlowForge AI',
      recoverAccess: 'Recupera tu acceso',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      dontHaveAccount: '¿No tienes una cuenta?',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      createOne: 'Crear una',
      signInHere: 'Inicia sesión aquí',
      resetPasswordButton: 'Enviar instrucciones',
      backToSignIn: 'Volver a inicio de sesión',
      signInButton: 'Iniciar Sesión',
      signUpButton: 'Registrarse',
      passwordRequirements: 'La contraseña debe tener al menos 6 caracteres',
      emailRequired: 'El email es requerido',
      validEmail: 'Ingresa un email válido',
      passwordRequired: 'La contraseña es requerida',
      passwordLength: 'La contraseña debe tener al menos 6 caracteres',
      passwordsDontMatch: 'Las contraseñas no coinciden',
      unexpectedError: 'Error inesperado. Inténtalo de nuevo.',
      accountCreated: 'Cuenta creada exitosamente. Iniciando sesión...',
      signedInSuccessfully: 'Sesión iniciada exitosamente',
      resetEmailSent: 'Se ha enviado un email con instrucciones para restablecer tu contraseña',
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
  },

  // Profile form
  profile: {
    en: {
      profileYourBusiness: 'Profile Your Business',
      helpUsUnderstand: 'Help us understand your business to offer personalized recommendations with liquid intelligence',
      step: 'Step',
      of: 'of',
      completed: 'completed',
      previous: 'Previous',
      next: 'Next',
      startAnalysis: 'Start Analysis',
      selectOption: 'Select an option',
      // Step titles
      businessBasics: 'Business Basic Information',
      stageAndObjectives: 'Stage and Objectives',
      digitalMaturityAndResources: 'Digital Maturity and Resources',
      // Field labels
      businessTypeLabel: 'What is the main type of your business?',
      revenueModelLabel: 'What is your main revenue model?',
      businessStageLabel: 'What stage is your business in?',
      mainObjectiveLabel: 'What is your main strategic objective?',
      digitalizationLevelLabel: 'What is your current level of digitalization?',
      employeeCountLabel: 'How many employees does your organization have?',
      // Business types
      physicalProduct: 'Physical Product',
      digitalService: 'Digital Service (SaaS/Platform)',
      contentMedia: 'Content/Media (Blog, Podcast, YouTube)',
      consultingFreelance: 'Consulting/Freelance',
      pureEcommerce: 'Pure E-commerce',
      nonprofit: 'Non-profit Organization',
      other: 'Other',
      // Revenue models
      b2b: 'B2B (Business to Business)',
      b2c: 'B2C (Business to Consumer)',
      d2c: 'D2C (Direct to Consumer)',
      subscription: 'Subscription (Recurring Revenue)',
      transactional: 'Transactional (One-time purchase)',
      advertisingAffiliation: 'Advertising/Affiliation',
      hybrid: 'Hybrid',
      // Business stages
      ideaPrelaunch: 'Idea/Pre-launch',
      earlyStartup: 'Startup (early growth < 1 year)',
      growthSME: 'Growing SME (1-5 years)',
      establishedSME: 'Established SME (> 5 years)',
      largeEnterprise: 'Large Enterprise/Corporation',
      // Strategic objectives
      increaseSales: 'Increase Sales and Revenue',
      optimizeOperations: 'Optimize Operations and Efficiency',
      improveCustomerExperience: 'Improve Customer Experience',
      reduceOperationalCosts: 'Reduce Operational Costs',
      marketExpansion: 'Expansion to New Markets',
      productInnovation: 'Product/Service Innovation',
      brandBuilding: 'Brand/Community Building',
      // Digitalization levels
      lowManual: 'Low (mostly manual)',
      mediumSomeTools: 'Medium (some tools)',
      highAutomated: 'High (automated processes, data)',
      veryHighAI: 'Very High (AI integrated)',
      // Employee counts
      employees1to5: '1-5 employees',
      employees6to20: '6-20 employees',
      employees21to50: '21-50 employees',
      employees51to200: '51-200 employees',
      employees201to500: '201-500 employees',
      employeesMore500: 'More than 500 employees',
      // Validation messages
      fieldRequired: 'is required'
    },
    es: {
      profileYourBusiness: 'Perfila tu Negocio',
      helpUsUnderstand: 'Ayúdanos a entender tu negocio para ofrecerte recomendaciones personalizadas con inteligencia líquida',
      step: 'Paso',
      of: 'de',
      completed: 'completado',
      previous: 'Anterior',
      next: 'Siguiente',
      startAnalysis: 'Comenzar Análisis',
      selectOption: 'Selecciona una opción',
      // Step titles
      businessBasics: 'Información Básica del Negocio',
      stageAndObjectives: 'Etapa y Objetivos',
      digitalMaturityAndResources: 'Madurez Digital y Recursos',
      // Field labels
      businessTypeLabel: '¿Cuál es el tipo principal de tu negocio?',
      revenueModelLabel: '¿Cuál es tu modelo de ingresos principal?',
      businessStageLabel: '¿En qué etapa se encuentra tu negocio?',
      mainObjectiveLabel: '¿Cuál es tu principal objetivo estratégico?',
      digitalizationLevelLabel: '¿Cuál es tu nivel actual de digitalización?',
      employeeCountLabel: '¿Cuántos empleados tiene tu organización?',
      // Business types
      physicalProduct: 'Producto Físico',
      digitalService: 'Servicio Digital (SaaS/Plataforma)',
      contentMedia: 'Contenido/Media (Blog, Podcast, YouTube)',
      consultingFreelance: 'Consultoría/Freelance',
      pureEcommerce: 'E-commerce Puro',
      nonprofit: 'Organización sin fines de lucro',
      other: 'Otro',
      // Revenue models
      b2b: 'B2B (Business to Business)',
      b2c: 'B2C (Business to Consumer)',
      d2c: 'D2C (Direct to Consumer)',
      subscription: 'Suscripción (Recurring Revenue)',
      transactional: 'Transaccional (One-time purchase)',
      advertisingAffiliation: 'Publicidad/Afiliación',
      hybrid: 'Híbrido',
      // Business stages
      ideaPrelaunch: 'Idea/Pre-lanzamiento',
      earlyStartup: 'Startup (crecimiento temprano < 1 año)',
      growthSME: 'Pyme en Crecimiento (1-5 años)',
      establishedSME: 'Pyme Establecida (> 5 años)',
      largeEnterprise: 'Gran Empresa/Corporación',
      // Strategic objectives
      increaseSales: 'Aumentar Ventas e Ingresos',
      optimizeOperations: 'Optimizar Operaciones y Eficiencia',
      improveCustomerExperience: 'Mejorar Experiencia del Cliente',
      reduceOperationalCosts: 'Reducir Costos Operativos',
      marketExpansion: 'Expansión a Nuevos Mercados',
      productInnovation: 'Innovación de Producto/Servicio',
      brandBuilding: 'Construcción de Marca/Comunidad',
      // Digitalization levels
      lowManual: 'Bajo (mayormente manual)',
      mediumSomeTools: 'Medio (algunas herramientas)',
      highAutomated: 'Alto (procesos automatizados, datos)',
      veryHighAI: 'Muy Alto (AI integrada)',
      // Employee counts
      employees1to5: '1-5 empleados',
      employees6to20: '6-20 empleados',
      employees21to50: '21-50 empleados',
      employees51to200: '51-200 empleados',
      employees201to500: '201-500 empleados',
      employeesMore500: 'Más de 500 empleados',
      // Validation messages
      fieldRequired: 'es requerido'
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