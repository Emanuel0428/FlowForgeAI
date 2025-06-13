import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Brain, X } from 'lucide-react';
import { generateReport } from '../utils/geminiApi';

interface AIAssistantButtonProps {
  fieldKey: string;
  fieldLabel: string;
  currentValue: string;
  userProfile: any;
  onSuggestion: (suggestion: string) => void;
  className?: string;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  fieldKey,
  fieldLabel,
  currentValue,
  userProfile,
  onSuggestion,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPrompt) {
        handleCloseModal();
      }
    };

    if (showPrompt) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showPrompt]);

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };

    if (showPrompt) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPrompt]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showPrompt) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showPrompt]);

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowPrompt(false);
      setUserPrompt('');
      setError('');
    }
  };

  const handleAIAssist = async () => {
    if (!userPrompt.trim()) {
      setError('Por favor, describe qué información necesitas para este campo');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generar sugerencia usando la IA real
      const suggestion = await generateFieldSuggestion(fieldKey, fieldLabel, userPrompt, userProfile);
      onSuggestion(suggestion);
      handleCloseModal();
    } catch (err) {
      console.error('❌ Error generando sugerencia con IA:', err);
      
      // Intentar con fallback inteligente
      try {
        const fallbackSuggestion = generateSmartFallbackSuggestion(fieldKey, fieldLabel, userPrompt, userProfile);
        
        if (fallbackSuggestion && fallbackSuggestion.length > 20) {
          onSuggestion(fallbackSuggestion);
          handleCloseModal();
          console.log('✅ Fallback aplicado exitosamente');
        } else {
          throw new Error('Fallback insuficiente');
        }
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
        setError('No se pudo generar una sugerencia en este momento. Por favor, intenta nuevamente o completa el campo manualmente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPrompt(true)}
        className={`p-2 rounded-xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 hover:from-iridescent-blue/30 hover:to-iridescent-violet/30 border border-iridescent-blue/30 hover:border-iridescent-cyan/50 transition-all duration-300 liquid-button group ${className}`}
        title="Asistente IA - Ayuda a completar este campo"
      >
        <div className="relative">
          <Sparkles className="h-4 w-4 text-iridescent-cyan group-hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-iridescent-cyan rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Modal Portal - RENDERIZADO DIRECTAMENTE EN BODY */}
      {showPrompt && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2147483647, // Z-index máximo posible
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Contenedor del modal */}
          <div 
            ref={modalRef}
            className="relative w-full max-w-4xl max-h-[95vh] bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 212, 255, 0.3)',
              maxWidth: '90vw',
              maxHeight: '95vh',
              minHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header con gradiente decorativo */}
            <div className="relative">
              <div 
                className="absolute top-0 left-0 w-full h-1 rounded-t-[24px]"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #8b5cf6, #06ffa5)'
                }}
              />
              
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-700/50">
                <div className="flex items-center">
                  <div className="p-3 sm:p-4 rounded-2xl mr-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                      Asistente IA Especializado
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-lg">
                      {fieldLabel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="p-3 sm:p-4 rounded-xl transition-all duration-300 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  <X className="h-5 w-5 sm:h-8 sm:w-8" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Context Info */}
              <div className="p-4 sm:p-6 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/30">
                <p className="text-base sm:text-lg text-gray-300 mb-3 sm:mb-4 font-semibold">
                  Contexto de tu negocio:
                </p>
                <div className="text-sm sm:text-base text-gray-400 space-y-2 sm:space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <p>• <span className="text-gray-300 font-medium">Tipo:</span> {userProfile?.business_type || 'No especificado'}</p>
                  <p>• <span className="text-gray-300 font-medium">Etapa:</span> {userProfile?.business_stage || 'No especificado'}</p>
                  <p>• <span className="text-gray-300 font-medium">Equipo:</span> {userProfile?.employee_count || 'No especificado'}</p>
                  <p>• <span className="text-gray-300 font-medium">Objetivo:</span> {userProfile?.main_objective || 'No especificado'}</p>
                </div>
              </div>

              {/* Current Value */}
              {currentValue && (
                <div className="p-4 sm:p-6 rounded-2xl border bg-slate-800/60 border-slate-600/60">
                  <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3 font-semibold">Valor actual:</p>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{currentValue}</p>
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <label className="block text-lg sm:text-xl font-semibold text-gray-200 mb-3 sm:mb-4">
                  Describe tu situación específica:
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder={getFieldSpecificPlaceholder(fieldKey)}
                  rows={6}
                  disabled={isLoading}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none text-base sm:text-lg leading-relaxed disabled:opacity-50 bg-slate-800/60 border border-slate-600/60 focus:border-cyan-500/50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 sm:p-6 rounded-2xl border bg-red-500/10 border-red-500/30">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 mr-3 sm:mr-4 flex-shrink-0" />
                    <p className="text-red-300 text-base sm:text-lg font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* AI Info */}
              <div className="p-4 sm:p-6 rounded-2xl border bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
                <p className="text-sm sm:text-base text-gray-400 flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                  La IA analizará tu contexto específico para generar una respuesta personalizada
                </p>
              </div>
            </div>

            {/* Footer fijo */}
            <div className="border-t border-slate-700/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 border text-gray-300 hover:text-white disabled:opacity-50 text-base sm:text-lg font-medium bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/60 hover:border-slate-500/60"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAIAssist}
                  disabled={isLoading || !userPrompt.trim()}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-emerald-500 hover:to-cyan-500"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                      Analizando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Generar Sugerencia
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Función para generar sugerencias usando la IA real
async function generateFieldSuggestion(
  fieldKey: string, 
  fieldLabel: string, 
  userPrompt: string, 
  userProfile: any
): Promise<string> {
  // Construir contexto empresarial detallado
  const businessContext = buildBusinessContext(userProfile);
  
  // Construir prompt específico para el campo
  const contextPrompt = buildFieldSpecificPrompt(fieldKey, fieldLabel, userPrompt, businessContext);

  try {
    // Crear un objeto de perfil compatible con la función generateReport
    const profileForAPI = {
      businessType: userProfile?.businessType || userProfile?.business_type || 'No especificado',
      revenueModel: userProfile?.revenueModel || userProfile?.revenue_model || 'No especificado',
      businessStage: userProfile?.businessStage || userProfile?.business_stage || 'No especificado',
      mainObjective: userProfile?.mainObjective || userProfile?.main_objective || 'No especificado',
      digitalizationLevel: userProfile?.digitalizationLevel || userProfile?.digitalization_level || 'No especificado',
      employeeCount: userProfile?.employeeCount || userProfile?.employee_count || 'No especificado'
    };

    console.log('🤖 Generando sugerencia para campo:', fieldLabel);
    console.log('📝 Contexto del usuario:', userPrompt);

    // Usar la función de generación directa con un prompt optimizado
    const response = await generateReport(
      profileForAPI,
      'ai-assistant',
      contextPrompt,
      userProfile // Pasar el perfil extendido completo
    );

    // Limpiar y optimizar la respuesta
    const cleanedResponse = cleanAIResponse(response);
    
    // Validar calidad de la respuesta
    if (!validateResponseQuality(cleanedResponse, userPrompt, fieldKey)) {
      console.warn('⚠️ Respuesta de IA de baja calidad, usando fallback');
      throw new Error('Respuesta de IA insuficiente');
    }
    
    console.log('✅ Sugerencia generada exitosamente');
    return cleanedResponse;
  } catch (error) {
    console.error('❌ Error generando sugerencia:', error);
    throw error;
  }
}

// Función para construir contexto empresarial detallado
function buildBusinessContext(userProfile: any): string {
  const businessInfo = {
    type: userProfile?.businessType || userProfile?.business_type || 'No especificado',
    model: userProfile?.revenueModel || userProfile?.revenue_model || 'No especificado',
    stage: userProfile?.businessStage || userProfile?.business_stage || 'No especificado',
    objective: userProfile?.mainObjective || userProfile?.main_objective || 'No especificado',
    digitalization: userProfile?.digitalizationLevel || userProfile?.digitalization_level || 'No especificado',
    team: userProfile?.employeeCount || userProfile?.employee_count || 'No especificado',
    // Información extendida
    name: userProfile?.business_name || userProfile?.businessName || 'tu empresa',
    industry: userProfile?.industry || 'sector no especificado',
    description: userProfile?.business_description || userProfile?.businessDescription || '',
    challenges: userProfile?.current_challenges || userProfile?.currentChallenges || '',
    goals: userProfile?.business_goals || userProfile?.businessGoals || '',
    advantage: userProfile?.competitive_advantage || userProfile?.competitiveAdvantage || '',
    market: userProfile?.target_market || userProfile?.targetMarket || '',
    products: userProfile?.key_products || userProfile?.keyProducts || '',
    revenue: userProfile?.monthly_revenue || userProfile?.monthlyRevenue || '',
    growth: userProfile?.yearly_growth_target || userProfile?.yearlyGrowthTarget || ''
  };

  return `
PERFIL EMPRESARIAL COMPLETO:
• Empresa: ${businessInfo.name}
• Tipo de negocio: ${businessInfo.type}
• Industria: ${businessInfo.industry}
• Modelo de ingresos: ${businessInfo.model}
• Etapa del negocio: ${businessInfo.stage}
• Tamaño del equipo: ${businessInfo.team}
• Nivel de digitalización: ${businessInfo.digitalization}
• Objetivo principal: ${businessInfo.objective}
${businessInfo.description ? `• Descripción: ${businessInfo.description}` : ''}
${businessInfo.challenges ? `• Desafíos actuales: ${businessInfo.challenges}` : ''}
${businessInfo.goals ? `• Objetivos específicos: ${businessInfo.goals}` : ''}
${businessInfo.advantage ? `• Ventaja competitiva: ${businessInfo.advantage}` : ''}
${businessInfo.market ? `• Mercado objetivo: ${businessInfo.market}` : ''}
${businessInfo.products ? `• Productos/servicios: ${businessInfo.products}` : ''}
${businessInfo.revenue ? `• Ingresos mensuales: ${businessInfo.revenue}` : ''}
${businessInfo.growth ? `• Meta de crecimiento: ${businessInfo.growth}` : ''}`;
}

// Función para construir prompt específico por campo
function buildFieldSpecificPrompt(
  fieldKey: string,
  fieldLabel: string,
  userPrompt: string,
  businessContext: string
): string {
  // Instrucciones específicas por tipo de campo
  const fieldInstructions = getFieldSpecificInstructions(fieldKey, fieldLabel);
  
  return `Eres un consultor empresarial experto con 15+ años de experiencia ayudando a empresas a optimizar sus perfiles y estrategias de negocio.

${businessContext}

CAMPO A COMPLETAR: "${fieldLabel}"
SITUACIÓN ESPECÍFICA DEL USUARIO: "${userPrompt}"

${fieldInstructions}

INSTRUCCIONES CRÍTICAS:
1. Responde ÚNICAMENTE con el contenido para el campo "${fieldLabel}"
2. Usa información específica del perfil empresarial proporcionado
3. Integra la situación específica descrita por el usuario
4. Sé práctico y aplicable, no genérico
5. Máximo 150 palabras, texto directo sin formato markdown
6. Enfócate en valor empresarial concreto

RESPUESTA DIRECTA:`;
}

// Instrucciones específicas por campo
function getFieldSpecificInstructions(fieldKey: string, fieldLabel: string): string {
  const instructions: Record<string, string> = {
    businessName: `
CONTEXTO: Necesitas sugerir un nombre comercial profesional.
ENFOQUE: Considera la industria, mercado objetivo, y propuesta de valor única.
ELEMENTOS: Debe ser memorable, profesional, y reflejar la naturaleza del negocio.`,

    businessDescription: `
CONTEXTO: Descripción comercial para presentaciones y perfiles empresariales.
ENFOQUE: Explica QUÉ hace la empresa, CÓMO lo hace, y PARA QUIÉN.
ELEMENTOS: Problema que resuelve, solución que ofrece, mercado al que sirve.`,

    industry: `
CONTEXTO: Categorización industrial precisa para benchmarking y estrategia.
ENFOQUE: Identifica el sector específico y nicho de mercado.
ELEMENTOS: Sector principal, subsector, y especialización si aplica.`,

    targetMarket: `
CONTEXTO: Definición de mercado objetivo para enfocar estrategias comerciales.
ENFOQUE: Segmentación demográfica, psicográfica, y comportamental.
ELEMENTOS: Tipo de clientes, tamaño de empresas, características específicas.`,

    businessGoals: `
CONTEXTO: Objetivos empresariales SMART para los próximos 12-18 meses.
ENFOQUE: Metas específicas, medibles, alcanzables y con tiempo definido.
ELEMENTOS: Crecimiento, expansión, optimización, y métricas clave.`,

    currentChallenges: `
CONTEXTO: Identificación de obstáculos principales que limitan el crecimiento.
ENFOQUE: Problemas operativos, estratégicos, y de mercado más críticos.
ELEMENTOS: Desafíos internos, externos, y de recursos o capacidades.`,

    competitiveAdvantage: `
CONTEXTO: Diferenciadores únicos que proporcionan ventaja competitiva sostenible.
ENFOQUE: Qué hace única a la empresa vs. competencia directa.
ELEMENTOS: Propuesta de valor, capacidades únicas, barreras de entrada.`,

    keyProducts: `
CONTEXTO: Productos/servicios principales que generan la mayor parte de ingresos.
ENFOQUE: Portafolio de ofertas core con valor agregado específico.
ELEMENTOS: Descripción de productos, beneficios clave, diferenciación.`,

    mainCustomers: `
CONTEXTO: Perfil detallado de los clientes más valiosos y representativos.
ENFOQUE: Características demográficas, necesidades, comportamiento de compra.
ELEMENTOS: Tipo de cliente, tamaño, industria, ubicación geográfica.`,

    teamStructure: `
CONTEXTO: Organización del equipo de trabajo y distribución de responsabilidades.
ENFOQUE: Roles clave, jerarquía, especialización, y dinámicas de colaboración.
ELEMENTOS: Estructura organizacional, perfiles profesionales, reportes.`,

    technologyStack: `
CONTEXTO: Herramientas y tecnologías utilizadas en operaciones diarias.
ENFOQUE: Software, plataformas, y sistemas que impulsan productividad.
ELEMENTOS: Herramientas operativas, sistemas de gestión, tecnologías core.`,

    salesProcess: `
CONTEXTO: Proceso sistemático desde prospección hasta cierre de ventas.
ENFOQUE: Metodología de ventas, etapas, herramientas, y métricas.
ELEMENTOS: Lead generation, calificación, negociación, cierre.`,

    marketingChannels: `
CONTEXTO: Canales y estrategias para adquisición y retención de clientes.
ENFOQUE: Mix de marketing digital y tradicional más efectivo.
ELEMENTOS: Canales primarios, secundarios, presupuesto, y ROI esperado.`,

    monthlyRevenue: `
CONTEXTO: Estimación de ingresos mensuales recurrentes o promedio.
ENFOQUE: Rango realista basado en tamaño, mercado, y modelo de negocio.
ELEMENTOS: Ingresos actuales, tendencias, estacionalidad.`,

    yearlyGrowthTarget: `
CONTEXTO: Meta de crecimiento anual en ingresos, clientes, o mercado.
ENFOQUE: Objetivos ambiciosos pero alcanzables basados en capacidades.
ELEMENTOS: Porcentaje de crecimiento, métricas específicas, timeline.`,

    budgetRange: `
CONTEXTO: Rango de presupuesto disponible para inversiones y operaciones.
ENFOQUE: Capacidad de inversión en marketing, tecnología, y crecimiento.
ELEMENTOS: Presupuesto mensual/anual, áreas de inversión prioritarias.`,

    successMetrics: `
CONTEXTO: KPIs y métricas clave para medir éxito y progreso empresarial.
ENFOQUE: Indicadores financieros, operativos, y de satisfacción del cliente.
ELEMENTOS: Métricas cuantitativas y cualitativas, frecuencia de medición.`,

    geographicScope: `
CONTEXTO: Alcance geográfico actual y potencial de expansión.
ENFOQUE: Mercados servidos, limitaciones geográficas, oportunidades.
ELEMENTOS: Cobertura actual, planes de expansión, limitaciones logísticas.`,

    businessModel: `
CONTEXTO: Modelo detallado de generación de ingresos y creación de valor.
ENFOQUE: Cómo monetiza la propuesta de valor y estructura de costos.
ELEMENTOS: Fuentes de ingreso, estructura de precios, modelo operativo.`,

    timeframe: `
CONTEXTO: Horizonte temporal para objetivos estratégicos y operativos.
ENFOQUE: Plazos realistas para metas de corto, mediano, y largo plazo.
ELEMENTOS: Milestones específicos, timeline de implementación.`
  };

  return instructions[fieldKey] || `
CONTEXTO: Proporciona información específica y relevante para "${fieldLabel}".
ENFOQUE: Considera el contexto empresarial y la situación particular.
ELEMENTOS: Información práctica y aplicable al negocio específico.`;
}

// Función mejorada para limpiar la respuesta de la IA
function cleanAIResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    return 'No se pudo generar una sugerencia. Por favor, intenta nuevamente.';
  }

  // Remover formateo markdown y elementos innecesarios
  let cleaned = response
    .replace(/^#+\s*/gm, '') // Headers markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Italic markdown
    .replace(/^\s*[-*•]\s*/gm, '') // Bullets
    .replace(/^\d+\.\s*/gm, '') // Números de lista
    .replace(/^>\s*/gm, '') // Blockquotes
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\n{3,}/g, '\n\n') // Múltiples saltos de línea
    .trim();

  // Remover frases comunes de la IA que no aportan valor
  const phrasesToRemove = [
    /^(Basándome en|Considerando|Tomando en cuenta|Según|De acuerdo con).*?[:,]/i,
    /^(Respuesta|Sugerencia|Recomendación)[:]/i,
    /^(Para el campo|En cuanto a|Respecto a).*?[:,]/i,
    /(Espero que esto|Esto debería|Esto te|Esta información).*$/i
  ];

  phrasesToRemove.forEach(phrase => {
    cleaned = cleaned.replace(phrase, '');
  });

  // Limpiar espacios extras y saltos de línea
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  // Limitar a aproximadamente 150 palabras
  const words = cleaned.split(' ');
  if (words.length > 150) {
    cleaned = words.slice(0, 150).join(' ') + '...';
  }

  // Si la respuesta es muy corta o vacía, usar fallback
  if (cleaned.length < 20) {
    return 'No se pudo generar una sugerencia específica. Por favor, proporciona más detalles sobre tu situación.';
  }

  return cleaned;
}

// Función para validar la calidad de la respuesta generada
function validateResponseQuality(response: string, userPrompt: string, fieldKey: string): boolean {
  // Verificaciones básicas
  if (!response || response.length < 15) return false;
  if (response.includes('No se pudo generar')) return false;
  
  // Verificar que no sea demasiado genérica
  const genericPhrases = [
    'información específica',
    'adaptada al perfil',
    'contexto empresarial',
    'perfil de empresa'
  ];
  
  const hasGenericContent = genericPhrases.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
  
  // Si es muy genérica y corta, rechazar
  if (hasGenericContent && response.length < 50) return false;
  
  // Para ciertos campos críticos, requerir mayor especificidad
  const criticalFields = ['businessName', 'businessDescription', 'keyProducts', 'competitiveAdvantage'];
  if (criticalFields.includes(fieldKey)) {
    // Verificar que contenga elementos del prompt del usuario
    const promptWords = userPrompt.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const responseWords = response.toLowerCase();
    
    const containsUserContext = promptWords.some(word => responseWords.includes(word));
    if (!containsUserContext && response.length < 80) return false;
  }
  
  return true;
}

// Función de fallback mejorada con lógica contextual
function generateSmartFallbackSuggestion(
  fieldKey: string, 
  fieldLabel: string, 
  userPrompt: string, 
  userProfile: any
): string {
  const businessType = userProfile?.business_type || '';
  const businessStage = userProfile?.business_stage || '';
  const employeeCount = userProfile?.employee_count || '';
  const mainObjective = userProfile?.main_objective || '';

  // Respuestas contextuales específicas por campo
  const contextualResponses: Record<string, (prompt: string) => string> = {
    teamStructure: (prompt: string) => {
      if (prompt.toLowerCase().includes('hermano') && prompt.toLowerCase().includes('tecnolog')) {
        if (employeeCount === '1-5') {
          return `Estructura de equipo fundacional: Socios fundadores con roles complementarios - uno enfocado en desarrollo tecnológico, arquitectura de sistemas y infraestructura técnica, y el otro especializado en marketing digital, ventas y relaciones con clientes. Esta división permite cobertura completa de las áreas críticas del negocio mientras mantenemos agilidad en la toma de decisiones. Ambos participan en estrategia general y planificación del crecimiento.`;
        }
      }
      
      if (businessStage === 'startup-temprano') {
        return `Estructura ágil y multifuncional: ${prompt}. Equipo pequeño donde cada miembro tiene múltiples responsabilidades, con roles que evolucionan según las necesidades del negocio. Enfoque en colaboración directa y comunicación fluida para maximizar la eficiencia y adaptabilidad.`;
      }
      
      return `Estructura organizacional: ${prompt}. Diseñada para ${mainObjective || 'optimizar la eficiencia'} con roles claramente definidos pero flexibles según las necesidades del negocio.`;
    },

    businessDescription: (prompt: string) => {
      return `Somos una empresa ${businessType} en etapa ${businessStage} especializada en ${prompt}. Nuestro enfoque se centra en ${mainObjective || 'crear valor para nuestros clientes'} mediante soluciones innovadoras y un servicio excepcional que nos diferencia en el mercado.`;
    },

    targetMarket: (prompt: string) => {
      return `Nuestro mercado objetivo incluye ${prompt}. Nos enfocamos en ${businessType === 'b2b' ? 'empresas' : 'consumidores'} que buscan ${mainObjective || 'soluciones efectivas'} y valoran la calidad y la innovación en los productos/servicios que adquieren.`;
    },

    businessGoals: (prompt: string) => {
      const timeframe = businessStage === 'startup-temprano' ? '6-12 meses' : '12-18 meses';
      return `Objetivos estratégicos para los próximos ${timeframe}: ${prompt}. Además, buscamos consolidar nuestra posición en el mercado, optimizar nuestros procesos operativos y establecer bases sólidas para el crecimiento sostenible.`;
    },

    currentChallenges: (prompt: string) => {
      return `Principales desafíos actuales: ${prompt}. Como empresa en etapa ${businessStage}, también enfrentamos retos típicos de ${businessType === 'startup-temprano' ? 'validación de mercado y escalamiento' : 'optimización y crecimiento'} que requieren atención estratégica.`;
    },

    competitiveAdvantage: (prompt: string) => {
      return `Nuestra ventaja competitiva se fundamenta en: ${prompt}. Esto, combinado con nuestro enfoque en ${mainObjective || 'la excelencia'} y la agilidad propia de una empresa ${businessStage}, nos permite diferenciarnos significativamente en el mercado.`;
    },

    keyProducts: (prompt: string) => {
      return `Productos/servicios principales: ${prompt}. Diseñados específicamente para ${businessType === 'b2b' ? 'empresas' : 'el mercado'} que buscan ${mainObjective || 'soluciones efectivas'}, con un enfoque en calidad, innovación y resultados medibles.`;
    },

    technologyStack: (prompt: string) => {
      const techLevel = userProfile?.digitalization_level || 'medio-herramientas';
      const techDescription = techLevel === 'alto-automatizado' ? 'avanzadas y automatizadas' : 'modernas y eficientes';
      return `Stack tecnológico: ${prompt}. Utilizamos herramientas ${techDescription} que nos permiten mantener la eficiencia operativa y escalar según las necesidades del negocio.`;
    },

    successMetrics: (prompt: string) => {
      return `Métricas de éxito: ${prompt}. También monitoreamos indicadores clave como satisfacción del cliente, eficiencia operativa, crecimiento de ingresos y cumplimiento de objetivos estratégicos para asegurar el progreso hacia nuestras metas.`;
    }
  };

  const responseGenerator = contextualResponses[fieldKey];
  if (responseGenerator) {
    return responseGenerator(userPrompt);
  }

  // Respuesta genérica mejorada contextualizada
  if (userPrompt && userPrompt.length > 10) {
    return `${userPrompt}. Como empresa ${businessType} en etapa ${businessStage} con un equipo de ${employeeCount}, esta información es clave para ${mainObjective || 'alcanzar nuestros objetivos de crecimiento'} y se integra estratégicamente con nuestro perfil empresarial actual.`;
  }
  
  // Fallback básico si no hay suficiente contexto
  return `Información específica para ${fieldLabel} adaptada al perfil de empresa ${businessType} en etapa ${businessStage}, con enfoque en ${mainObjective || 'optimización y crecimiento empresarial'}.`;
}

// Placeholders específicos por campo
function getFieldSpecificPlaceholder(fieldKey: string): string {
  const placeholders: Record<string, string> = {
    teamStructure: 'Ej: "En mi equipo somos mi hermano y yo, yo siendo el tecnológico y él de marketing" o "Tenemos 5 personas: 2 desarrolladores, 1 diseñador, 1 comercial y yo como CEO"',
    businessDescription: 'Ej: "Desarrollamos software para restaurantes" o "Ofrecemos consultoría en marketing digital para pymes"',
    targetMarket: 'Ej: "Restaurantes pequeños y medianos que quieren digitalizar sus operaciones" o "Empresas de 10-50 empleados que necesitan mejorar su presencia online"',
    businessGoals: 'Ej: "Queremos llegar a 100 clientes en 6 meses" o "Expandirnos a 3 ciudades nuevas este año"',
    currentChallenges: 'Ej: "Nos cuesta conseguir clientes nuevos" o "Tenemos problemas para escalar nuestros procesos"',
    competitiveAdvantage: 'Ej: "Somos los únicos que ofrecemos integración completa" o "Nuestro servicio al cliente es excepcional"',
    keyProducts: 'Ej: "Sistema de gestión de inventarios y punto de venta" o "Campañas de marketing digital y gestión de redes sociales"',
    technologyStack: 'Ej: "React, Node.js, PostgreSQL, AWS" o "WordPress, Google Analytics, Mailchimp, Zoom"',
    successMetrics: 'Ej: "Número de clientes activos, ingresos mensuales recurrentes, NPS" o "Conversión de leads, tiempo de respuesta, satisfacción del cliente"',
    industry: 'Ej: "Tecnología para restaurantes" o "Marketing digital para pymes"',
    monthlyRevenue: 'Ej: "Entre $5,000 y $15,000 mensuales" o "Aproximadamente $50,000 al mes"',
    yearlyGrowthTarget: 'Ej: "Duplicar nuestros ingresos" o "Crecer 150% en número de clientes"',
    businessName: 'Ej: "TechStart Solutions" o "Marketing Pro Agency"',
    mainCustomers: 'Ej: "Restaurantes familiares de 20-100 mesas" o "Empresas B2B de tecnología con 10-50 empleados"',
    geographicScope: 'Ej: "Principalmente en Ciudad de México y área metropolitana" o "A nivel nacional con enfoque en ciudades principales"',
    marketingChannels: 'Ej: "Google Ads, Facebook, LinkedIn, email marketing" o "Referidos, networking, contenido en redes sociales"',
    salesProcess: 'Ej: "Lead qualification, demo del producto, propuesta personalizada, cierre" o "Consulta inicial, diagnóstico, propuesta, implementación"',
    budgetRange: 'Ej: "$5,000-10,000 mensuales para marketing" o "$20,000-50,000 anuales para tecnología"',
    timeframe: 'Ej: "Objetivos para los próximos 12 meses" o "Plan estratégico a 2-3 años"',
    businessModel: 'Ej: "SaaS con suscripción mensual + setup fee" o "Servicios de consultoría con retainer mensual + proyectos"'
  };

  return placeholders[fieldKey] || 'Describe tu situación específica para este campo...';
}

export default AIAssistantButton;