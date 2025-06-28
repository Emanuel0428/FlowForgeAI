import { UserProfileData } from '../types';
import { genAI, modelConfig, isGeminiAvailable } from '../config/gemini';
import { businessModules } from '../data/modules';
import { translations } from '../config/language';
import { SupportedLanguage } from '../config/elevenlabs';

interface ConversationContext {
  userProfile: UserProfileData;
  userEmail: string;
  userName: string;
  language?: SupportedLanguage;
}

// Translation helper function
function t(section: keyof typeof translations, key: string, language: SupportedLanguage = 'es'): string {
  const sectionTranslations = translations[section];
  if (!sectionTranslations) return key;
  
  const langTranslations = sectionTranslations[language];
  if (!langTranslations) return key;
  
  return langTranslations[key] || key;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  userInput: string,
  conversationHistory: ConversationMessage[],
  context: ConversationContext,
  language: SupportedLanguage = 'es'
): Promise<string> {
  // Add language to context
  const contextWithLanguage = { ...context, language };
  
  if (!isGeminiAvailable || !genAI) {
    return generateFallbackResponse(userInput, contextWithLanguage);
  }

  try {
    // Construir el contexto para Gemini
    const contextPrompt = buildConversationPrompt(userInput, conversationHistory, contextWithLanguage);
    
    // Generar respuesta con Gemini
    const model = genAI.getGenerativeModel(modelConfig);
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Verificar que la respuesta sea válida
    if (!text || text.trim().length < 10) {
      throw new Error(language === 'en' ? 'Gemini response too short or empty' : 'Respuesta de Gemini demasiado corta o vacía');
    }
    
    return text;
  } catch (error) {
    console.error(language === 'en' ? 'Error generating response with Gemini:' : 'Error al generar respuesta con Gemini:', error);
    return generateFallbackResponse(userInput, contextWithLanguage);
  }
}

function buildConversationPrompt(
  userInput: string,
  conversationHistory: ConversationMessage[],
  context: ConversationContext
): string {
  const { userProfile, userEmail, userName, language = 'es' } = context;
  
  // Construir información sobre los módulos disponibles
  const modulesInfo = businessModules.map(module => 
    `- ${module.id}: ${module.name} - ${module.description}`
  ).join('\n');
  
  // Construir historial de conversación
  const historyText = conversationHistory
    .map(msg => `${msg.role === 'user' ? t('assistant', 'user', language) : t('assistant', 'assistant', language)}: ${msg.content}`)
    .join('\n');
  
  // Obtener contexto específico para el tipo de negocio
  const businessTypeContext = getBusinessTypeContext(userProfile.businessType);
  
  // Obtener recomendaciones específicas basadas en el perfil
  const profileBasedRecommendations = getProfileBasedRecommendations(userProfile);
  
  // Obtener desafíos comunes para este tipo de negocio y etapa
  const commonChallenges = getCommonChallenges(userProfile);
  
  // Construir prompt completo
  return `
    ${language === 'en' ? 
      'You are an expert business consultant from FlowForge AI, a business consulting platform with artificial intelligence. Your goal is to provide practical, specific and actionable advice adapted to the exact business profile.' :
      'Eres un consultor empresarial experto de FlowForge AI, una plataforma de consultoría empresarial con inteligencia artificial. Tu objetivo es proporcionar asesoramiento práctico, específico y accionable adaptado al perfil exacto del negocio.'
    }
    
    ${t('assistant', 'detailedUserInfo', language)}
    - ${language === 'en' ? 'Name' : 'Nombre'}: ${userName}
    - Email: ${userEmail}
    - ${language === 'en' ? 'Business type' : 'Tipo de negocio'}: ${userProfile.businessType}
    - ${language === 'en' ? 'Revenue model' : 'Modelo de ingresos'}: ${userProfile.revenueModel}
    - ${language === 'en' ? 'Business stage' : 'Etapa del negocio'}: ${userProfile.businessStage}
    - ${language === 'en' ? 'Main objective' : 'Objetivo principal'}: ${userProfile.mainObjective}
    - ${language === 'en' ? 'Digitalization level' : 'Nivel de digitalización'}: ${userProfile.digitalizationLevel}
    - ${language === 'en' ? 'Number of employees' : 'Número de empleados'}: ${userProfile.employeeCount}
    
    ${t('assistant', 'specificBusinessContext', language)}
    ${businessTypeContext}
    
    ${t('assistant', 'profileBasedRecommendations', language)}
    ${profileBasedRecommendations}
    
    ${t('assistant', 'commonChallenges', language)}
    ${commonChallenges}
    
    ${t('assistant', 'availableModules', language)}
    ${modulesInfo}
    
    ${t('assistant', 'criticalInstructions', language)}
    ${t('assistant', 'responseInstructions', language)}
    
    ${t('assistant', 'responseFormat', language)}
    
    ${t('assistant', 'conversationHistory', language)}
    ${historyText}
    
    ${t('assistant', 'user', language)}: ${userInput}
    
    ${t('assistant', 'assistant', language)}:
  `;
}

