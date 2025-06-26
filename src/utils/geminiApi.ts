import { UserProfileData } from '../types';
import { genAI, modelConfig, isGeminiAvailable } from '../config/gemini';
import { modulePrompts } from '../data/modulePrompts';
import { businessModules } from '../data/modules';

export async function generateReport(
  profile: UserProfileData,
  moduleId: string,
  moduleInput: string,
  extendedProfile?: any
): Promise<string> {

  if (!isGeminiAvailable) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return generateEnhancedMockReport(profile, moduleId, moduleInput, extendedProfile);
  }

  try {
    const model = genAI!.getGenerativeModel(modelConfig);
    const prompt = buildAdvancedPrompt(profile, moduleId, moduleInput, extendedProfile);
        
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length < 100) {
      throw new Error('Respuesta de Gemini demasiado corta o vacía');
    }
    
    return text;
    
  } catch (error) {
    console.error('❌ Error al generar reporte con Gemini:', error);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return generateEnhancedMockReport(profile, moduleId, moduleInput, extendedProfile);
  }
}

function buildAdvancedPrompt(
  profile: UserProfileData,
  moduleId: string,
  moduleInput: string,
  extendedProfile?: any
): string {
  const moduleConfig = modulePrompts[moduleId];
  const moduleName = getModuleName(moduleId);
  
  if (!moduleConfig) {
    throw new Error(`Configuración no encontrada para el módulo: ${moduleId}`);
  }

  // Obtener prompts contextuales específicos
  const contextualPrompt = getContextualPrompt(moduleConfig, profile);
  const industryPrompt = getIndustrySpecificPrompt(moduleConfig, profile);
  const maturityPrompt = getMaturityLevelPrompt(moduleConfig, profile);
  
  // Construir información extendida del perfil
  const extendedProfileInfo = buildExtendedProfileContext(extendedProfile);
  
  const prompt = `${moduleConfig.systemPrompt}

---
**PERFIL EMPRESARIAL BÁSICO:**
- Tipo de Negocio: ${profile.businessType}
- Modelo de Ingresos: ${profile.revenueModel}
- Etapa del Negocio: ${profile.businessStage}
- Objetivo Principal: ${profile.mainObjective}
- Nivel de Digitalización: ${profile.digitalizationLevel}
- Tamaño del Equipo: ${profile.employeeCount}

---
**INFORMACIÓN DETALLADA DEL NEGOCIO:**
${extendedProfileInfo}

---
**CONTEXTO ESTRATÉGICO:**
${contextualPrompt}

**CONTEXTO INDUSTRIAL:**
${industryPrompt}

**CONTEXTO DE MADUREZ DIGITAL:**
${maturityPrompt}

---
**DESAFÍO/NECESIDAD ESPECÍFICA:**
"${moduleInput}"

---
**FRAMEWORK DE ANÁLISIS PROFESIONAL:**
${moduleConfig.analysisFramework.map((item, index) => `${index + 1}. ${item}`).join('\n')}

---
**ENTREGABLES ESPERADOS:**
${moduleConfig.deliverables.map((item, index) => `${index + 1}. ${item}`).join('\n')}

---
**KPIs Y MÉTRICAS CLAVE:**
${moduleConfig.kpiCategories.join(', ')}

---
**FUENTES PROFESIONALES DE REFERENCIA:**
${moduleConfig.professionalSources.join('\n- ')}

---
**BENCHMARKS DE INDUSTRIA:**
${JSON.stringify(moduleConfig.benchmarkData, null, 2)}

---
**INSTRUCCIONES CRÍTICAS PARA REPORTE EN ESPAÑOL:**

🇪🇸 INSTRUCCIONES CRÍTICAS DE IDIOMA: 
- TODO el contenido DEBE estar 100% EN ESPAÑOL
- NO usar términos en inglés (excepto nombres propios como "McKinsey", "BCG", "Google Analytics", etc.)
- Usar terminología empresarial profesional EN ESPAÑOL
- Incluir emojis relevantes para mejorar la legibilidad
- Formato markdown profesional con estructura clara

🔤 INSTRUCCIONES ESPECÍFICAS PARA PRESENTACIÓN DE DATOS:
- NO USES TABLAS MARKDOWN TRADICIONALES para presentar datos comparativos o métricas
- En su lugar, utiliza LISTAS ESTRUCTURADAS con encabezados claros para cada sección
- Usa el siguiente formato para presentar datos comparativos:

### Nombre del Elemento/Categoría
- **Atributo 1:** Valor 1
- **Atributo 2:** Valor 2
- **Atributo 3:** Valor 3

- Organiza la información en secciones con encabezados de nivel 3 (###) para cada elemento
- Usa negritas (**) para destacar las etiquetas de los atributos
- Mantén un formato consistente en todas las secciones similares
- Este formato mejora la legibilidad visual y es más estético en la presentación final
- Para comparativas, benchmarking y métricas usa SIEMPRE este formato de listas estructuradas

Genera un reporte ejecutivo de consultoría de nivel McKinsey/BCG COMPLETAMENTE EN ESPAÑOL con la siguiente estructura optimizada:

# 📊 Análisis Estratégico: ${moduleName}

## 🎯 Resumen Ejecutivo
[Síntesis ejecutiva de 3-4 párrafos EN ESPAÑOL con hallazgos clave, recomendaciones estratégicas, y ROI esperado. Incluye métricas específicas del benchmarking. PERSONALIZA con la información específica del negocio: ${extendedProfile?.business_name || 'la empresa'}, ${extendedProfile?.industry || 'su industria'}, etc. INCLUYE DATOS NUMÉRICOS ESPECÍFICOS sobre el impacto esperado en ingresos, costos o eficiencia.]

## 📈 Análisis Situacional y Benchmarking
### Evaluación del Estado Actual
[Análisis detallado EN ESPAÑOL usando benchmarks específicos de industria. INCORPORA información específica como: ${extendedProfile?.current_challenges || 'desafíos identificados'}, ${extendedProfile?.competitive_advantage || 'ventajas competitivas'}, ${extendedProfile?.technology_stack || 'stack tecnológico actual'}. INCLUYE COMPARATIVA CUANTITATIVA con empresas similares en la misma industria y etapa de desarrollo.]

### Benchmarking por Área Clave
[UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para presentar el benchmarking por área clave. Para cada área clave, usa un encabezado de nivel 3 y lista los atributos con sus valores. Por ejemplo:

### Atención Cliente
- **Métrica:** Tiempo Respuesta
- **Valor Actual:** 24 horas
- **Benchmark de Industria:** 4-8 horas
- **Brecha:** 16-20 horas

ASEGÚRATE de incluir 4-6 áreas clave relevantes para ${extendedProfile?.business_name || 'la empresa'} y su industria.]

### Inteligencia Competitiva
[Análisis competitivo EN ESPAÑOL considerando ${extendedProfile?.geographic_scope || 'alcance geográfico'} y ${extendedProfile?.target_market || 'mercado objetivo'}. IDENTIFICA 3-5 COMPETIDORES RELEVANTES específicos para esta industria y tamaño de empresa, con sus fortalezas y debilidades.]

### Análisis de Brechas con Benchmarks
[Identificación de brechas EN ESPAÑOL vs. mejores prácticas, considerando ${extendedProfile?.success_metrics || 'métricas de éxito actuales'}. CUANTIFICA LA BRECHA en términos porcentuales o absolutos para cada área clave.]

## 🚀 Recomendaciones Estratégicas (Basadas en ${moduleConfig.professionalSources[0]})
### Prioridad 1: [Iniciativa de Alto Impacto]
- **Caso de Negocio:** [ROI proyectado EN ESPAÑOL con benchmarks específicos para ${extendedProfile?.business_name || 'su empresa'}. INCLUYE CIFRAS CONCRETAS de inversión necesaria y retorno esperado.]
- **Implementación:** [Pasos específicos EN ESPAÑOL considerando ${extendedProfile?.team_structure || 'estructura del equipo'} y ${extendedProfile?.budget_range || 'presupuesto disponible'}. INCLUYE TIMELINE DETALLADO con hitos claros y recursos necesarios.]
- **Métricas de Éxito:** [KPIs cuantificables EN ESPAÑOL alineados con ${extendedProfile?.business_goals || 'objetivos del negocio'}. ESTABLECE VALORES BASE actuales y TARGETS ESPECÍFICOS a alcanzar.]
- **Herramientas Recomendadas:** [Lista de 3-5 herramientas o tecnologías ESPECÍFICAS y RELEVANTES para esta iniciativa, considerando el tamaño de la empresa y presupuesto. INCLUYE opciones gratuitas/económicas y premium.]

### Prioridad 2: [Iniciativa de Mediano Impacto]
- **Caso de Negocio:** [ROI proyectado EN ESPAÑOL considerando ${extendedProfile?.monthly_revenue || 'ingresos actuales'}. INCLUYE PERÍODO DE RECUPERACIÓN DE INVERSIÓN específico.]
- **Implementación:** [Metodología EN ESPAÑOL adaptada a ${extendedProfile?.digitalization_level || 'nivel de digitalización'}. INCLUYE CONSIDERACIONES ESPECÍFICAS para la capacidad técnica actual del equipo.]
- **Métricas de Éxito:** [KPIs EN ESPAÑOL específicos para ${extendedProfile?.key_products || 'productos/servicios principales'}. ESTABLECE FRECUENCIA DE MEDICIÓN y RESPONSABLES recomendados.]
- **Herramientas Recomendadas:** [Lista de 2-3 herramientas o tecnologías ESPECÍFICAS y RELEVANTES para esta iniciativa, con RANGOS DE PRECIOS aproximados.]

### Prioridad 3: [Iniciativa de Soporte]
- **Caso de Negocio:** [Justificación EN ESPAÑOL considerando ${extendedProfile?.timeframe || 'marco temporal'}. CUANTIFICA BENEFICIOS INDIRECTOS como mejora en satisfacción de clientes o empleados.]
- **Implementación:** [Enfoque EN ESPAÑOL basado en ${extendedProfile?.sales_process || 'proceso de ventas actual'}. IDENTIFICA DEPENDENCIAS con otras iniciativas o sistemas.]
- **Métricas de Éxito:** [KPIs EN ESPAÑOL para ${extendedProfile?.marketing_channels || 'canales de marketing'}. ESTABLECE SISTEMA DE ALERTA TEMPRANA para identificar desviaciones.]
- **Herramientas Recomendadas:** [Lista de 1-2 herramientas o tecnologías ESPECÍFICAS y RELEVANTES para esta iniciativa, incluyendo alternativas gratuitas si es apropiado.]

## 🛠️ Hoja de Ruta de Implementación
### Fase 1: Fundación (Semanas 1-8)
[Quick wins EN ESPAÑOL específicos para ${extendedProfile?.business_name || 'su empresa'} considerando ${extendedProfile?.current_challenges || 'desafíos actuales'}. INCLUYE ACCIONES CONCRETAS que pueden implementarse en 48 horas, 1 semana y 1 mes.]

### Fase 2: Implementación Principal (Semanas 9-20)
[Implementación EN ESPAÑOL usando mejores prácticas adaptadas a ${extendedProfile?.industry || 'su industria'}. ESPECIFICA RECURSOS NECESARIOS en términos de tiempo, personal y presupuesto.]

### Fase 3: Optimización (Semanas 21-32)
[Optimización EN ESPAÑOL con benchmarks específicos para ${extendedProfile?.target_market || 'su mercado objetivo'}. INCLUYE MECANISMOS DE FEEDBACK y ajuste continuo.]

### Fase 4: Capacidades Avanzadas (Semanas 33-52)
[Capacidades avanzadas EN ESPAÑOL alineadas con ${extendedProfile?.yearly_growth_target || 'objetivos de crecimiento'}. DETALLA CÓMO ESCALAR las iniciativas exitosas y ABANDONAR las que no muestren resultados.]

## 📊 Métricas de Éxito y Benchmarks de Industria
### KPIs Primarios
[PRESENTA EN FORMATO DE LISTAS ESTRUCTURADAS las métricas principales con targets específicos para ${extendedProfile?.business_model || 'modelo de negocio'}. Para cada KPI, usa un encabezado de nivel 3 y lista sus atributos. Por ejemplo:

### Tasa de Conversión
- **Fórmula:** Ventas/Leads
- **Valor Actual:** 2.5%
- **Target:** 4-5%
- **Frecuencia:** Semanal

INCLUYE FÓRMULAS DE CÁLCULO para cada KPI y FRECUENCIA DE MEDICIÓN recomendada.]

### 🏆 Análisis Comparativo con Líderes de Industria
[Comparación detallada EN ESPAÑOL con empresas líderes del sector, considerando específicamente ${extendedProfile?.competitive_advantage || 'las ventajas competitivas únicas'} de ${extendedProfile?.business_name || 'su empresa'} y cómo estas se posicionan frente a los competidores principales en ${extendedProfile?.geographic_scope || 'su mercado objetivo'}. INCLUYE DATOS CUANTITATIVOS de benchmarking por cada área clave. UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para presentar cada área de comparación.]

## 💰 Análisis Integral de Impacto Financiero

### 💵 Desglose Detallado de Inversión Requerida
[PRESENTA EN FORMATO DE LISTAS ESTRUCTURADAS el análisis minucioso EN ESPAÑOL de la inversión necesaria, desglosada por categorías. Por ejemplo:

### Tecnología
- **Descripción:** Plataforma CRM y automatización
- **Inversión Estimada:** $X,XXX - $Y,YYY
- **Plazo:** Mes 1-3

INCLUYE OPCIONES DE INVERSIÓN ESCALONADA para diferentes niveles de presupuesto.]

### 📈 Proyección Detallada de Impacto en Ingresos
[Proyección exhaustiva EN ESPAÑOL basada en ${extendedProfile?.monthly_revenue || 'los ingresos actuales'}, ${extendedProfile?.yearly_growth_target || 'los objetivos de crecimiento establecidos'}, y el potencial de mejora identificado en ${extendedProfile?.target_market || 'su mercado objetivo'}. PRESENTA ESCENARIOS CONSERVADOR, ESPERADO Y OPTIMISTA con probabilidades asociadas. UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para cada escenario.]

### 🎯 Cálculo Específico de ROI con Benchmarks Sectoriales
[Cálculo detallado y personalizado EN ESPAÑOL del retorno de inversión proyectado específicamente para ${extendedProfile?.business_name || 'su empresa'}, incluyendo comparativas con benchmarks de industria en ${extendedProfile?.industry || 'su sector'} y análisis de sensibilidad según diferentes escenarios. INCLUYE PERÍODO DE RECUPERACIÓN DE LA INVERSIÓN y TASA INTERNA DE RETORNO estimada. UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para presentar los datos por período.]

## ⚠️ Evaluación de Riesgos y Mitigación
### Factores de Alto Riesgo
[PRESENTA EN FORMATO DE LISTAS ESTRUCTURADAS los riesgos críticos EN ESPAÑOL específicos para ${extendedProfile?.current_challenges || 'desafíos actuales'}. CUANTIFICA LA PROBABILIDAD E IMPACTO de cada riesgo en una escala del 1-5. Por ejemplo:

### Resistencia al cambio
- **Probabilidad:** 4/5
- **Impacto:** 5/5
- **Nivel Total:** 20 (Alto)
- **Estrategia de Mitigación:** Programa de gestión del cambio

INCLUYE 3-5 riesgos principales con sus estrategias de mitigación.]

### Estrategias de Mitigación
[Estrategias EN ESPAÑOL considerando ${extendedProfile?.team_structure || 'estructura del equipo'}. INCLUYE PLAN DE CONTINGENCIA específico para cada riesgo principal.]

## 🎯 Próximos Pasos y Quick Wins
### Acciones Inmediatas (Semana 1-2)
[Acciones EN ESPAÑOL específicas para ${extendedProfile?.business_name || 'su empresa'}. DETALLA RECURSOS MÍNIMOS NECESARIOS para cada acción y RESULTADOS ESPERADOS a corto plazo.]

### Sprint de 30 Días
[Plan EN ESPAÑOL adaptado a ${extendedProfile?.timeframe || 'marco temporal disponible'}. ESTRUCTURA COMO LISTA DE VERIFICACIÓN con responsables recomendados para cada tarea.]

## 🔄 Plan de Seguimiento y Ajuste Continuo
[Metodología EN ESPAÑOL para monitoreo y optimización continua de la implementación. INCLUYE FRECUENCIA DE REVISIÓN recomendada y CRITERIOS DE DECISIÓN para ajustes estratégicos. DETALLA INDICADORES DE ALERTA TEMPRANA que señalen necesidad de cambios en la estrategia. UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para presentar la metodología de seguimiento por frecuencia.]

## 📚 Recursos Adicionales y Capacitación
[Lista curada EN ESPAÑOL de recursos gratuitos y de pago relevantes para la implementación, considerando específicamente ${extendedProfile?.digitalization_level || 'nivel de digitalización actual'} y ${extendedProfile?.team_structure || 'estructura del equipo'}. INCLUYE CURSOS ONLINE, HERRAMIENTAS, PLANTILLAS Y COMUNIDADES relevantes. UTILIZA FORMATO DE LISTAS ESTRUCTURADAS para presentar los recursos por categoría.]

---
**REQUISITOS CRÍTICOS:**
- TODO EN ESPAÑOL (excepto nombres propios de tecnologías/empresas)
- Personalizar COMPLETAMENTE con información específica del perfil extendido
- Incluir números específicos de benchmarks reales
- Usar terminología de consultoría profesional EN ESPAÑOL
- Métricas SMART con targets basados en el contexto específico del negocio
- Business cases con ROI cuantificado usando datos del perfil
- Mencionar específicamente: nombre del negocio, industria, desafíos, objetivos, etc.
- INCLUIR HERRAMIENTAS Y RECURSOS ESPECÍFICOS relevantes para cada recomendación
- PROPORCIONAR OPCIONES PARA DIFERENTES NIVELES DE PRESUPUESTO
- ENFATIZAR ACCIONES CONCRETAS Y RÁPIDAS que generen valor inmediato
- CUANTIFICAR TODOS LOS BENEFICIOS Y COSTOS posibles
- ADAPTAR EL LENGUAJE Y COMPLEJIDAD al nivel de madurez digital de la empresa
- UTILIZAR FORMATO DE LISTAS ESTRUCTURADAS para todos los datos comparativos
- ASEGURAR que todas las secciones tengan encabezados claros y formato consistente

Genera el reporte profesional EN ESPAÑOL ahora:`;

  return prompt;
}

