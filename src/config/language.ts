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
      DashboardActive: 'Dashboard Active',
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
      DashboardActive: 'Dashboard Activo',
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
      ActiveElevenLabs: 'Active ElevenLabs',
      Listen: 'Listen',
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
      activeElevenLabs: 'ElevenLabs active',
      apiNotConfigured: 'API not configured',
      configureApiKeyElevenLabs: 'Configure your ElevenLabs API key to activate the voice assistant.',
      activateApiKeyElevenLabs: 'activate',
    },
    es: {
      ActiveElevenLabs: 'ElevenLabs Activo',
      Listen: 'Escuchar',
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
      activeElevenLabs: 'ElevenLabs activo',
      apiNotConfigured: 'API no configurada',
      configureApiKeyElevenLabs: 'Configura tu API key de ElevenLabs para activar el asistente de voz.',
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
  },

  // Loading spinner
  loading: {
    en: {
      processing: "Processing with FlowForge AI",
      analyzing: "Our digital consultant is analyzing your business profile and generating personalized strategic recommendations",
      aiWorking: "Artificial Intelligence Working",
    },
    es: {
      processing: "Procesando con FlowForge AI",
      analyzing: "Nuestro consultor digital está analizando tu perfil empresarial y generando recomendaciones estratégicas personalizadas",
      aiWorking: "Inteligencia Artificial Trabajando",
    }
  },
  
  // AI Conversational Assistant
  assistant: {
    en: {
      placeholder: "Type your message...",
      send: "Send message",
      stopRecording: "Stop recording",
      recordVoice: "Record voice",
      geminiActive: "Gemini active",
      basicMode: "Basic mode",
      errorProcessing: "Sorry, I had a problem processing your request. Could you try again?",
      welcomeMessage: "Hello {name}! I'm your FlowForge AI assistant. How can I help you today? You can ask me about the available analysis modules or how I can help with your {businessType} business.",
      // Error messages
      speechRecognitionNotAvailable: "SpeechRecognition API not available",
      voiceRecognitionError: "Voice recognition error",
      voiceRecognitionStartError: "Error starting voice recognition",
      elevenLabsError: "Error with ElevenLabs",
      responseProcessingError: "Error processing response",
      // AI Service prompts
      detailedUserInfo: "DETAILED USER INFORMATION:",
      specificBusinessContext: "SPECIFIC CONTEXT FOR THIS BUSINESS TYPE:",
      profileBasedRecommendations: "RECOMMENDATIONS BASED ON YOUR PROFILE:",
      commonChallenges: "COMMON CHALLENGES FOR THIS BUSINESS TYPE AND STAGE:",
      availableModules: "AVAILABLE MODULES:",
      criticalInstructions: "CRITICAL INSTRUCTIONS:",
      responseInstructions: "1. Respond in ENGLISH in a helpful, professional and concise manner.\n2. Be EXTREMELY SPECIFIC and PRACTICAL in your recommendations - avoid generic advice.\n3. Completely adapt your responses to the user's specific business context.\n4. Provide CONCRETE EXAMPLES and IMPLEMENTABLE ACTIONS that the user can execute immediately.\n5. When recommending tools or technologies, mention specific options with different price ranges.\n6. Keep your responses brief (maximum 3-4 paragraphs) but informative, with a conversational tone.\n7. Use quantitative data and relevant benchmarks for their industry and company size.\n8. If asked about modules, explain how each one can solve their specific challenges.\n9. If asked about recommendations for their business, be specific about what to do, how to do it, and what results to expect.\n10. Use emojis occasionally to make the conversation more friendly.\n11. If asked about something you don't know, admit you don't have that information instead of making it up.",
      responseFormat: "RESPONSE FORMAT:\n- For recommendations: Provide 1-3 specific actions with concrete steps and expected results\n- For explanations: Use analogies relevant to their industry and practical examples\n- For comparisons: Include quantitative data and specific benchmarks\n- For tools: Mention 2-3 specific options with different price ranges",
      conversationHistory: "Conversation history:",
      user: "User:",
      assistant: "Assistant:"
    },
    es: {
      placeholder: "Escribe tu mensaje...",
      send: "Enviar mensaje",
      stopRecording: "Detener grabación",
      recordVoice: "Grabar voz",
      geminiActive: "Gemini activo",
      basicMode: "Modo básico",
      errorProcessing: "Lo siento, he tenido un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?",
      welcomeMessage: "¡Hola {name}! Soy tu asistente de FlowForge AI. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre los módulos de análisis disponibles o cómo puedo ayudarte con tu negocio {businessType}.",
      // Error messages
      speechRecognitionNotAvailable: "SpeechRecognition API no disponible",
      voiceRecognitionError: "Error en reconocimiento de voz",
      voiceRecognitionStartError: "Error al iniciar reconocimiento de voz",
      elevenLabsError: "Error con ElevenLabs",
      responseProcessingError: "Error al procesar la respuesta",
      // AI Service prompts
      detailedUserInfo: "INFORMACIÓN DETALLADA DEL USUARIO:",
      specificBusinessContext: "CONTEXTO ESPECÍFICO PARA ESTE TIPO DE NEGOCIO:",
      profileBasedRecommendations: "RECOMENDACIONES BASADAS EN SU PERFIL:",
      commonChallenges: "DESAFÍOS COMUNES PARA ESTE TIPO DE NEGOCIO Y ETAPA:",
      availableModules: "MÓDULOS DISPONIBLES:",
      criticalInstructions: "INSTRUCCIONES CRÍTICAS:",
      responseInstructions: "1. Responde en ESPAÑOL de forma útil, profesional y concisa.\n2. Sé EXTREMADAMENTE ESPECÍFICO y PRÁCTICO en tus recomendaciones - evita consejos genéricos.\n3. Adapta completamente tus respuestas al contexto empresarial específico del usuario.\n4. Proporciona EJEMPLOS CONCRETOS y ACCIONES IMPLEMENTABLES que el usuario pueda ejecutar inmediatamente.\n5. Cuando recomiendes herramientas o tecnologías, menciona opciones específicas con diferentes rangos de precios.\n6. Mantén tus respuestas breves (máximo 3-4 párrafos) pero informativas, con un tono conversacional.\n7. Usa datos cuantitativos y benchmarks relevantes para su industria y tamaño de empresa.\n8. Si te preguntan sobre los módulos, explica cómo cada uno puede resolver sus desafíos específicos.\n9. Si te preguntan sobre recomendaciones para su negocio, sé específico sobre qué hacer, cómo hacerlo, y qué resultados esperar.\n10. Usa emojis ocasionalmente para hacer la conversación más amigable.\n11. Si te preguntan sobre algo que no sabes, admite que no tienes esa información en lugar de inventar.",
      responseFormat: "FORMATO DE RESPUESTA:\n- Para recomendaciones: Proporciona 1-3 acciones específicas con pasos concretos y resultados esperados\n- Para explicaciones: Usa analogías relevantes a su industria y ejemplos prácticos\n- Para comparativas: Incluye datos cuantitativos y benchmarks específicos\n- Para herramientas: Menciona 2-3 opciones específicas con diferentes rangos de precios",
      conversationHistory: "Historial de conversación:",
      user: "Usuario:",
      assistant: "Asistente:"
    }
  },

  // Project Status Report
  report: {
    en: {
      projectStatusReport: "Project Status Report",
      detailedAnalysis: "Detailed Analysis of Progress and Key Metrics",
      downloadPDF: "Download Complete PDF",
      executiveSummary: "Executive Summary",
      overallProgress: "Overall Progress",
      aheadOfSchedule: "Ahead of schedule",
      projectStatus: "Project Status",
      inProgress: "In progress - No critical risks",
      expectedLaunch: "Expected Launch",
      keyMetrics: "Key Project Metrics",
      budgetDistribution: "Budget Distribution",
      spent: "Spent",
      committed: "Committed",
      available: "Available",
      keyPerformanceIndicators: "Key Performance Indicators",
      featuresCompleted: "Features Completed",
      completed: "completed",
      automatedTests: "Automated Tests",
      codeCoverage: "Code Coverage",
      excellentQuality: "Excellent quality",
      teamSatisfaction: "Team Satisfaction",
      veryHigh: "Very high",
      implementationProgress: "Implementation Progress Projection",
      plannedProgress: "Planned Progress",
      originalSchedule: "Original schedule based on initial estimates",
      actualProgress: "Actual Progress",
      currentAdvance: "Current project advance - 5% ahead",
      projectRoadmap: "Project Roadmap",
      phase1: "Phase 1: Foundation",
      phase2: "Phase 2: Development",
      phase3: "Phase 3: Integration",
      phase4: "Phase 4: Optimization",
      phase5: "Phase 5: Launch",
      riskAnalysis: "Risk Analysis",
      highRisk: "High Risk",
      technicalIntegration: "Technical Integration",
      complexityInServices: "Complexity in service integration",
      mediumRisk: "Medium Risk",
      requirementChanges: "Requirement Changes",
      possibleSpecChanges: "Possible specification modifications",
      lowRisk: "Low Risk",
      teamAvailability: "Team Availability",
      stableTeam: "Stable and committed team",
      nextStepsRecommendations: "Next Steps and Recommendations",
      immediateActions: "Immediate Actions (2 weeks)",
      completeIntegrationTests: "Complete Integration Tests",
      responsible: "Responsible",
      qualityTeam: "Quality Team",
      deadline: "Deadline",
      performanceOptimization: "Performance Optimization",
      backendTeam: "Backend Team",
      strategicRecommendations: "Strategic Recommendations",
      maintainMomentum: "Maintain Momentum",
      leverageProgress: "Leverage progress to reinforce quality",
      focusOnPerformance: "Focus on Performance",
      prioritizeOptimization: "Prioritize optimization for scalability",
      generatedOn: "Report generated on",
      nextReview: "Next review"
    },
    es: {
      projectStatusReport: "Informe de Estado del Proyecto",
      detailedAnalysis: "Análisis Detallado de Progreso y Métricas",
      downloadPDF: "Descargar PDF Completo",
      executiveSummary: "Resumen Ejecutivo",
      overallProgress: "Progreso General",
      aheadOfSchedule: "Adelantado al cronograma planificado",
      projectStatus: "Estado del Proyecto",
      inProgress: "En progreso - Sin riesgos críticos",
      expectedLaunch: "Lanzamiento Previsto",
      keyMetrics: "Métricas Clave del Proyecto",
      budgetDistribution: "Distribución del Presupuesto",
      spent: "Ejecutado",
      committed: "Comprometido",
      available: "Disponible",
      keyPerformanceIndicators: "Indicadores Clave de Rendimiento",
      featuresCompleted: "Funcionalidades Completadas",
      completed: "completado",
      automatedTests: "Pruebas Automatizadas",
      codeCoverage: "Cobertura de Código",
      excellentQuality: "Excelente calidad",
      teamSatisfaction: "Satisfacción del Equipo",
      veryHigh: "Muy alta",
      implementationProgress: "Progreso de Implementación Proyectado",
      plannedProgress: "Progreso Planificado",
      originalSchedule: "Cronograma original basado en estimaciones iniciales",
      actualProgress: "Progreso Real",
      currentAdvance: "Avance actual del proyecto - 5% adelantado",
      projectRoadmap: "Hoja de Ruta del Proyecto",
      phase1: "Fase 1: Fundación",
      phase2: "Fase 2: Desarrollo",
      phase3: "Fase 3: Integración",
      phase4: "Fase 4: Optimización",
      phase5: "Fase 5: Lanzamiento",
      riskAnalysis: "Análisis de Riesgos",
      highRisk: "Riesgo Alto",
      technicalIntegration: "Integración Técnica",
      complexityInServices: "Complejidad en integración de servicios",
      mediumRisk: "Riesgo Medio",
      requirementChanges: "Cambios en Requisitos",
      possibleSpecChanges: "Posibles modificaciones en especificaciones",
      lowRisk: "Riesgo Bajo",
      teamAvailability: "Disponibilidad del Equipo",
      stableTeam: "Equipo estable y comprometido",
      nextStepsRecommendations: "Próximos Pasos y Recomendaciones",
      immediateActions: "Acciones Inmediatas (2 semanas)",
      completeIntegrationTests: "Completar Pruebas de Integración",
      responsible: "Responsable",
      qualityTeam: "Equipo de Calidad",
      deadline: "Fecha límite",
      performanceOptimization: "Optimización de Rendimiento",
      backendTeam: "Equipo Backend",
      strategicRecommendations: "Recomendaciones Estratégicas",
      maintainMomentum: "Mantener el Impulso",
      leverageProgress: "Aprovechar el avance para reforzar calidad",
      focusOnPerformance: "Enfoque en Rendimiento",
      prioritizeOptimization: "Priorizar optimización para escalabilidad",
      generatedOn: "Informe generado el",
      nextReview: "Próxima revisión"
    }
  },

  // User Profile View
  userProfile: {
    en: {
      // Header
      businessProfile: "Business Profile",
      detailedInfo: "Detailed information for personalized analysis",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      
      // Messages
      profileNotFound: "Profile not found",
      couldNotLoad: "Could not load profile information",
      noChanges: "No changes to save",
      profileUpdated: "Profile successfully updated",
      
      // Basic Profile Info
      baseProfileInfo: "Base Profile Information",
      businessType: "Business Type",
      revenueModel: "Revenue Model",
      businessStage: "Business Stage",
      mainObjective: "Main Objective",
      digitalizationLevel: "Digitalization Level",
      employeeCount: "Number of Employees",
      
      // Extended Profile Sections
      basicInfo: "Basic Information",
      marketAndCustomers: "Market and Customers",
      strategyAndObjectives: "Strategy and Objectives",
      operationsAndProcesses: "Operations and Processes",
      resourcesAndStructure: "Resources and Structure",
      challengesAndMetrics: "Challenges and Metrics",
      financialInformation: "Financial Information",
      
      // Fields
      businessName: "Business Name",
      businessDescription: "Business Description",
      industry: "Industry/Sector",
      targetMarket: "Target Market",
      mainCustomers: "Main Customers",
      geographicScope: "Geographic Scope",
      businessGoals: "Business Goals",
      yearlyGrowthTarget: "Yearly Growth Target",
      competitiveAdvantage: "Competitive Advantage",
      keyProducts: "Key Products/Services",
      salesProcess: "Sales Process",
      marketingChannels: "Marketing Channels",
      teamStructure: "Team Structure",
      technologyStack: "Technology Stack",
      budgetRange: "Budget Range",
      currentChallenges: "Current Challenges",
      successMetrics: "Success Metrics",
      timeframe: "Timeframe",
      monthlyRevenue: "Approximate Monthly Revenue",
      businessModel: "Detailed Business Model",
      
      // Placeholders
      businessNamePlaceholder: "E.g.: TechStart Solutions",
      businessDescriptionPlaceholder: "Briefly describe your business and what it does...",
      industryPlaceholder: "E.g.: Technology, Retail, Financial Services",
      targetMarketPlaceholder: "Describe your target market and audience...",
      mainCustomersPlaceholder: "Describe the profile of your main customers...",
      geographicScopePlaceholder: "E.g.: Local, National, International",
      businessGoalsPlaceholder: "Describe your main short and long-term objectives...",
      yearlyGrowthTargetPlaceholder: "E.g.: 50% sales growth, 100 new customers",
      competitiveAdvantagePlaceholder: "What differentiates you from the competition...",
      keyProductsPlaceholder: "Describe your main products or services...",
      salesProcessPlaceholder: "Describe how you sell your products/services...",
      marketingChannelsPlaceholder: "E.g.: Social media, Google Ads, Email marketing",
      teamStructurePlaceholder: "Describe your team organization...",
      technologyStackPlaceholder: "Tools and technologies you use...",
      budgetRangePlaceholder: "E.g.: $5K-10K monthly for marketing",
      currentChallengesPlaceholder: "Main challenges your business is facing...",
      successMetricsPlaceholder: "How you measure your business success...",
      timeframePlaceholder: "E.g.: Objectives for the next 6-12 months",
      monthlyRevenuePlaceholder: "E.g.: $10K-50K, $50K-100K, $100K+",
      businessModelPlaceholder: "Describe how you generate revenue...",
      
      // AI Enhancement
      aiPoweredAnalysis: "AI-Powered Analysis",
      aiEnhancementDescription: "The more information you provide about your business, the more specific and personalized the analyses and recommendations generated by FlowForge AI will be. This additional information allows creating McKinsey-level consulting reports tailored exactly to your business context.",
      aiSuggestionTip: "Use the AI buttons to get personalized suggestions for each field",
      
      // Other
      notSpecified: "Not specified"
    },
    es: {
      // Header
      businessProfile: "Perfil de Negocio",
      detailedInfo: "Información detallada para análisis personalizados",
      editProfile: "Editar Perfil",
      saveChanges: "Guardar Cambios",
      saving: "Guardando...",
      cancel: "Cancelar",
      
      // Messages
      profileNotFound: "No se encontró el perfil",
      couldNotLoad: "No se pudo cargar la información del perfil",
      noChanges: "No hay cambios para guardar",
      profileUpdated: "Perfil actualizado exitosamente",
      
      // Basic Profile Info
      baseProfileInfo: "Información Base del Perfil",
      businessType: "Tipo de Negocio",
      revenueModel: "Modelo de Ingresos",
      businessStage: "Etapa del Negocio",
      mainObjective: "Objetivo Principal",
      digitalizationLevel: "Nivel de Digitalización",
      employeeCount: "Número de Empleados",
      
      // Extended Profile Sections
      basicInfo: "Información Básica",
      marketAndCustomers: "Mercado y Clientes",
      strategyAndObjectives: "Estrategia y Objetivos",
      operationsAndProcesses: "Operaciones y Procesos",
      resourcesAndStructure: "Recursos y Estructura",
      challengesAndMetrics: "Desafíos y Métricas",
      financialInformation: "Información Financiera",
      
      // Fields
      businessName: "Nombre del Negocio",
      businessDescription: "Descripción del Negocio",
      industry: "Industria/Sector",
      targetMarket: "Mercado Objetivo",
      mainCustomers: "Principales Clientes",
      geographicScope: "Alcance Geográfico",
      businessGoals: "Objetivos del Negocio",
      yearlyGrowthTarget: "Meta de Crecimiento Anual",
      competitiveAdvantage: "Ventaja Competitiva",
      keyProducts: "Productos/Servicios Clave",
      salesProcess: "Proceso de Ventas",
      marketingChannels: "Canales de Marketing",
      teamStructure: "Estructura del Equipo",
      technologyStack: "Stack Tecnológico",
      budgetRange: "Rango de Presupuesto",
      currentChallenges: "Desafíos Actuales",
      successMetrics: "Métricas de Éxito",
      timeframe: "Marco Temporal",
      monthlyRevenue: "Ingresos Mensuales Aproximados",
      businessModel: "Modelo de Negocio Detallado",
      
      // Placeholders
      businessNamePlaceholder: "Ej: TechStart Solutions",
      businessDescriptionPlaceholder: "Describe brevemente tu negocio y lo que hace...",
      industryPlaceholder: "Ej: Tecnología, Retail, Servicios Financieros",
      targetMarketPlaceholder: "Describe tu mercado objetivo y audiencia...",
      mainCustomersPlaceholder: "Describe el perfil de tus clientes principales...",
      geographicScopePlaceholder: "Ej: Local, Nacional, Internacional",
      businessGoalsPlaceholder: "Describe tus principales objetivos a corto y largo plazo...",
      yearlyGrowthTargetPlaceholder: "Ej: 50% crecimiento en ventas, 100 nuevos clientes",
      competitiveAdvantagePlaceholder: "Qué te diferencia de la competencia...",
      keyProductsPlaceholder: "Describe tus principales productos o servicios...",
      salesProcessPlaceholder: "Describe cómo vendes tus productos/servicios...",
      marketingChannelsPlaceholder: "Ej: Redes sociales, Google Ads, Email marketing",
      teamStructurePlaceholder: "Describe la organización de tu equipo...",
      technologyStackPlaceholder: "Herramientas y tecnologías que utilizas...",
      budgetRangePlaceholder: "Ej: $5K-10K mensual para marketing",
      currentChallengesPlaceholder: "Principales retos que enfrenta tu negocio...",
      successMetricsPlaceholder: "Cómo mides el éxito de tu negocio...",
      timeframePlaceholder: "Ej: Objetivos para los próximos 6-12 meses",
      monthlyRevenuePlaceholder: "Ej: $10K-50K, $50K-100K, $100K+",
      businessModelPlaceholder: "Describe cómo generas ingresos...",
      
      // AI Enhancement
      aiPoweredAnalysis: "Análisis Potenciado por IA",
      aiEnhancementDescription: "Mientras más información proporciones sobre tu negocio, más específicos y personalizados serán los análisis y recomendaciones que genere FlowForge AI. Esta información adicional permite crear reportes de consultoría de nivel McKinsey adaptados exactamente a tu contexto empresarial.",
      aiSuggestionTip: "Usa los botones de IA para obtener sugerencias personalizadas en cada campo",
      
      // Other
      notSpecified: "No especificado"
    }
  },

  // Profile Values (for translating database keys to user-friendly labels)
  profileValues: {
    en: {
      // Business Types
      'servicio-digital': 'Digital Service',
      'producto-fisico': 'Physical Product',
      'contenido-media': 'Content/Media',
      'consultoria-freelance': 'Consulting/Freelance',
      'ecommerce-puro': 'Pure E-commerce',
      'startup-tecnologia': 'Technology Startup',
      'agencia-marketing': 'Marketing Agency',
      'retail-fisico': 'Physical Retail',
      'manufactura-produccion': 'Manufacturing/Production',
      'servicios-profesionales': 'Professional Services',
      'organizacion-no-lucro': 'Non-profit Organization',
      'otro': 'Other',
      
      // Revenue Models
      'b2b': 'B2B (Business to Business)',
      'b2c': 'B2C (Business to Consumer)',
      'd2c': 'D2C (Direct to Consumer)',
      'suscripcion': 'Subscription',
      'transaccional': 'Transactional',
      'publicidad-afiliacion': 'Advertising/Affiliation',
      'hibrido': 'Hybrid',
      
      // Business Stages
      'idea-prelanzamiento': 'Idea/Pre-launch',
      'startup-temprano': 'Early Startup',
      'pyme-crecimiento': 'Growing SME',
      'pyme-establecida': 'Established SME',
      'gran-empresa': 'Large Enterprise',
      
      // Main Objectives
      'crecimiento-ventas': 'Sales Growth',
      'optimizacion-costos': 'Cost Optimization',
      'mejora-experiencia': 'Experience Improvement',
      'innovacion-productos': 'Product Innovation',
      'aumentar-ventas': 'Increase Sales',
      'optimizar-operaciones': 'Optimize Operations',
      'mejorar-experiencia-cliente': 'Improve Customer Experience',
      'reducir-costos-operativos': 'Reduce Operational Costs',
      'expansion-mercados': 'Market Expansion',
      'innovacion-producto-servicio': 'Product/Service Innovation',
      'construccion-marca-comunidad': 'Brand/Community Building',
      
      // Digitalization Levels
      'bajo-manual': 'Low (Manual)',
      'medio-herramientas': 'Medium (Some Tools)',
      'alto-automatizado': 'High (Automated)',
      'muy-alto-ai': 'Very High (AI Integrated)',
      
      // Employee Counts
      '1-5': '1-5 employees',
      '6-20': '6-20 employees',
      '21-50': '21-50 employees',
      '51-200': '51-200 employees',
      '201-500': '201-500 employees',
      'mas-500': 'More than 500 employees'
    },
    es: {
      // Business Types
      'servicio-digital': 'Servicio Digital',
      'producto-fisico': 'Producto Físico',
      'contenido-media': 'Contenido/Media',
      'consultoria-freelance': 'Consultoría/Freelance',
      'ecommerce-puro': 'E-commerce Puro',
      'startup-tecnologia': 'Startup Tecnológico',
      'agencia-marketing': 'Agencia de Marketing',
      'retail-fisico': 'Retail Físico',
      'manufactura-produccion': 'Manufactura/Producción',
      'servicios-profesionales': 'Servicios Profesionales',
      'organizacion-no-lucro': 'Organización sin fines de lucro',
      'otro': 'Otro',
      
      // Revenue Models
      'b2b': 'B2B (Business to Business)',
      'b2c': 'B2C (Business to Consumer)',
      'd2c': 'D2C (Direct to Consumer)',
      'suscripcion': 'Suscripción',
      'transaccional': 'Transaccional',
      'publicidad-afiliacion': 'Publicidad/Afiliación',
      'hibrido': 'Híbrido',
      
      // Business Stages
      'idea-prelanzamiento': 'Idea/Pre-lanzamiento',
      'startup-temprano': 'Startup Temprano',
      'pyme-crecimiento': 'Pyme en Crecimiento',
      'pyme-establecida': 'Pyme Establecida',
      'gran-empresa': 'Gran Empresa',
      
      // Main Objectives
      'crecimiento-ventas': 'Crecimiento de Ventas',
      'optimizacion-costos': 'Optimización de Costos',
      'mejora-experiencia': 'Mejora de Experiencia',
      'innovacion-productos': 'Innovación de Productos',
      'aumentar-ventas': 'Aumentar Ventas',
      'optimizar-operaciones': 'Optimizar Operaciones',
      'mejorar-experiencia-cliente': 'Mejorar Experiencia del Cliente',
      'reducir-costos-operativos': 'Reducir Costos Operativos',
      'expansion-mercados': 'Expansión de Mercados',
      'innovacion-producto-servicio': 'Innovación de Producto/Servicio',
      'construccion-marca-comunidad': 'Construcción de Marca/Comunidad',
      
      // Digitalization Levels
      'bajo-manual': 'Bajo (Manual)',
      'medio-herramientas': 'Medio (Herramientas)',
      'alto-automatizado': 'Alto (Automatizado)',
      'muy-alto-ai': 'Muy Alto (IA Integrada)',
      
      // Employee Counts
      '1-5': '1-5 empleados',
      '6-20': '6-20 empleados',
      '21-50': '21-50 empleados',
      '51-200': '51-200 empleados',
      '201-500': '201-500 empleados',
      'mas-500': 'Más de 500 empleados'
    }
  },

  // Sidebar
  sidebar: {
    en: {
      activeProfile: "Active Profile",
      type: "Type:",
      stage: "Stage:",
      employees: "Employees:",
      clickToView: "Click to view/edit complete profile",
      intelligentModules: "Intelligent Modules"
    },
    es: {
      activeProfile: "Perfil Activo",
      type: "Tipo:",
      stage: "Etapa:",
      employees: "Empleados:",
      clickToView: "Clic para ver/editar perfil completo",
      intelligentModules: "Módulos Inteligentes"
    }
  },

  // Report History
  reportHistory: {
    en: {
      title: "Report History",
      reportCount: "report",
      reportCountPlural: "reports",
      generated: "generated",
      close: "Close",
      searchPlaceholder: "Search in reports...",
      allModules: "All modules",
      noReportsYet: "No reports yet",
      noReportsFound: "No reports found",
      generateFirst: "Generate your first report using one of the consulting modules",
      adjustFilters: "Try adjusting the search filters",
      viewReport: "View Report",
      download: "Download",
      deleteConfirm: "Are you sure you want to delete this report?",
      loadingHistory: "Loading history...",
      errorLoading: "Error loading report history",
      errorDeleting: "Error deleting report"
    },
    es: {
      title: "Historial de Reportes",
      reportCount: "reporte",
      reportCountPlural: "reportes",
      generated: "generado",
      generatedPlural: "generados",
      close: "Cerrar",
      searchPlaceholder: "Buscar en reportes...",
      allModules: "Todos los módulos",
      noReportsYet: "No hay reportes aún",
      noReportsFound: "No se encontraron reportes",
      generateFirst: "Genera tu primer reporte usando uno de los módulos de consultoría",
      adjustFilters: "Intenta ajustar los filtros de búsqueda",
      viewReport: "Ver Reporte",
      download: "Descargar",
      deleteConfirm: "¿Estás seguro de que quieres eliminar este reporte?",
      loadingHistory: "Cargando historial...",
      errorLoading: "Error al cargar el historial de reportes",
      errorDeleting: "Error al eliminar el reporte"
    }
  },

  AppContainer: {
    en: {
      initializing: "Initializing FlowForge AI",
      settingUpServices: "Setting up services and verifying session",
      initializationError: "Initialization Error",
      couldNotInitialize: "Could not initialize the application",
      retry: "Retry",
      errorSavingProfile: "Error saving profile",
      errorGeneratingReport: "Error generating report",
      errorSigningOut: "Error signing out"
    },
    es: {
      initializing: "Inicializando FlowForge AI",
      settingUpServices: "Configurando servicios y verificando sesión",
      initializationError: "Error de Inicialización",
      couldNotInitialize: "No se pudo inicializar la aplicación",
      retry: "Reintentar",
      errorSavingProfile: "Error al guardar el perfil",
      errorGeneratingReport: "Error al generar el reporte",
      errorSigningOut: "Error al cerrar sesión"
    }
  },

  // Report Display
  reportDisplay: {
    en: {
      downloadMarkdown: "Download Markdown",
      downloadPDF: "Download PDF Professional",
      share: "Share",
      generatingPDF: "Generating professional PDF...",
      pdfDownloaded: "PDF downloaded successfully",
      errorGeneratingPDF: "Error generating PDF",
      linkCopied: "Link copied to clipboard",
      shareReport: "FlowForge AI Report",
      shareText: "Check out this personalized report generated by FlowForge AI",
      keyMetrics: "Key Project Metrics",
      projectedROI: "Projected ROI",
      implementationTime: "Implementation Time",
      productivityImpact: "Productivity Impact",
      confidenceLevel: "Confidence Level",
      projectedProgress: "Projected Implementation Progress",
      strategicAnalysis: "Strategic Analysis",
      quantitativeAnalysis: "Quantitative Analysis",
      projectedROILabel: "Projected ROI",
      industryBenchmarks: "Industry Benchmarks",
      highProbability: "High probability",
      
      // Professional Report Header
      professionalAnalysis: "Professional Analysis",
      mcKinseyLevel: "McKinsey-Level Consulting Analysis • Generated on",
      
      // Metrics Dashboard
      projectedROIValue: "45%",
      roiBenchmark: "+15% vs. benchmark",
      implementationTimeValue: "12 months",
      implementationSpeedUp: "30% faster",
      productivityImpactValue: "35%",
      productivityEstimate: "Estimated improvement",
      confidenceLevelValue: "92%",
      
      // Implementation Progress Chart
      implementationProgressTitle: "📈 Projected Implementation Progress",
      phase1: "Month 1-3: Foundation",
      phase2: "Month 4-6: Development", 
      phase3: "Month 7-9: Integration",
      phase4: "Month 10-12: Optimization",
      
      // Progress Indicators
      automation: "Automation",
      integration: "Integration",
      training: "Training",
      optimization: "Optimization",
      
      // Implementation Roadmap
      roadmapTitle: "🛤️ Implementation Roadmap",
      phase1Title: "Phase 1: Foundation",
      phase1Duration: "Weeks 1-8",
      phase1Description: "Initial setup, tool selection and basic automation implementation",
      phase2Title: "Phase 2: Core Implementation",
      phase2Duration: "Weeks 9-20", 
      phase2Description: "Main system deployment and critical business process integration",
      phase3Title: "Phase 3: Optimization",
      phase3Duration: "Weeks 21-32",
      phase3Description: "Fine-tuning, advanced training and system performance optimization",
      phase4Title: "Phase 4: Innovation",
      phase4Duration: "Weeks 33-52",
      phase4Description: "Advanced AI/ML capabilities and continuous improvement establishment",
      
      // Phase Status
      completed: "COMPLETED",
      inProgress: "IN PROGRESS",
      planned: "PLANNED",
      phase1Status: "100% Completed",
      phase2Status: "75% Completed", 
      phase3Status: "Next 2 months",
      phase4Status: "Q4 2025",
      
      // ROI Analysis
      roiAnalysisTitle: "💰 Detailed ROI Analysis",
      totalInvestment: "Total Investment",
      initialInvestment: "Initial investment",
      projectedROIDetailed: "Projected ROI",
      roiTimeframe: "At 24 months",
      breakEvenPoint: "Break-even Point",
      breakEvenMonths: "Months",
      totalReturn: "Total Return",
      totalReturnProjected: "Projected 36M",
      
      // ROI Projection
      roiProjectionTitle: "Return on Investment Projection",
      quarter1: "Q1 2025",
      quarter2: "Q2 2025", 
      quarter3: "Q3 2025",
      quarter4: "Q4 2025",
      investment: "Inv",
      return: "Ret",
      net: "Net",
      
      // Risk Analysis
      riskAnalysisTitle: "Risk Analysis and Mitigation",
      identifiedRisks: "Identified Risks:",
      organizationalResistance: "Organizational change resistance",
      technicalComplexity: "Technical integration complexity", 
      implementationOvercosts: "Possible implementation cost overruns",
      mitigationStrategies: "Mitigation Strategies:",
      changeManagement: "Change management program",
      phasedImplementation: "Phased implementation",
      contingencyReserves: "15% contingency reserves",
      
      // Footer
      exploreAnotherModule: "Explore Another Module",
      downloadCompletePDF: "Download Complete PDF",
      quantitativeAnalysisFooter: "Quantitative Analysis",
      roiProjectionsFooter: "ROI Projections", 
      industryBenchmarksFooter: "Industry Benchmarks",
      exploreQuestion: "Want to explore another module or generate a complementary analysis?"
    },
    es: {
      downloadMarkdown: "Descargar Markdown",
      downloadPDF: "Descargar PDF Profesional",
      share: "Compartir",
      generatingPDF: "Generando PDF profesional...",
      pdfDownloaded: "PDF descargado exitosamente",
      errorGeneratingPDF: "Error al generar PDF",
      linkCopied: "Link copiado al portapapeles",
      shareReport: "Reporte FlowForge AI",
      shareText: "Mira este reporte personalizado generado por FlowForge AI",
      keyMetrics: "Métricas Clave del Proyecto",
      projectedROI: "ROI Proyectado",
      implementationTime: "Tiempo de Implementación",
      productivityImpact: "Impacto en Productividad",
      confidenceLevel: "Nivel de Confianza",
      projectedProgress: "Progreso de Implementación Proyectado",
      strategicAnalysis: "Análisis Estratégico",
      quantitativeAnalysis: "Análisis Cuantitativo",
      projectedROILabel: "ROI Proyectado",
      industryBenchmarks: "Benchmarks de Industria",
      highProbability: "Alta probabilidad",
      
      // Professional Report Header
      professionalAnalysis: "Análisis Profesional",
      mcKinseyLevel: "Análisis de Consultoría Nivel McKinsey • Generado el",
      
      // Metrics Dashboard
      projectedROIValue: "45%",
      roiBenchmark: "+15% vs. benchmark",
      implementationTimeValue: "12 meses",
      implementationSpeedUp: "30% más rápido",
      productivityImpactValue: "35%",
      productivityEstimate: "Mejora estimada",
      confidenceLevelValue: "92%",
      
      // Implementation Progress Chart
      implementationProgressTitle: "📈 Progreso de Implementación Proyectado",
      phase1: "Mes 1-3: Fundación",
      phase2: "Mes 4-6: Desarrollo",
      phase3: "Mes 7-9: Integración", 
      phase4: "Mes 10-12: Optimización",
      
      // Progress Indicators
      automation: "Automatización",
      integration: "Integración",
      training: "Capacitación",
      optimization: "Optimización",
      
      // Implementation Roadmap
      roadmapTitle: "🛤️ Hoja de Ruta de Implementación",
      phase1Title: "Fase 1: Fundación",
      phase1Duration: "Semanas 1-8",
      phase1Description: "Configuración inicial, selección de herramientas y primeras automatizaciones básicas",
      phase2Title: "Fase 2: Implementación Core",
      phase2Duration: "Semanas 9-20",
      phase2Description: "Despliegue de sistemas principales e integración de procesos críticos de negocio",
      phase3Title: "Fase 3: Optimización",
      phase3Duration: "Semanas 21-32",
      phase3Description: "Ajuste fino, capacitación avanzada y optimización de rendimiento del sistema",
      phase4Title: "Fase 4: Innovación",
      phase4Duration: "Semanas 33-52",
      phase4Description: "Capacidades avanzadas de IA/ML y establecimiento de mejora continua",
      
      // Phase Status
      completed: "COMPLETADA",
      inProgress: "EN PROGRESO",
      planned: "PLANIFICADA",
      phase1Status: "100% Finalizada",
      phase2Status: "75% Completada",
      phase3Status: "Próximos 2 meses",
      phase4Status: "Q4 2025",
      
      // ROI Analysis
      roiAnalysisTitle: "💰 Análisis Detallado de ROI",
      totalInvestment: "Inversión Total",
      initialInvestment: "Inversión inicial",
      projectedROIDetailed: "ROI Proyectado",
      roiTimeframe: "A los 24 meses",
      breakEvenPoint: "Punto de Equilibrio",
      breakEvenMonths: "Meses",
      totalReturn: "Retorno Total",
      totalReturnProjected: "Proyectado 36M",
      
      // ROI Projection
      roiProjectionTitle: "Proyección de Retorno de Inversión",
      quarter1: "Q1 2025",
      quarter2: "Q2 2025",
      quarter3: "Q3 2025", 
      quarter4: "Q4 2025",
      investment: "Inv",
      return: "Ret",
      net: "Neto",
      
      // Risk Analysis
      riskAnalysisTitle: "Análisis de Riesgos y Mitigación",
      identifiedRisks: "Riesgos Identificados:",
      organizationalResistance: "Resistencia al cambio organizacional",
      technicalComplexity: "Complejidad de integración técnica",
      implementationOvercosts: "Posibles sobrecostos de implementación",
      mitigationStrategies: "Estrategias de Mitigación:",
      changeManagement: "Programa de gestión del cambio",
      phasedImplementation: "Implementación por fases",
      contingencyReserves: "Reservas de contingencia del 15%",
      
      // Footer
      exploreAnotherModule: "Explorar Otro Módulo",
      downloadCompletePDF: "Descargar PDF Completo",
      quantitativeAnalysisFooter: "Análisis Cuantitativo",
      roiProjectionsFooter: "Proyecciones ROI",
      industryBenchmarksFooter: "Benchmarks Industria",
      exploreQuestion: "¿Quieres explorar otro módulo o generar un análisis complementario?"
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