// Funciones auxiliares para generar contexto específico

function getBusinessTypeContext(businessType: string): string {
  const contexts: Record<string, string> = {
    'ecommerce-puro': 'Los negocios de e-commerce puro enfrentan desafíos específicos como optimización de conversion rate, gestión de inventario, logística de envíos, atención al cliente omnicanal, y competencia intensa en adquisición de clientes. Las prioridades suelen ser: automatización de marketing, optimización de producto, mejora de experiencia de usuario, y eficiencia logística.',
    'servicio-digital': 'Los negocios de servicios digitales enfrentan desafíos como escalabilidad de entrega, retención de clientes, diferenciación en mercados saturados, y gestión eficiente de proyectos. Las prioridades suelen ser: automatización de procesos, sistemas de delivery consistente, estrategias de pricing efectivas, y programas de customer success.',
    'consultoria-freelance': 'Los consultores freelance enfrentan desafíos como adquisición constante de clientes, gestión de tiempo, escalabilidad personal, y diferenciación en el mercado. Las prioridades suelen ser: sistemas de generación de leads, procesos de onboarding de clientes, productización de servicios, y estrategias de autoridad y posicionamiento.',
    'startup-tecnologia': 'Las startups tecnológicas enfrentan desafíos como validación de producto-mercado, escalabilidad técnica, atracción de talento e inversión, y time-to-market acelerado. Las prioridades suelen ser: procesos de desarrollo ágil, estrategias de go-to-market, optimización de unit economics, y sistemas de feedback de usuarios.',
    'agencia-marketing': 'Las agencias de marketing enfrentan desafíos como demostración de ROI a clientes, gestión eficiente de múltiples cuentas, atracción y retención de talento creativo, y adaptación constante a nuevas plataformas. Las prioridades suelen ser: sistemas de reporting automatizado, procesos de creatividad escalable, y estrategias de upselling y cross-selling.',
    'retail-fisico': 'Los negocios de retail físico enfrentan desafíos como integración omnicanal, optimización de inventario, experiencia en tienda, y competencia con pure players digitales. Las prioridades suelen ser: digitalización de procesos en tienda, estrategias click-and-collect, programas de fidelización, y análisis de tráfico y conversión.',
    'manufactura-produccion': 'Las empresas de manufactura enfrentan desafíos como optimización de cadena de suministro, eficiencia operativa, control de calidad, y adaptación a demandas cambiantes. Las prioridades suelen ser: sistemas de planificación de producción, automatización de procesos, mantenimiento predictivo, y trazabilidad de productos.',
    'servicios-profesionales': 'Las empresas de servicios profesionales enfrentan desafíos como escalabilidad del expertise, gestión del conocimiento, diferenciación en mercados competitivos, y retención de talento especializado. Las prioridades suelen ser: sistemas de gestión del conocimiento, automatización de procesos administrativos, y estrategias de desarrollo de talento.'
  };
  
  return contexts[businessType] || 'Este tipo de negocio requiere un enfoque personalizado basado en su industria específica, modelo operativo, y objetivos de crecimiento. Las prioridades varían según el sector, tamaño y madurez del negocio.';
}