// Construir contexto extendido del perfil
function buildExtendedProfileContext(extendedProfile?: any): string {
  if (!extendedProfile) {
    return 'Información adicional del negocio: No disponible (usar información básica del perfil)';
  }

  const sections = [];

  // Información básica del negocio
  if (extendedProfile.business_name || extendedProfile.business_description || extendedProfile.industry) {
    sections.push(`**INFORMACIÓN BÁSICA DEL NEGOCIO:**
${extendedProfile.business_name ? `- Nombre del Negocio: ${extendedProfile.business_name}` : ''}
${extendedProfile.business_description ? `- Descripción: ${extendedProfile.business_description}` : ''}
${extendedProfile.industry ? `- Industria/Sector: ${extendedProfile.industry}` : ''}`);
  }

  // Mercado y clientes
  if (extendedProfile.target_market || extendedProfile.main_customers || extendedProfile.geographic_scope) {
    sections.push(`**MERCADO Y CLIENTES:**
${extendedProfile.target_market ? `- Mercado Objetivo: ${extendedProfile.target_market}` : ''}
${extendedProfile.main_customers ? `- Principales Clientes: ${extendedProfile.main_customers}` : ''}
${extendedProfile.geographic_scope ? `- Alcance Geográfico: ${extendedProfile.geographic_scope}` : ''}`);
  }

  // Estrategia y objetivos
  if (extendedProfile.business_goals || extendedProfile.yearly_growth_target || extendedProfile.competitive_advantage) {
    sections.push(`**ESTRATEGIA Y OBJETIVOS:**
${extendedProfile.business_goals ? `- Objetivos del Negocio: ${extendedProfile.business_goals}` : ''}
${extendedProfile.yearly_growth_target ? `- Meta de Crecimiento Anual: ${extendedProfile.yearly_growth_target}` : ''}
${extendedProfile.competitive_advantage ? `- Ventaja Competitiva: ${extendedProfile.competitive_advantage}` : ''}`);
  }

  // Operaciones y procesos
  if (extendedProfile.key_products || extendedProfile.sales_process || extendedProfile.marketing_channels) {
    sections.push(`**OPERACIONES Y PROCESOS:**
${extendedProfile.key_products ? `- Productos/Servicios Clave: ${extendedProfile.key_products}` : ''}
${extendedProfile.sales_process ? `- Proceso de Ventas: ${extendedProfile.sales_process}` : ''}
${extendedProfile.marketing_channels ? `- Canales de Marketing: ${extendedProfile.marketing_channels}` : ''}`);
  }

  // Recursos y estructura
  if (extendedProfile.team_structure || extendedProfile.technology_stack || extendedProfile.budget_range) {
    sections.push(`**RECURSOS Y ESTRUCTURA:**
${extendedProfile.team_structure ? `- Estructura del Equipo: ${extendedProfile.team_structure}` : ''}
${extendedProfile.technology_stack ? `- Stack Tecnológico: ${extendedProfile.technology_stack}` : ''}
${extendedProfile.budget_range ? `- Rango de Presupuesto: ${extendedProfile.budget_range}` : ''}`);
  }

  // Desafíos y métricas
  if (extendedProfile.current_challenges || extendedProfile.success_metrics || extendedProfile.timeframe) {
    sections.push(`**DESAFÍOS Y MÉTRICAS:**
${extendedProfile.current_challenges ? `- Desafíos Actuales: ${extendedProfile.current_challenges}` : ''}
${extendedProfile.success_metrics ? `- Métricas de Éxito: ${extendedProfile.success_metrics}` : ''}
${extendedProfile.timeframe ? `- Marco Temporal: ${extendedProfile.timeframe}` : ''}`);
  }

  // Información financiera
  if (extendedProfile.monthly_revenue || extendedProfile.business_model) {
    sections.push(`**INFORMACIÓN FINANCIERA:**
${extendedProfile.monthly_revenue ? `- Ingresos Mensuales: ${extendedProfile.monthly_revenue}` : ''}
${extendedProfile.business_model ? `- Modelo de Negocio Detallado: ${extendedProfile.business_model}` : ''}`);
  }

  return sections.length > 0 ? sections.join('\n\n') : 'Información adicional del negocio: En proceso de completar';
}

