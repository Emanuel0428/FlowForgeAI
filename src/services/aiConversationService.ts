import { UserProfileData } from '../types';
import { genAI, modelConfig, isGeminiAvailable } from '../config/gemini';
import { businessModules } from '../data/modules';

interface ConversationContext {
  userProfile: UserProfileData;
  userEmail: string;
  userName: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  userInput: string,
  conversationHistory: ConversationMessage[],
  context: ConversationContext
): Promise<string> {
  if (!isGeminiAvailable || !genAI) {
    return generateFallbackResponse(userInput, context);
  }

  try {
    // Construir el contexto para Gemini
    const contextPrompt = buildConversationPrompt(userInput, conversationHistory, context);
    
    // Generar respuesta con Gemini
    const model = genAI.getGenerativeModel(modelConfig);
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Verificar que la respuesta sea válida
    if (!text || text.trim().length < 10) {
      throw new Error('Respuesta de Gemini demasiado corta o vacía');
    }
    
    return text;
  } catch (error) {
    console.error('Error al generar respuesta con Gemini:', error);
    return generateFallbackResponse(userInput, context);
  }
}

function buildConversationPrompt(
  userInput: string,
  conversationHistory: ConversationMessage[],
  context: ConversationContext
): string {
  const { userProfile, userEmail, userName } = context;
  
  // Construir información sobre los módulos disponibles
  const modulesInfo = businessModules.map(module => 
    `- ${module.id}: ${module.name} - ${module.description}`
  ).join('\n');
  
  // Construir historial de conversación
  const historyText = conversationHistory
    .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
    .join('\n');
  
  // Construir prompt completo
  return `
    Eres un asistente de IA para FlowForge AI, una plataforma de consultoría empresarial con inteligencia artificial.
    
    Información del usuario:
    - Nombre: ${userName}
    - Email: ${userEmail}
    - Tipo de negocio: ${userProfile.businessType}
    - Modelo de ingresos: ${userProfile.revenueModel}
    - Etapa del negocio: ${userProfile.businessStage}
    - Objetivo principal: ${userProfile.mainObjective}
    - Nivel de digitalización: ${userProfile.digitalizationLevel}
    - Número de empleados: ${userProfile.employeeCount}
    
    Módulos disponibles:
    ${modulesInfo}
    
    INSTRUCCIONES IMPORTANTES:
    1. Responde en ESPAÑOL de forma útil, profesional y concisa.
    2. Si preguntan sobre los módulos, proporciona información relevante y sugiere cuáles serían más útiles según su perfil.
    3. Si preguntan sobre recomendaciones para su negocio, basa tus respuestas en su perfil.
    4. Mantén tus respuestas breves (máximo 3-4 párrafos) pero informativas, con un tono conversacional.
    5. Si te preguntan sobre cómo funciona FlowForge AI, explica que es una plataforma de consultoría empresarial con IA.
    6. Si te preguntan sobre algo que no sabes, admite que no tienes esa información en lugar de inventar.
    7. Usa emojis ocasionalmente para hacer la conversación más amigable.
    
    Historial de conversación:
    ${historyText}
    
    Usuario: ${userInput}
    
    Asistente:
  `;
}

function generateFallbackResponse(userInput: string, context: ConversationContext): string {
  const { userProfile, userName } = context;
  const inputLower = userInput.toLowerCase();
  
  // Respuestas para preguntas sobre módulos
  if (inputLower.includes('módulo') || inputLower.includes('modulo') || 
      inputLower.includes('análisis') || inputLower.includes('analisis')) {
    return `Tenemos varios módulos de análisis disponibles para tu negocio ${userProfile.businessType}. Algunos de los más populares son: Análisis de Mercado, Plan de Marketing Digital, Optimización de Procesos y Estrategia de Crecimiento. ¿Te gustaría saber más sobre alguno en particular?`;
  }
  
  // Respuestas para preguntas sobre el negocio
  if (inputLower.includes('negocio') || inputLower.includes('empresa') || 
      inputLower.includes('recomendación') || inputLower.includes('recomendacion')) {
    return `Basado en tu perfil de ${userProfile.businessType} en etapa ${userProfile.businessStage}, te recomendaría enfocarte en ${userProfile.mainObjective}. Esto te ayudará a alcanzar tus objetivos de negocio de manera más efectiva.`;
  }
  
  // Respuestas para preguntas sobre la plataforma
  if (inputLower.includes('flowforge') || inputLower.includes('plataforma') || 
      inputLower.includes('funciona') || inputLower.includes('hace')) {
    return `FlowForge AI es una plataforma de consultoría empresarial potenciada por inteligencia artificial. Te ayudamos a analizar tu negocio, identificar oportunidades y desarrollar estrategias personalizadas para ${userProfile.businessType} como el tuyo.`;
  }
  
  // Respuesta para saludos
  if (inputLower.includes('hola') || inputLower.includes('buenos días') || 
      inputLower.includes('buenas tardes') || inputLower.includes('buenas noches')) {
    return `¡Hola ${userName}! ¿En qué puedo ayudarte hoy con tu negocio ${userProfile.businessType}?`;
  }
  
  // Respuesta genérica
  return `Gracias por tu pregunta. Como asistente de FlowForge AI, estoy aquí para ayudarte con tu negocio ${userProfile.businessType}. ¿Hay algún aspecto específico sobre el que te gustaría obtener información o análisis?`;
} 