function getProfileBasedRecommendations(profile: UserProfileData): string {
  // Recomendaciones basadas en etapa del negocio
  const stageRecommendations: Record<string, string> = {
    'startup-temprano': '- Prioriza la validación de producto-mercado antes de invertir en automatización compleja\n- Implementa sistemas mínimos viables que puedan escalar posteriormente\n- Enfócate en métricas de adquisición y retención de clientes\n- Considera herramientas freemium o de bajo costo con capacidad de crecimiento',
    'pyme-crecimiento': '- Sistematiza los procesos manuales que están limitando tu crecimiento\n- Implementa CRM y automatización de marketing básica\n- Desarrolla dashboards para KPIs críticos de crecimiento\n- Estandariza la experiencia del cliente para mantener calidad mientras creces',
    'pyme-establecida': '- Optimiza los procesos existentes para mejorar márgenes y eficiencia\n- Implementa analytics avanzados para decisiones basadas en datos\n- Desarrolla estrategias de retención y expansión de clientes existentes\n- Moderniza sistemas legacy que limitan la agilidad del negocio',
    'gran-empresa': '- Implementa arquitectura empresarial que integre todos los sistemas\n- Desarrolla capacidades de data science y business intelligence\n- Optimiza procesos interdepartamentales y elimina silos\n- Implementa innovación estructurada y programas de transformación digital'
  };
  
  // Recomendaciones basadas en nivel de digitalización
  const digitalizationRecommendations: Record<string, string> = {
    'bajo-manual': '- Comienza con herramientas cloud básicas para colaboración y gestión\n- Implementa sistemas de facturación electrónica y contabilidad digital\n- Establece presencia online básica y canales digitales esenciales\n- Capacita al equipo en habilidades digitales fundamentales',
    'medio-herramientas': '- Integra las herramientas existentes para eliminar trabajo manual redundante\n- Implementa automatización de marketing y ventas básica\n- Desarrolla dashboards unificados para visibilidad del negocio\n- Optimiza la experiencia digital del cliente en todos los puntos de contacto',
    'alto-automatizado': '- Implementa analytics avanzados y sistemas predictivos\n- Desarrolla integraciones API entre todos los sistemas\n- Optimiza customer journeys digitales end-to-end\n- Implementa testing A/B sistemático para optimización continua',
    'muy-alto-ai': '- Implementa casos de uso de AI/ML para decisiones avanzadas\n- Desarrolla capacidades de personalización hipersegmentada\n- Optimiza procesos con automatización inteligente adaptativa\n- Implementa sistemas de innovación digital continua'
  };
  
  // Recomendaciones basadas en objetivo principal
  const objectiveRecommendations: Record<string, string> = {
    'crecimiento-ventas': '- Implementa embudos de conversión optimizados por canal\n- Desarrolla sistemas de nurturing automatizado para leads\n- Optimiza el proceso de ventas con automatización y seguimiento\n- Implementa cross-selling y upselling sistemático',
    'optimizacion-costos': '- Audita y optimiza procesos operativos clave\n- Implementa sistemas de control de gastos en tiempo real\n- Automatiza tareas administrativas repetitivas\n- Desarrolla KPIs de eficiencia por departamento',
    'mejora-experiencia': '- Implementa sistema de feedback continuo de clientes\n- Desarrolla journey maps y optimiza puntos de fricción\n- Automatiza comunicaciones personalizadas en momentos clave\n- Implementa sistemas de medición de satisfacción en tiempo real',
    'innovacion-productos': '- Establece procesos de ideación y validación rápida\n- Implementa sistemas de feedback de usuarios para desarrollo\n- Desarrolla MVP y procesos de iteración continua\n- Establece métricas de adopción y uso de nuevas funcionalidades'
  };
  
  return `
Basado en tu perfil específico, estas son las recomendaciones prioritarias:

SEGÚN TU ETAPA (${profile.businessStage}):
${stageRecommendations[profile.businessStage] || stageRecommendations['pyme-crecimiento']}

SEGÚN TU NIVEL DE DIGITALIZACIÓN (${profile.digitalizationLevel}):
${digitalizationRecommendations[profile.digitalizationLevel] || digitalizationRecommendations['medio-herramientas']}

SEGÚN TU OBJETIVO PRINCIPAL (${profile.mainObjective}):
${objectiveRecommendations[profile.mainObjective] || objectiveRecommendations['crecimiento-ventas']}
  `;
}