function getContextualPrompt(moduleConfig: any, profile: UserProfileData): string {
  const contextKeys = [
    profile.businessStage,
    profile.revenueModel,
    profile.employeeCount,
    profile.businessType
  ];
  
  for (const key of contextKeys) {
    if (moduleConfig.contextualPrompts[key]) {
      return moduleConfig.contextualPrompts[key];
    }
  }
  
  return 'Adapta las recomendaciones al perfil específico del negocio, considerando su contexto único y objetivos estratégicos.';
}

function getIndustrySpecificPrompt(moduleConfig: any, profile: UserProfileData): string {
  if (moduleConfig.industrySpecificPrompts && moduleConfig.industrySpecificPrompts[profile.businessType]) {
    return moduleConfig.industrySpecificPrompts[profile.businessType];
  }
  
  return `Considera las características específicas de ${profile.businessType} con modelo ${profile.revenueModel} para personalizar las recomendaciones.`;
}

function getMaturityLevelPrompt(moduleConfig: any, profile: UserProfileData): string {
  if (moduleConfig.maturityLevelPrompts && moduleConfig.maturityLevelPrompts[profile.digitalizationLevel]) {
    return moduleConfig.maturityLevelPrompts[profile.digitalizationLevel];
  }
  
  return `Adapta las recomendaciones al nivel de digitalización ${profile.digitalizationLevel} de la organización.`;
}

function generateEnhancedMockReport(
  profile: UserProfileData,
  moduleId: string,
  moduleInput: string,
  extendedProfile?: any
): string {
  const moduleName = getModuleName(moduleId);
  const moduleConfig = modulePrompts[moduleId];
  
  // Información personalizada del negocio
  const businessName = extendedProfile?.business_name || 'su empresa';
  const industry = extendedProfile?.industry || profile.businessType;
  const businessDescription = extendedProfile?.business_description || `empresa ${profile.businessType}`;
  const currentChallenges = extendedProfile?.current_challenges || 'optimización de procesos y crecimiento';
  const businessGoals = extendedProfile?.business_goals || profile.mainObjective;
  const competitiveAdvantage = extendedProfile?.competitive_advantage || 'enfoque en calidad y servicio al cliente';
  const targetMarket = extendedProfile?.target_market || `mercado ${profile.revenueModel}`;
  const teamStructure = extendedProfile?.team_structure || `equipo de ${profile.employeeCount} personas`;
  const technologyStack = extendedProfile?.technology_stack || 'herramientas digitales básicas';
  const monthlyRevenue = extendedProfile?.monthly_revenue || 'ingresos en crecimiento';
  const yearlyGrowthTarget = extendedProfile?.yearly_growth_target || 'crecimiento sostenible';
  const budgetRange = extendedProfile?.budget_range || 'presupuesto optimizado';
  const successMetrics = extendedProfile?.success_metrics || 'métricas de rendimiento clave';
  const timeframe = extendedProfile?.timeframe || '12-18 meses';
  const geographicScope = extendedProfile?.geographic_scope || 'mercado local/regional';
  const keyProducts = extendedProfile?.key_products || 'productos/servicios principales';
  const salesProcess = extendedProfile?.sales_process || 'proceso de ventas actual';
  const marketingChannels = extendedProfile?.marketing_channels || 'canales de marketing digitales';
  const businessModel = extendedProfile?.business_model || `modelo ${profile.revenueModel}`;
  
  // Generar tablas para el reporte
  const benchmarkingTable = generateBenchmarkingTable(profile, moduleId);
  const kpisTable = generateKPIsTable(profile, moduleId);
  const investmentTable = generateInvestmentTable(profile);
  const risksTable = generateRisksTable();
  
  // Generar comparativa de líderes de industria
  const competitiveAnalysis = `
### Automatización
- **Líder de Industria:** ${getLeaderCapabilities(moduleId)}
- **Práctica Actual:** Procesos mayormente manuales
- **Brecha:** Alta
- **Impacto Potencial:** 40-60% mejora eficiencia

### Analíticas
- **Líder de Industria:** Dashboards en tiempo real
- **Práctica Actual:** Reportes manuales periódicos
- **Brecha:** Alta
- **Impacto Potencial:** 50-70% mejor toma decisiones

### Integración
- **Líder de Industria:** Ecosistema conectado
- **Práctica Actual:** Sistemas aislados
- **Brecha:** Media
- **Impacto Potencial:** 30-50% reducción esfuerzo

### Experiencia Cliente
- **Líder de Industria:** Personalización avanzada
- **Práctica Actual:** Enfoque estandarizado
- **Brecha:** Media
- **Impacto Potencial:** 25-40% mayor satisfacción
`;

  // Generar proyección de impacto en ingresos
  const revenueProjection = `
### Escenario Conservador
- **Incremento Proyectado:** 15-25%
- **Probabilidad:** 70%
- **Factores Clave:** Adopción básica de recomendaciones

### Escenario Esperado
- **Incremento Proyectado:** 25-40%
- **Probabilidad:** 50%
- **Factores Clave:** Implementación completa del plan

### Escenario Optimista
- **Incremento Proyectado:** 40-60%
- **Probabilidad:** 30%
- **Factores Clave:** Adopción avanzada + condiciones favorables
`;

  // Generar proyección de ROI
  const roiProjection = `
### ROI a 6 meses
- **ROI Proyectado:** 15-25%
- **Benchmark Industria:** 10-20%
- **Ventaja:** +5%

### ROI a 12 meses
- **ROI Proyectado:** 35-50%
- **Benchmark Industria:** 25-40%
- **Ventaja:** +10%

### ROI a 24 meses
- **ROI Proyectado:** 80-120%
- **Benchmark Industria:** 60-90%
- **Ventaja:** +20-30%
`;

  // Generar metodología de seguimiento
  const followUpMethodology = `
### Seguimiento Semanal
- **Actividad:** Revisión operativa
- **Participantes:** Equipo proyecto
- **Entregables:** Reporte progreso

### Seguimiento Quincenal
- **Actividad:** Revisión táctica
- **Participantes:** Gerencia media
- **Entregables:** Ajustes plan

### Seguimiento Mensual
- **Actividad:** Revisión estratégica
- **Participantes:** Dirección
- **Entregables:** Dashboard KPIs

### Seguimiento Trimestral
- **Actividad:** Evaluación ROI
- **Participantes:** Comité ejecutivo
- **Entregables:** Actualización business case
`;

  // Generar recursos recomendados
  const recommendedResources = `
### Formación
- **Recurso:** Curso ${moduleConfig.professionalSources[0]}
- **Descripción:** Capacitación en metodología
- **Inversión:** Gratuito - €1,500

### Herramientas
- **Recurso:** Plataforma de automatización
- **Descripción:** Software específico para ${industry}
- **Inversión:** €0 (open source) - €500/mes

### Comunidad
- **Recurso:** Grupo de usuarios ${industry}
- **Descripción:** Networking y mejores prácticas
- **Inversión:** Gratuito

### Consultoría
- **Recurso:** Mentoría especializada
- **Descripción:** Soporte experto según necesidad
- **Inversión:** €1,000 - €5,000
`;

  return `# 📊 Análisis Estratégico: ${moduleName}

## 🎯 Resumen Ejecutivo

Basándome en el análisis integral de **${businessName}**, una **${businessDescription}** especializada en **${industry}** con modelo **${profile.revenueModel}** en etapa **${profile.businessStage}**, he identificado oportunidades estratégicas de alto impacto en ${moduleName}. Su desafío específico "${moduleInput}" presenta un potencial de optimización significativo con **ROI proyectado del 35-50%** en los próximos 12-18 meses.

Según el **${moduleConfig.professionalSources[0]}**, empresas similares a **${businessName}** en el sector **${industry}** han logrado mejoras promedio del **40-60% en eficiencia operativa** mediante la implementación de las estrategias que recomendaremos. Los benchmarks de industria indican que organizaciones con **${teamStructure}** y **${monthlyRevenue}** típicamente invierten **${getInvestmentBenchmark(profile)}** en iniciativas de este tipo, con un período de recuperación promedio de **8-12 meses**.

Las recomendaciones estratégicas se enfocan en tres pilares fundamentales respaldados por **${moduleConfig.professionalSources[1]}**: **automatización inteligente** (reducción de costos operativos del 25-40%), **optimización de procesos** (mejora de eficiencia del 30-45%), e **implementación de analíticas avanzadas** (mejora en toma de decisiones del 60%). El caso de negocio total proyecta una inversión de **$${getInvestmentRange(profile)}** con retorno acumulado de **$${getReturnProjection(profile)}** en 24 meses, específicamente adaptado al contexto de **${businessName}** y sus **${businessGoals}**.

Considerando su **${competitiveAdvantage}** y enfoque en **${targetMarket}**, las iniciativas propuestas fortalecerán su posición competitiva mientras abordan directamente **${currentChallenges}**.

## 📈 Análisis Situacional y Benchmarking

### Evaluación del Estado Actual

**Perfil Empresarial de ${businessName}:**
Su nivel de digitalización **${profile.digitalizationLevel}** los posiciona en el **${getMaturityPercentile(profile.digitalizationLevel)}** de empresas en **${industry}** según **${moduleConfig.professionalSources[2]}**. El análisis comparativo con el benchmark de **${JSON.stringify(moduleConfig.benchmarkData)}** indica oportunidades específicas de mejora.

**Análisis de Capacidades Específicas:**
- **Fortalezas Identificadas:** ${competitiveAdvantage}, estructura organizacional adecuada (${teamStructure}), y enfoque claro en ${businessGoals}
- **Stack Tecnológico Actual:** ${technologyStack} - con potencial de modernización
- **Procesos Operativos:** ${salesProcess} y ${marketingChannels} - optimizables mediante automatización
- **Gaps vs. Líderes de Industria:** Según benchmarks, empresas líderes en ${industry} operan con **35-45% mayor eficiencia** en procesos similares

**Contexto Financiero y Operativo:**
- **Ingresos Actuales:** ${monthlyRevenue} con objetivo de ${yearlyGrowthTarget}
- **Alcance de Mercado:** ${geographicScope} con enfoque en ${targetMarket}
- **Productos/Servicios:** ${keyProducts} como oferta principal
- **Presupuesto Disponible:** ${budgetRange} para iniciativas de optimización

### Benchmarking por Área Clave

${benchmarkingTable}

### Inteligencia Competitiva

**Análisis Competitivo en ${industry} (Fuente: ${moduleConfig.professionalSources[1]}):**
- Empresas líderes en ${industry} han implementado **${getLeaderCapabilities(moduleId)}**
- El **75% de competidores** en ${geographicScope} ya utiliza algún nivel de automatización en procesos core
- **Oportunidad Competitiva:** ${businessName} puede obtener ventaja de **12-18 meses** implementando estas recomendaciones antes que competidores locales

**Posicionamiento de ${businessName}:**
- Su **${competitiveAdvantage}** es diferenciador clave en ${targetMarket}
- El modelo **${businessModel}** está bien adaptado para ${profile.businessStage}
- Oportunidad de fortalecer posición mediante ${moduleInput}

### Análisis de Brechas con Benchmarks

**Brechas Críticas vs. Líderes de Industria:**
1. **Brecha de Automatización de Procesos:** Nivel actual vs. **${getBenchmarkData(moduleConfig, 'automation')}** de líderes en ${industry}
2. **Brecha de Integración de Datos:** ${technologyStack} vs. **arquitectura integrada** del top 20%
3. **Brecha de Madurez Analítica:** ${successMetrics} vs. **analíticas predictivas** de competidores avanzados

**Oportunidades Específicas para ${businessName}:**
- Optimización de ${salesProcess} puede generar **25-35% mejora** en conversión
- Automatización de ${marketingChannels} puede reducir costos **30-40%**
- Integración de ${technologyStack} puede mejorar eficiencia **40-50%**

## 🚀 Recomendaciones Estratégicas (Basadas en ${moduleConfig.professionalSources[0]})

### Prioridad 1: Automatización Inteligente Específica para ${businessName}
**Caso de Negocio Personalizado:** 
- ROI proyectado del **45-60%** en primeros 12 meses para ${businessName}
- Benchmarks de industria en ${industry}: **${getBenchmarkROI(moduleConfig, 'automation')}**
- Período de recuperación: **6-8 meses** vs. promedio industria de 10-12 meses
- Impacto directo en ${businessGoals} y ${currentChallenges}

**Implementación Adaptada a ${businessName}:**
- **Semanas 1-4:** Mapeo de procesos de ${salesProcess} usando **Value Stream Mapping**
- **Semanas 5-12:** Implementación de herramientas de automatización para ${keyProducts}
- **Semanas 13-16:** Pruebas y optimización con metodología **Six Sigma** adaptada a ${teamStructure}
- **Semanas 17-20:** Despliegue completo con **Gestión del Cambio** específica para ${industry}

**Métricas de Éxito Específicas:**
- Tasa de automatización de procesos: Objetivo **70-80%** vs. actual ~30% (Benchmark: ${getBenchmarkData(moduleConfig, 'automation_rate')})
- Ahorro de tiempo: **25-35 horas/semana** para ${teamStructure} (Promedio industria: 20-30 horas)
- Reducción de errores: **75-85%** en procesos automatizados (Mejor en clase: 80-90%)
- Ahorro de costos: **$${getAutomationSavings(profile)}/año** específico para ${businessName} (ROI: ${getBenchmarkROI(moduleConfig, 'automation')})

### Prioridad 2: Plataforma de Integración de Datos y Analíticas para ${businessName}
**Caso de Negocio Específico (Framework ${moduleConfig.professionalSources[2]}):**
- ROI proyectado del **35-45%** en 12-18 meses según **${moduleConfig.professionalSources[0]}**
- Inversión: **$${getPriority2Investment(profile)}** vs. benchmark de industria de **${getIndustryBenchmark(profile, 'analytics')}**
- Impacto directo en ${successMetrics} y ${businessGoals}

**Estrategia de Implementación Personalizada:**
- **Fase 1:** Auditoría de datos de ${keyProducts} y ${salesProcess}
- **Fase 2:** Implementación de plataforma con enfoque **Cloud-First** adaptado a ${budgetRange}
- **Fase 3:** Desarrollo de analíticas para ${marketingChannels} con **Self-Service BI**
- **Fase 4:** Capacidades avanzadas con **ML/AI** para ${targetMarket}

**Métricas de Éxito Contextualizadas:**
- Completitud de integración de datos: **90-95%** (Benchmark industria: ${getBenchmarkData(moduleConfig, 'data_integration')})
- Velocidad de toma de decisiones: **50-60% más rápido** para ${businessName} (Mejor en clase: 60-70%)
- Precisión de pronósticos: **85-90%** vs. línea base actual (Promedio industria: 75-85%)

### Prioridad 3: Optimización de Procesos y Mejora Continua para ${businessName}
**Caso de Negocio Específico (Metodología ${moduleConfig.professionalSources[2]}):**
- ROI proyectado del **25-35%** en 18-24 meses
- Benchmarks según **${moduleConfig.professionalSources[0]}**: Empresas similares a ${businessName} logran **30-40% mejora**
- Enfoque específico en ${currentChallenges} y ${timeframe}

**Métricas de Éxito con Benchmarks Competitivos:**
- Eficiencia de procesos: **30-40% reducción** en tiempos de ciclo de ${salesProcess} (Benchmark líder industria: 35-50%)
- Mejora de calidad: **60-70% reducción** en retrabajo de ${keyProducts} (Mejor en clase: 70-80%)
- Satisfacción del cliente: **20-30% mejora** en ${targetMarket} (Promedio industria: 15-25%)

## 🛠️ Hoja de Ruta de Implementación Personalizada (Metodología ${moduleConfig.professionalSources[1]})

### Fase 1: Fundación (Semanas 1-8) - Quick Wins para ${businessName}
**Basado en ${moduleConfig.professionalSources[0]} y Adaptado a ${businessName}:**
- Auditoría completa de procesos de ${salesProcess} con metodología **BPMN 2.0**
- Selección de stack tecnológico usando análisis **Build vs. Buy** específico para ${budgetRange}
- Capacitación del ${teamStructure} con framework **Agile/Scrum**
- Primeras implementaciones de automatización con enfoque **80/20** en ${keyProducts}

**ROI Esperado:** **15-25%** mejora en primeras 8 semanas específicamente para ${businessName}

### Fase 2: Implementación Principal (Semanas 9-20)
**Framework ${moduleConfig.professionalSources[2]} Adaptado:**
- Despliegue de plataforma de automatización con arquitectura **API-First** para ${technologyStack}
- Implementación de integración de datos con procesos **ETL/ELT** para ${keyProducts}
- Desarrollo de dashboards analíticos con capacidades **Tiempo Real** para ${successMetrics}
- Optimización de procesos críticos con **Lean Six Sigma** adaptado a ${industry}

**ROI Esperado:** **35-45%** mejora acumulativa para ${businessName}

### Fase 3: Optimización (Semanas 21-32)
**Metodología Avanzada según ${moduleConfig.professionalSources[1]}:**
- Ajuste fino de workflows con optimización **Machine Learning** para ${salesProcess}
- Mejora de analíticas con **Modelado Predictivo** para ${targetMarket}
- Implementación de automatización avanzada con capacidades **AI/ML** para ${marketingChannels}
- Establecimiento de **Centro de Excelencia** específico para ${businessName}

**ROI Esperado:** **45-55%** mejora acumulativa

### Fase 4: Innovación (Semanas 33-52)
**Capacidades Preparadas para el Futuro:**
- Implementación de AI/ML con plataformas **AutoML** adaptadas a ${businessModel}
- Optimización predictiva con **Analíticas en Tiempo Real** para ${businessGoals}
- Pipeline de innovación con metodología **Design Thinking** para ${industry}
- Mejora continua con enfoque **Kaizen** específico para ${teamStructure}

**ROI Esperado:** **55-65%** mejora acumulativa para ${businessName}

## 📊 Métricas de Éxito y Benchmarks de Industria Específicos

### KPIs Primarios (Basados en ${moduleConfig.professionalSources[0]})

${kpisTable}

### 🏆 Análisis Comparativo con Líderes de Industria
Basado en un análisis detallado de empresas líderes en ${industry}, hemos identificado las siguientes brechas competitivas para ${businessName}:

${competitiveAnalysis}

## 💰 Análisis Integral de Impacto Financiero

### 💵 Desglose Detallado de Inversión Requerida

${investmentTable}

### 📈 Proyección Detallada de Impacto en Ingresos
**Impacto en Ingresos para ${businessName}:**

${revenueProjection}

La proyección se basa en el análisis de ${moduleConfig.professionalSources[0]} para empresas similares en ${industry} con ${teamStructure} y objetivos de ${yearlyGrowthTarget}.

### 🎯 Cálculo Específico de ROI con Benchmarks Sectoriales
**ROI Proyectado para ${businessName}:**

${roiProjection}

**Período de Recuperación de Inversión:** 8-12 meses vs. promedio industria de 12-18 meses.

## ⚠️ Evaluación de Riesgos y Mitigación

### Factores de Alto Riesgo

${risksTable}

### Estrategias de Mitigación
**Plan de Mitigación Integral para ${businessName}:**

- **Gestión del Cambio:** Programa estructurado con comunicación, capacitación y apoyo continuo
- **Enfoque Incremental:** Implementación por fases con validación en cada etapa
- **Capacitación Continua:** Desarrollo de capacidades internas para reducir dependencias
- **Monitoreo Constante:** Sistema de alertas tempranas para identificar desviaciones

## 🎯 Próximos Pasos y Quick Wins
### Acciones Inmediatas (Semana 1-2)
1. **Establecer Equipo de Proyecto:** Identificar stakeholders clave y responsabilidades
2. **Evaluación Detallada:** Análisis profundo de procesos prioritarios de ${salesProcess}
3. **Quick Win #1:** Implementación de automatización simple para ${keyProducts} (ROI rápido)
4. **Plan de Comunicación:** Estrategia para gestionar el cambio con ${teamStructure}

### Sprint de 30 Días
- **Semana 1:** Evaluación detallada y priorización
- **Semana 2:** Selección de herramientas y proveedores
- **Semanas 3-4:** Implementación de primer caso de uso
- **Fin de Mes:** Evaluación de resultados y ajuste de plan

## 🔄 Plan de Seguimiento y Ajuste Continuo
**Metodología de Seguimiento para ${businessName}:**

${followUpMethodology}

## 📚 Recursos Adicionales y Capacitación
**Recursos Recomendados para ${businessName}:**

${recommendedResources}

---

## 📚 Fuentes Profesionales Utilizadas

${moduleConfig.professionalSources.map((source, index) => `${index + 1}. **${source}** - Metodologías y benchmarks aplicados en análisis estratégico específico para ${businessName}`).join('\n')}

## 📊 Benchmarks de Industria Aplicados Específicamente

${Object.keys(moduleConfig.benchmarkData).map(key => `- **${key}:** ${JSON.stringify(moduleConfig.benchmarkData[key])} - Aplicado al contexto de ${businessName} en ${industry}`).join('\n')}

---

**💡 Insight Estratégico:** El perfil específico de **${businessName}** como ${businessDescription} en etapa **${profile.businessStage}** con **${teamStructure}** los posiciona perfectamente para implementar estas optimizaciones con **máximo impacto**. Su **${competitiveAdvantage}** y enfoque en **${targetMarket}** crean una base sólida para el éxito de estas iniciativas.

**🚀 Ventaja Competitiva:** La implementación de esta estrategia posicionará a **${businessName}** en el **top 20%** de empresas en ${industry} en términos de madurez digital y eficiencia operativa, creando barreras de entrada significativas para competidores en ${geographicScope}.

**📈 Resultados Esperados:** Basándome en casos de éxito documentados en **${moduleConfig.professionalSources[2]}** y el contexto específico de **${businessName}**, proyectamos que alcanzarán el **ROI objetivo del 45-55%** en ${timeframe}, posicionándolos como líder en su segmento de ${targetMarket} dentro de ${industry}.

**🎯 Recomendación Final:** Considerando los **${currentChallenges}** específicos de **${businessName}** y sus **${businessGoals}**, recomendamos iniciar inmediatamente con la Prioridad 1 (Automatización Inteligente) para generar quick wins que financien las siguientes fases, aprovechando su **${competitiveAdvantage}** para maximizar el impacto en **${targetMarket}**.`;
}