function getCommonChallenges(profile: UserProfileData): string {
  // Desafíos basados en tipo de negocio y etapa
  const businessTypeStageKey = `${profile.businessType}-${profile.businessStage}`;
  
  const challengeMap: Record<string, string> = {
    'ecommerce-puro-startup-temprano': '- Competencia intensa con grandes marketplaces\n- Limitaciones de presupuesto para marketing\n- Logística y cumplimiento eficiente\n- Construcción de confianza con nuevos clientes',
    'ecommerce-puro-pyme-crecimiento': '- Escalabilidad de operaciones logísticas\n- Optimización de ROI en marketing digital\n- Gestión de inventario eficiente\n- Experiencia de cliente consistente con volumen',
    'servicio-digital-startup-temprano': '- Diferenciación en mercado saturado\n- Pricing estratégico y rentable\n- Adquisición de primeros clientes de referencia\n- Procesos de entrega consistentes',
    'servicio-digital-pyme-crecimiento': '- Escalabilidad de entrega sin sacrificar calidad\n- Retención y expansión de cuentas existentes\n- Contratación y onboarding de talento\n- Sistematización de procesos de delivery',
    'consultoria-freelance-startup-temprano': '- Flujo constante de nuevos clientes\n- Establecimiento de autoridad en el mercado\n- Pricing adecuado de servicios\n- Gestión eficiente del tiempo',
    'consultoria-freelance-pyme-crecimiento': '- Escalabilidad más allá de tiempo personal\n- Construcción de equipo y delegación\n- Sistematización de servicios\n- Posicionamiento premium en el mercado',
  };
  
  // Fallback a desafíos generales por tipo de negocio
  const businessTypeChallenges: Record<string, string> = {
    'ecommerce-puro': '- Optimización de conversión en tienda online\n- Gestión eficiente de inventario y logística\n- Competencia en adquisición de clientes digital\n- Fidelización y valor de vida del cliente',
    'servicio-digital': '- Escalabilidad de entrega de servicios\n- Diferenciación en mercado competitivo\n- Retención y expansión de clientes\n- Pricing estratégico y rentable',
    'consultoria-freelance': '- Adquisición constante de nuevos clientes\n- Posicionamiento como autoridad\n- Escalabilidad más allá del tiempo personal\n- Gestión eficiente de proyectos y clientes',
    'startup-tecnologia': '- Validación de producto-mercado\n- Atracción de inversión y talento\n- Escalabilidad técnica\n- Go-to-market efectivo',
    'agencia-marketing': '- Demostración de ROI a clientes\n- Gestión eficiente de múltiples cuentas\n- Atracción y retención de talento creativo\n- Diferenciación en mercado saturado',
    'retail-fisico': '- Competencia con pure players digitales\n- Integración omnicanal efectiva\n- Optimización de experiencia en tienda\n- Gestión eficiente de inventario',
    'manufactura-produccion': '- Optimización de cadena de suministro\n- Eficiencia operativa y reducción de costos\n- Adaptación a demandas cambiantes\n- Digitalización de procesos productivos',
    'servicios-profesionales': '- Escalabilidad del expertise\n- Gestión del conocimiento\n- Retención de talento especializado\n- Diferenciación en mercado competitivo'
  };
  
  const specificChallenges = challengeMap[businessTypeStageKey] || businessTypeChallenges[profile.businessType];
  
  return specificChallenges || `Los negocios como el tuyo típicamente enfrentan desafíos en áreas como adquisición de clientes, optimización de procesos, escalabilidad, y diferenciación competitiva. La etapa específica de tu negocio (${profile.businessStage}) implica un enfoque en establecer fundaciones sólidas mientras se mantiene la agilidad para crecer.`;
}