function getModuleName(moduleId: string): string {
  const module = businessModules.find(m => m.id === moduleId);
  return module ? module.name.es : 'Módulo Desconocido';
}

// Helper functions mejoradas con benchmarks reales
function getInvestmentBenchmark(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '2-4% del revenue anual';
  if (employeeCount === '6-20') return '3-5% del revenue anual';
  if (employeeCount === '21-50') return '4-6% del revenue anual';
  if (employeeCount === '51-200') return '5-7% del revenue anual';
  return '6-8% del revenue anual';
}

function getMaturityPercentile(level: string): string {
  switch (level) {
    case 'bajo-manual': return 'percentil 25-35';
    case 'medio-herramientas': return 'percentil 45-55';
    case 'alto-automatizado': return 'percentil 70-80';
    case 'muy-alto-ai': return 'percentil 90-95';
    default: return 'percentil 50';
  }
}

function getImprovementPotential(profile: UserProfileData): string {
  const level = profile.digitalizationLevel;
  switch (level) {
    case 'bajo-manual': return '60-80';
    case 'medio-herramientas': return '40-60';
    case 'alto-automatizado': return '25-40';
    case 'muy-alto-ai': return '15-25';
    default: return '45-65';
  }
}

function getLeaderCapabilities(moduleId: string): string {
  const capabilities: Record<string, string> = {
    'empresa-general': 'automatización end-to-end, analíticas predictivas, y arquitectura cloud-native',
    'marketing-digital': 'marketing automation avanzado, attribution modeling, y personalización con IA',
    'ventas-crm': 'automatización de ventas inteligente, predictive lead scoring, y revenue operations',
    'finanzas-contabilidad': 'automatización de planificación financiera, reportes en tiempo real, y analíticas predictivas',
    'recursos-humanos': 'analíticas de personas, reclutamiento automatizado, y plataformas de experiencia del empleado',
    'atencion-cliente': 'automatización omnicanal, insights potenciados por IA, y salud predictiva del cliente',
    'contenido-digital': 'automatización de contenido, optimización SEO avanzada, y analíticas de rendimiento',
    'estrategia-producto': 'analíticas de producto avanzadas, predicción de comportamiento del usuario, y optimización automatizada',
    'innovacion-rd': 'plataformas de gestión de innovación, automatización de scouting tecnológico, y analíticas de PI'
  };
  return capabilities[moduleId] || 'tecnologías avanzadas de automatización y analíticas';
}