function generateFallbackResponse(userInput: string, context: ConversationContext): string {
  const { userProfile, userName, language = 'es' } = context;
  const inputLower = userInput.toLowerCase();
  
  // Respuestas para preguntas sobre módulos
  if (inputLower.includes('módulo') || inputLower.includes('modulo') || 
      inputLower.includes('análisis') || inputLower.includes('analisis') ||
      inputLower.includes('module') || inputLower.includes('analysis')) {
    if (language === 'en') {
      return `For a ${userProfile.businessType} business in ${userProfile.businessStage} stage, I would recommend these specific modules:

1️⃣ **${getRecommendedModule(userProfile)}**: This would be most relevant for your objective of ${userProfile.mainObjective} considering your current digitalization level.

2️⃣ **${getSecondaryModule(userProfile)}**: This would perfectly complement the first module and help solve your specific challenges as a ${userProfile.businessType}.

Would you like to know more about any of these modules in particular?`;
    } else {
      return `Para un negocio ${userProfile.businessType} en etapa ${userProfile.businessStage}, recomendaría estos módulos específicos:

1️⃣ **${getRecommendedModule(userProfile)}**: Este sería el más relevante para tu objetivo de ${userProfile.mainObjective} considerando tu nivel actual de digitalización.

2️⃣ **${getSecondaryModule(userProfile)}**: Complementaría perfectamente el primer módulo y ayudaría a resolver tus desafíos específicos como ${userProfile.businessType}.

¿Te gustaría saber más sobre alguno de estos módulos en particular?`;
    }
  }
  
  // Respuestas para preguntas sobre el negocio
  if (inputLower.includes('negocio') || inputLower.includes('empresa') || 
      inputLower.includes('recomendación') || inputLower.includes('recomendacion') ||
      inputLower.includes('business') || inputLower.includes('company') || 
      inputLower.includes('recommendation')) {
    if (language === 'en') {
      return `Based on your ${userProfile.businessType} profile in ${userProfile.businessStage} stage, here are 3 specific recommendations:

1️⃣ **${getTopRecommendation(userProfile)}**: This would generate immediate results for your objective of ${userProfile.mainObjective}.

2️⃣ **${getMidTermRecommendation(userProfile)}**: Ideal to implement in the next 2-3 months, considering your digitalization level ${userProfile.digitalizationLevel}.

3️⃣ **${getStrategicRecommendation(userProfile)}**: A strategic initiative that would transform your business long-term.

Would you like me to elaborate on any of these recommendations?`;
    } else {
      return `Basado en tu perfil de ${userProfile.businessType} en etapa ${userProfile.businessStage}, aquí tienes 3 recomendaciones específicas:

1️⃣ **${getTopRecommendation(userProfile)}**: Esto generaría resultados inmediatos para tu objetivo de ${userProfile.mainObjective}.

2️⃣ **${getMidTermRecommendation(userProfile)}**: Ideal para implementar en los próximos 2-3 meses, considerando tu nivel de digitalización ${userProfile.digitalizationLevel}.

3️⃣ **${getStrategicRecommendation(userProfile)}**: Una iniciativa estratégica que transformaría tu negocio a largo plazo.

¿Quieres que profundice en alguna de estas recomendaciones?`;
    }
  }
  
  // Respuestas para preguntas sobre la plataforma
  if (inputLower.includes('flowforge') || inputLower.includes('plataforma') || 
      inputLower.includes('funciona') || inputLower.includes('hace') ||
      inputLower.includes('platform') || inputLower.includes('works') || inputLower.includes('does')) {
    if (language === 'en') {
      return `FlowForge AI is a business consulting platform powered by artificial intelligence. For ${userProfile.businessType} businesses like yours, we offer:

1️⃣ **Personalized analysis**: We evaluate your specific situation considering your ${userProfile.businessStage} stage and objective of ${userProfile.mainObjective}.

2️⃣ **Actionable recommendations**: We provide implementable strategies adapted to your digitalization level ${userProfile.digitalizationLevel}.

3️⃣ **Specific tools**: We suggest proven technologies and methodologies for businesses of your size (${userProfile.employeeCount} employees).

Is there any specific aspect of the platform you'd like to know more about?`;
    } else {
      return `FlowForge AI es una plataforma de consultoría empresarial potenciada por inteligencia artificial. Para negocios ${userProfile.businessType} como el tuyo, ofrecemos:

1️⃣ **Análisis personalizado**: Evaluamos tu situación específica considerando tu etapa ${userProfile.businessStage} y objetivo de ${userProfile.mainObjective}.

2️⃣ **Recomendaciones accionables**: Proporcionamos estrategias implementables adaptadas a tu nivel de digitalización ${userProfile.digitalizationLevel}.

3️⃣ **Herramientas específicas**: Sugerimos tecnologías y metodologías probadas para negocios de tu tamaño (${userProfile.employeeCount} empleados).

¿Hay algún aspecto específico de la plataforma sobre el que quieras saber más?`;
    }
  }
  
  // Respuesta para saludos
  if (inputLower.includes('hola') || inputLower.includes('buenos días') || 
      inputLower.includes('buenas tardes') || inputLower.includes('buenas noches') ||
      inputLower.includes('hello') || inputLower.includes('hi') || 
      inputLower.includes('good morning') || inputLower.includes('good afternoon') || 
      inputLower.includes('good evening')) {
    if (language === 'en') {
      return `Hello ${userName}! 👋 As a consultant specialized in ${userProfile.businessType} businesses, I'm here to help you with your main objective of ${userProfile.mainObjective}. 

Considering you're in ${userProfile.businessStage} stage with a digitalization level of ${userProfile.digitalizationLevel}, I can offer specific recommendations for your situation.

What specific area would you like to focus on today?`;
    } else {
      return `¡Hola ${userName}! 👋 Como consultor especializado en negocios ${userProfile.businessType}, estoy aquí para ayudarte con tu objetivo principal de ${userProfile.mainObjective}. 

Considerando que estás en etapa ${userProfile.businessStage} con un nivel de digitalización ${userProfile.digitalizationLevel}, puedo ofrecerte recomendaciones específicas para tu situación.

¿En qué área específica te gustaría enfocarte hoy?`;
    }
  }
  
  // Respuesta genérica
  if (language === 'en') {
    return `Thank you for your inquiry about ${extractTopic(userInput, language)}. For a ${userProfile.businessType} business in ${userProfile.businessStage} stage, this is particularly relevant.

Considering your objective of ${userProfile.mainObjective} and digitalization level of ${userProfile.digitalizationLevel}, I would recommend focusing first on ${getPriorityArea(userProfile, language)}.

Would you like me to elaborate on any specific aspect of this recommendation?`;
  } else {
    return `Gracias por tu consulta sobre ${extractTopic(userInput, language)}. Para un negocio ${userProfile.businessType} en etapa ${userProfile.businessStage}, esto es particularmente relevante.

Considerando tu objetivo de ${userProfile.mainObjective} y nivel de digitalización ${userProfile.digitalizationLevel}, te recomendaría enfocarte primero en ${getPriorityArea(userProfile, language)}.

¿Te gustaría que profundizara en algún aspecto específico de esta recomendación?`;
  }
} 

// Funciones auxiliares adicionales para respuestas fallback

function getRecommendedModule(profile: UserProfileData): string {
  const moduleMap: Record<string, Record<string, string>> = {
    'ecommerce-puro': {
      'crecimiento-ventas': 'Marketing Digital & Automatización',
      'optimizacion-costos': 'FinTech & Control de Gestión',
      'mejora-experiencia': 'Experiencia & Soporte al Cliente',
      'innovacion-productos': 'Estrategia de Producto & Crecimiento'
    },
    'servicio-digital': {
      'crecimiento-ventas': 'Marketing Digital & Automatización',
      'optimizacion-costos': 'Transformación Digital Integral',
      'mejora-experiencia': 'Experiencia & Soporte al Cliente',
      'innovacion-productos': 'Innovación & Desarrollo Tecnológico'
    },
    'consultoria-freelance': {
      'crecimiento-ventas': 'Estrategia de Contenidos & SEO',
      'optimizacion-costos': 'Automatización Ventas & CRM',
      'mejora-experiencia': 'Experiencia & Soporte al Cliente',
      'innovacion-productos': 'Innovación & Desarrollo Tecnológico'
    }
  };
  
  return moduleMap[profile.businessType]?.[profile.mainObjective] || 'Transformación Digital Integral';
}