function getBenchmarkData(moduleConfig: any, key: string): string {
  if (moduleConfig.benchmarkData && moduleConfig.benchmarkData[key]) {
    return JSON.stringify(moduleConfig.benchmarkData[key]);
  }
  return 'datos de benchmark específicos';
}

function getBenchmarkROI(moduleConfig: any, category: string): string {
  const roiData: Record<string, string> = {
    'automation': '200-400% ROI típico',
    'analytics': '150-300% ROI promedio',
    'overall': '35-50% ROI anual'
  };
  return roiData[category] || '25-45% ROI';
}

function getIndustryBenchmark(profile: UserProfileData, metric: string): string {
  const benchmarks: Record<string, Record<string, string>> = {
    'analytics': {
      '1-5': '$15K-25K',
      '6-20': '$35K-55K',
      '21-50': '$75K-125K',
      '51-200': '$150K-250K',
      'mas-500': '$300K-500K'
    },
    'total_investment': {
      '1-5': '$12K-20K promedio industria',
      '6-20': '$30K-50K promedio industria',
      '21-50': '$65K-110K promedio industria',
      '51-200': '$130K-220K promedio industria',
      'mas-500': '$280K-450K promedio industria'
    }
  };
  
  return benchmarks[metric]?.[profile.employeeCount] || 'benchmark específico de industria';
}

function getIndustryAverage(profile: UserProfileData, metric: string): string {
  const averages: Record<string, Record<string, string>> = {
    'cost_savings': {
      '1-5': '$20K-30K',
      '6-20': '$50K-75K',
      '21-50': '$100K-150K',
      '51-200': '$200K-350K',
      'mas-500': '$400K-650K'
    }
  };
  
  return averages[metric]?.[profile.employeeCount] || 'promedio de industria';
}

function getRevenueBenchmark(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '$30K-45K incremento anual';
  if (employeeCount === '6-20') return '$75K-110K incremento anual';
  if (employeeCount === '21-50') return '$150K-225K incremento anual';
  if (employeeCount === '51-200') return '$300K-475K incremento anual';
  return '$650K-1M incremento anual';
}

function getRiskImpact(profile: UserProfileData, riskType: string): string {
  const impacts: Record<string, Record<string, string>> = {
    'change_resistance': {
      '1-5': '$5K-10K costo potencial de retraso',
      '6-20': '$15K-25K costo potencial de retraso',
      '21-50': '$35K-55K costo potencial de retraso',
      '51-200': '$75K-125K costo potencial de retraso',
      'mas-500': '$150K-250K costo potencial de retraso'
    },
    'tech_complexity': {
      '1-5': '$3K-8K costo adicional de integración',
      '6-20': '$10K-18K costo adicional de integración',
      '21-50': '$25K-40K costo adicional de integración',
      '51-200': '$50K-85K costo adicional de integración',
      'mas-500': '$100K-175K costo adicional de integración'
    }
  };
  
  return impacts[riskType]?.[profile.employeeCount] || 'impacto cuantificado';
}

// Funciones existentes mantenidas para compatibilidad
function getInvestmentRange(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '15,000-25,000';
  if (employeeCount === '6-20') return '35,000-55,000';
  if (employeeCount === '21-50') return '75,000-125,000';
  if (employeeCount === '51-200') return '150,000-250,000';
  return '300,000-500,000';
}

function getReturnProjection(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '45,000-75,000';
  if (employeeCount === '6-20') return '105,000-165,000';
  if (employeeCount === '21-50') return '225,000-375,000';
  if (employeeCount === '51-200') return '450,000-750,000';
  return '900,000-1,500,000';
}

function getAutomationSavings(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '25,000-35,000';
  if (employeeCount === '6-20') return '60,000-85,000';
  if (employeeCount === '21-50') return '120,000-180,000';
  if (employeeCount === '51-200') return '250,000-400,000';
  return '500,000-750,000';
}

function getPriority2Investment(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '5,000-8,000';
  if (employeeCount === '6-20') return '12,000-18,000';
  if (employeeCount === '21-50') return '25,000-40,000';
  if (employeeCount === '51-200') return '50,000-80,000';
  return '100,000-150,000';
}

function getTotalInvestment(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '15,000-25,000';
  if (employeeCount === '6-20') return '35,000-55,000';
  if (employeeCount === '21-50') return '75,000-125,000';
  if (employeeCount === '51-200') return '150,000-250,000';
  return '300,000-500,000';
}

function getRevenueImpact(profile: UserProfileData): string {
  const employeeCount = profile.employeeCount;
  if (employeeCount === '1-5') return '35,000-50,000';
  if (employeeCount === '6-20') return '85,000-125,000';
  if (employeeCount === '21-50') return '180,000-275,000';
  if (employeeCount === '51-200') return '350,000-550,000';
  return '750,000-1,200,000';
}

// Función para generar una tabla de benchmarking para el reporte de ejemplo
function generateBenchmarkingTable(profile: UserProfileData, moduleId: string): string {
  const benchmarkingData: Record<string, Array<{area: string, metric: string, current: string, benchmark: string, gap: string}>> = {
    'atencion-cliente': [
      {
        area: 'Atención Cliente',
        metric: 'Tiempo Respuesta',
        current: '24 horas',
        benchmark: '4-8 horas',
        gap: '16-20 horas'
      },
      {
        area: 'Autoservicio',
        metric: 'Tasa Resolución',
        current: '40%',
        benchmark: '60-80%',
        gap: '20-40%'
      },
      {
        area: 'Satisfacción',
        metric: 'NPS',
        current: '35',
        benchmark: '60-70',
        gap: '25-35 puntos'
      },
      {
        area: 'Eficiencia',
        metric: 'Costo por Ticket',
        current: '5€',
        benchmark: '3-4€',
        gap: '1-2€'
      }
    ],
    'marketing-digital': [
      {
        area: 'Adquisición',
        metric: 'CAC',
        current: '85€',
        benchmark: '45-65€',
        gap: '20-40€'
      },
      {
        area: 'Conversión',
        metric: 'Tasa Conversión',
        current: '1.8%',
        benchmark: '3-5%',
        gap: '1.2-3.2%'
      },
      {
        area: 'Engagement',
        metric: 'CTR Email',
        current: '2.5%',
        benchmark: '4-6%',
        gap: '1.5-3.5%'
      },
      {
        area: 'Retención',
        metric: 'Churn Rate',
        current: '8%',
        benchmark: '3-5%',
        gap: '3-5%'
      }
    ],
    'ventas-crm': [
      {
        area: 'Ciclo Venta',
        metric: 'Días Promedio',
        current: '45 días',
        benchmark: '25-35 días',
        gap: '10-20 días'
      },
      {
        area: 'Conversión',
        metric: 'Lead-to-Deal',
        current: '15%',
        benchmark: '25-35%',
        gap: '10-20%'
      },
      {
        area: 'Eficiencia',
        metric: 'Deals/Rep/Mes',
        current: '4',
        benchmark: '8-12',
        gap: '4-8 deals'
      },
      {
        area: 'Forecasting',
        metric: 'Precisión',
        current: '65%',
        benchmark: '85-95%',
        gap: '20-30%'
      }
    ],
    'empresa-general': [
      {
        area: 'Digitalización',
        metric: 'Procesos Digitales',
        current: '35%',
        benchmark: '70-85%',
        gap: '35-50%'
      },
      {
        area: 'Automatización',
        metric: 'Tareas Automatizadas',
        current: '25%',
        benchmark: '60-75%',
        gap: '35-50%'
      },
      {
        area: 'Analytics',
        metric: 'Decisiones Data-Driven',
        current: '30%',
        benchmark: '70-85%',
        gap: '40-55%'
      },
      {
        area: 'Integración',
        metric: 'Sistemas Integrados',
        current: '40%',
        benchmark: '80-90%',
        gap: '40-50%'
      }
    ]
  };

  // Usar datos específicos del módulo o fallback a empresa-general
  const data = benchmarkingData[moduleId] || benchmarkingData['empresa-general'];
  
  // Formato visual mejorado con listas estructuradas
  let result = '';
  
  data.forEach(row => {
    result += `### ${row.area}\n`;
    result += `- **Métrica:** ${row.metric}\n`;
    result += `- **Valor Actual:** ${row.current}\n`;
    result += `- **Benchmark de Industria:** ${row.benchmark}\n`;
    result += `- **Brecha:** ${row.gap}\n\n`;
  });
  
  return result;
}