function getSecondaryModule(profile: UserProfileData): string {
  const moduleMap: Record<string, string> = {
    'ecommerce-puro': 'Automatización Ventas & CRM',
    'servicio-digital': 'Estrategia de Contenidos & SEO',
    'consultoria-freelance': 'Marketing Digital & Automatización',
    'startup-tecnologia': 'Estrategia de Producto & Crecimiento',
    'agencia-marketing': 'Analítica de Personal & HR Tech',
    'retail-fisico': 'Experiencia & Soporte al Cliente',
    'manufactura-produccion': 'FinTech & Control de Gestión',
    'servicios-profesionales': 'Analítica de Personal & HR Tech'
  };
  
  return moduleMap[profile.businessType] || 'Marketing Digital & Automatización';
}

function getTopRecommendation(profile: UserProfileData): string {
  const recommendationMap: Record<string, Record<string, string>> = {
    'ecommerce-puro': {
      'crecimiento-ventas': 'Implementar embudos de conversión optimizados con email marketing automatizado',
      'optimizacion-costos': 'Automatizar gestión de inventario y logística con integración de proveedores',
      'mejora-experiencia': 'Desarrollar sistema de atención al cliente omnicanal con chatbot inteligente',
      'innovacion-productos': 'Implementar sistema de feedback de clientes y testing A/B de productos'
    },
    'servicio-digital': {
      'crecimiento-ventas': 'Desarrollar sistema de generación de leads con nurturing automatizado',
      'optimizacion-costos': 'Implementar gestión de proyectos automatizada con tracking de tiempo',
      'mejora-experiencia': 'Crear portal de cliente con onboarding automatizado y recursos self-service',
      'innovacion-productos': 'Establecer programa de beta testers con feedback estructurado'
    },
    'consultoria-freelance': {
      'crecimiento-ventas': 'Crear sistema de contenido estratégico con lead magnets automatizados',
      'optimizacion-costos': 'Implementar CRM con seguimiento automático de prospectos',
      'mejora-experiencia': 'Desarrollar proceso de onboarding de clientes estructurado',
      'innovacion-productos': 'Crear paquetes de servicios escalables con diferentes niveles'
    }
  };
  
  return recommendationMap[profile.businessType]?.[profile.mainObjective] || 'Implementar un sistema CRM adaptado a tu flujo de trabajo específico';
}

function getMidTermRecommendation(profile: UserProfileData): string {
  const recommendationMap: Record<string, string> = {
    'ecommerce-puro': 'Desarrollar programa de fidelización con segmentación avanzada de clientes',
    'servicio-digital': 'Implementar sistema de upselling y cross-selling automatizado para clientes existentes',
    'consultoria-freelance': 'Crear sistema de referidos automatizado con incentivos para clientes actuales',
    'startup-tecnologia': 'Implementar analytics avanzado para optimización de producto basada en uso',
    'agencia-marketing': 'Desarrollar dashboard de ROI en tiempo real para clientes',
    'retail-fisico': 'Implementar sistema omnicanal con inventario unificado',
    'manufactura-produccion': 'Desarrollar sistema de mantenimiento predictivo con IoT',
    'servicios-profesionales': 'Implementar sistema de gestión del conocimiento y recursos compartidos'
  };
  
  return recommendationMap[profile.businessType] || 'Desarrollar dashboard de KPIs críticos con alertas automáticas';
}

function getStrategicRecommendation(profile: UserProfileData): string {
  const stageMap: Record<string, string> = {
    'startup-temprano': 'Desarrollar arquitectura tecnológica escalable preparada para crecimiento exponencial',
    'pyme-crecimiento': 'Implementar sistema integral de business intelligence con forecasting predictivo',
    'pyme-establecida': 'Desarrollar programa de innovación sistemática con metodología de validación rápida',
    'gran-empresa': 'Implementar arquitectura de datos empresarial con capacidades avanzadas de AI/ML'
  };
  
  return stageMap[profile.businessStage] || 'Desarrollar estrategia de transformación digital integral con roadmap a 3 años';
}

function getPriorityArea(profile: UserProfileData, language: SupportedLanguage = 'es'): string {
  const priorityMap: Record<string, Record<string, string>> = {
    'bajo-manual': {
      'crecimiento-ventas': 'implementación de CRM básico y automatización de seguimiento de leads',
      'optimizacion-costos': 'digitalización de procesos administrativos manuales clave',
      'mejora-experiencia': 'implementación de sistema básico de feedback de clientes',
      'innovacion-productos': 'establecimiento de proceso estructurado de ideación y validación'
    },
    'medio-herramientas': {
      'crecimiento-ventas': 'integración de herramientas existentes y automatización de marketing',
      'optimizacion-costos': 'optimización de workflows entre sistemas y eliminación de duplicidades',
      'mejora-experiencia': 'desarrollo de journey maps y optimización de puntos de contacto',
      'innovacion-productos': 'implementación de sistema de gestión de innovación con métricas'
    },
    'alto-automatizado': {
      'crecimiento-ventas': 'implementación de analytics avanzado y personalización hipersegmentada',
      'optimizacion-costos': 'optimización algorítmica de procesos y automatización inteligente',
      'mejora-experiencia': 'implementación de sistema predictivo de necesidades de clientes',
      'innovacion-productos': 'desarrollo de programa de innovación abierta con partners estratégicos'
    }
  };
  
  return priorityMap[profile.digitalizationLevel]?.[profile.mainObjective] || 'desarrollo de estrategia digital integral adaptada a tu etapa de negocio';
}

function extractTopic(userInput: string, language: SupportedLanguage = 'es'): string {
  const commonTopicsEs = [
    'marketing digital', 'ventas', 'automatización', 'clientes', 'procesos', 
    'tecnología', 'estrategia', 'crecimiento', 'optimización', 'innovación',
    'experiencia del cliente', 'finanzas', 'operaciones', 'equipo', 'competencia'
  ];
  
  const commonTopicsEn = [
    'digital marketing', 'sales', 'automation', 'customers', 'processes', 
    'technology', 'strategy', 'growth', 'optimization', 'innovation',
    'customer experience', 'finance', 'operations', 'team', 'competition'
  ];
  
  const topics = language === 'en' ? commonTopicsEn : commonTopicsEs;
  
  for (const topic of topics) {
    if (userInput.toLowerCase().includes(topic)) {
      return topic;
    }
  }
  
  return language === 'en' ? 'your inquiry' : 'tu consulta';
}