// Función para generar una tabla de KPIs para el reporte de ejemplo
function generateKPIsTable(profile: UserProfileData, moduleId: string): string {
  const kpisData: Record<string, Array<{kpi: string, formula: string, current: string, target: string, frequency: string}>> = {
    'atencion-cliente': [
      {
        kpi: 'Tiempo Respuesta',
        formula: 'Horas hasta primera respuesta',
        current: '24h',
        target: '4h',
        frequency: 'Diaria'
      },
      {
        kpi: 'First Contact Resolution',
        formula: 'Issues resueltos en 1er contacto / Total',
        current: '45%',
        target: '70-80%',
        frequency: 'Semanal'
      },
      {
        kpi: 'CSAT',
        formula: 'Promedio satisfacción (1-5)',
        current: '3.5',
        target: '4.5+',
        frequency: 'Continua'
      },
      {
        kpi: 'NPS',
        formula: 'Promotores - Detractores',
        current: '35',
        target: '60+',
        frequency: 'Mensual'
      }
    ],
    'marketing-digital': [
      {
        kpi: 'CAC',
        formula: 'Costo total / Nuevos clientes',
        current: '85€',
        target: '50-60€',
        frequency: 'Mensual'
      },
      {
        kpi: 'Tasa Conversión',
        formula: 'Conversiones / Visitantes',
        current: '1.8%',
        target: '3-5%',
        frequency: 'Semanal'
      },
      {
        kpi: 'ROAS',
        formula: 'Ingresos / Gasto Ads',
        current: '2.2x',
        target: '4-5x',
        frequency: 'Semanal'
      },
      {
        kpi: 'CLV:CAC',
        formula: 'Valor vida cliente / CAC',
        current: '2:1',
        target: '3:1+',
        frequency: 'Trimestral'
      }
    ],
    'ventas-crm': [
      {
        kpi: 'Ciclo de Venta',
        formula: 'Días desde Lead a Cierre',
        current: '45 días',
        target: '30 días',
        frequency: 'Mensual'
      },
      {
        kpi: 'Lead-to-Deal',
        formula: 'Deals / Leads calificados',
        current: '15%',
        target: '25-30%',
        frequency: 'Mensual'
      },
      {
        kpi: 'Deal Size Promedio',
        formula: 'Total ventas / Número deals',
        current: '2,500€',
        target: '3,500€+',
        frequency: 'Mensual'
      },
      {
        kpi: 'Precisión Forecast',
        formula: 'Ventas reales / Forecast',
        current: '65%',
        target: '90%+',
        frequency: 'Trimestral'
      }
    ],
    'empresa-general': [
      {
        kpi: 'Eficiencia Operativa',
        formula: 'Output / Input de recursos',
        current: '65%',
        target: '85%+',
        frequency: 'Mensual'
      },
      {
        kpi: 'Digitalización',
        formula: 'Procesos digitales / Total',
        current: '35%',
        target: '75%+',
        frequency: 'Trimestral'
      },
      {
        kpi: 'Productividad',
        formula: 'Output / Horas trabajadas',
        current: '70%',
        target: '90%+',
        frequency: 'Mensual'
      },
      {
        kpi: 'ROI Tecnología',
        formula: 'Beneficios / Inversión tech',
        current: '120%',
        target: '200%+',
        frequency: 'Anual'
      }
    ]
  };

  // Usar datos específicos del módulo o fallback a empresa-general
  const data = kpisData[moduleId] || kpisData['empresa-general'];
  
  // Formato visual mejorado con listas estructuradas
  let result = '';
  
  data.forEach(row => {
    result += `### ${row.kpi}\n`;
    result += `- **Fórmula:** ${row.formula}\n`;
    result += `- **Valor Actual:** ${row.current}\n`;
    result += `- **Target:** ${row.target}\n`;
    result += `- **Frecuencia:** ${row.frequency}\n\n`;
  });
  
  return result;
}

// Función para generar una tabla de inversión para el reporte de ejemplo
function generateInvestmentTable(profile: UserProfileData): string {
  // Ajustar montos según el tamaño de la empresa
  let baseAmount = 5000;
  if (profile.employeeCount === '6-20') baseAmount = 15000;
  if (profile.employeeCount === '21-50') baseAmount = 30000;
  if (profile.employeeCount === '51-200') baseAmount = 75000;
  if (profile.employeeCount === 'mas-500') baseAmount = 150000;
  
  const tech = Math.round(baseAmount * 0.4);
  const training = Math.round(baseAmount * 0.2);
  const consulting = Math.round(baseAmount * 0.3);
  const other = Math.round(baseAmount * 0.1);
  
  // Formato visual mejorado con listas estructuradas
  let result = '';
  
  result += `### Tecnología\n`;
  result += `- **Descripción:** Plataforma y automatización\n`;
  result += `- **Inversión Estimada:** ${tech}€ - ${Math.round(tech*1.3)}€\n`;
  result += `- **Plazo:** Mes 1-3\n\n`;
  
  result += `### Capacitación\n`;
  result += `- **Descripción:** Entrenamiento del equipo\n`;
  result += `- **Inversión Estimada:** ${training}€ - ${Math.round(training*1.3)}€\n`;
  result += `- **Plazo:** Mes 2-4\n\n`;
  
  result += `### Consultoría\n`;
  result += `- **Descripción:** Implementación y estrategia\n`;
  result += `- **Inversión Estimada:** ${consulting}€ - ${Math.round(consulting*1.3)}€\n`;
  result += `- **Plazo:** Mes 1-6\n\n`;
  
  result += `### Otros\n`;
  result += `- **Descripción:** Contingencia y gastos adicionales\n`;
  result += `- **Inversión Estimada:** ${other}€ - ${Math.round(other*1.3)}€\n`;
  result += `- **Plazo:** Según necesidad\n\n`;
  
  result += `### TOTAL\n`;
  result += `- **Inversión Completa:** ${baseAmount}€ - ${Math.round(baseAmount*1.3)}€\n`;
  result += `- **Plazo Total:** 6 meses\n\n`;
  
  return result;
}

// Función para generar una tabla de riesgos para el reporte de ejemplo
function generateRisksTable(): string {
  // Formato visual mejorado con listas estructuradas
  let result = '';
  
  result += `### Resistencia al cambio\n`;
  result += `- **Probabilidad:** 4/5\n`;
  result += `- **Impacto:** 5/5\n`;
  result += `- **Nivel Total:** 20 (Alto)\n`;
  result += `- **Estrategia de Mitigación:** Programa de gestión del cambio\n\n`;
  
  result += `### Integración técnica\n`;
  result += `- **Probabilidad:** 3/5\n`;
  result += `- **Impacto:** 4/5\n`;
  result += `- **Nivel Total:** 12 (Medio)\n`;
  result += `- **Estrategia de Mitigación:** Pruebas de concepto escalonadas\n\n`;
  
  result += `### Restricción presupuestaria\n`;
  result += `- **Probabilidad:** 2/5\n`;
  result += `- **Impacto:** 5/5\n`;
  result += `- **Nivel Total:** 10 (Medio)\n`;
  result += `- **Estrategia de Mitigación:** Implementación por fases\n\n`;
  
  result += `### Falta de capacidades internas\n`;
  result += `- **Probabilidad:** 3/5\n`;
  result += `- **Impacto:** 3/5\n`;
  result += `- **Nivel Total:** 9 (Medio)\n`;
  result += `- **Estrategia de Mitigación:** Capacitación y soporte externo\n\n`;
  
  return result;
}