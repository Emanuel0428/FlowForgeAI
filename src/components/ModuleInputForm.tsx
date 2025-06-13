import React, { useState } from 'react';
import { Send, Lightbulb, CheckCircle, ArrowRight, Sparkles, Zap, Eye, EyeOff } from 'lucide-react';

interface ModuleInputFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
  dynamicPlaceholder: string;
  moduleIntro: string;
  activeModuleId: string;
}

const ModuleInputForm: React.FC<ModuleInputFormProps> = ({ 
  onSubmit, 
  isLoading, 
  dynamicPlaceholder,
  moduleIntro,
  activeModuleId
}) => {
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'options' | 'custom'>('options');
  const [error, setError] = useState('');
  const [showProfileInfo, setShowProfileInfo] = useState(true);

  // Función para resaltar términos importantes
  const highlightImportantTerms = (text: string) => {
    const importantTerms = [
      // Siglas en inglés
      'ROI', 'ROAS', 'CRM', 'SEO', 'RRHH',
      // Términos en español
      'marketing de crecimiento', 'automatización', 'optimización', 'digital', 'inteligencia',
      'ingresos', 'ahorro en costos', 'mejora', 'adquisición de clientes', 'conversión',
      'análisis', 'escalabilidad', 'eficiencia', 'transformación', 'innovación',
      'ventaja competitiva', 'mercado', 'proceso', 'estrategia', 'rendimiento',
      'crecimiento', 'automatización de marketing', 'experiencia del cliente',
      'toma de decisiones', 'flujo de efectivo', 'satisfacción', 'tráfico orgánico',
      'contenido', 'producto', 'tiempo al mercado', 'éxito'
    ];
    
    let highlightedText = text;
    
    importantTerms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="highlight-term">$1</mark>`);
    });
    
    return highlightedText;
  };

  // Opciones específicas por módulo
  const getModuleOptions = () => {
    const options: Record<string, string[]> = {
      'empresa-general': [
        'Necesito una estrategia integral de transformación digital para optimizar todos mis procesos',
        'Quiero automatizar workflows manuales que consumen el 40% del tiempo de mi equipo',
        'Busco implementar un ERP/CRM integrado para centralizar la información empresarial',
        'Necesito crear KPIs y dashboards en tiempo real para mejorar la toma de decisiones',
        'Quiero desarrollar una cultura data-driven y procesos escalables para el crecimiento'
      ],
      'marketing-digital': [
        'Necesito reducir mi CAC y mejorar el ROAS de mis campañas de Google Ads y Facebook',
        'Quiero implementar marketing automation para nurturing de leads y email marketing',
        'Busco optimizar mi funnel de conversión desde visitante hasta cliente recurrente',
        'Necesito mejorar mi SEO orgánico y estrategia de content marketing para generar más leads',
        'Quiero crear un sistema de attribution modeling para medir el ROI real de cada canal'
      ],
      'ventas-crm': [
        'Necesito automatizar mi pipeline de ventas y seguimiento de oportunidades',
        'Quiero implementar lead scoring y qualification automática para priorizar prospectos',
        'Busco reducir mi ciclo de ventas y mejorar la tasa de conversión de leads a clientes',
        'Necesito crear propuestas y cotizaciones automáticas para acelerar el proceso comercial',
        'Quiero integrar mi CRM con marketing y customer success para una vista 360° del cliente'
      ],
      'finanzas-contabilidad': [
        'Necesito automatizar la conciliación bancaria y el registro contable diario',
        'Quiero implementar control de gastos en tiempo real y presupuestos automáticos',
        'Busco crear reportes financieros automáticos y dashboards de cash flow predictivo',
        'Necesito optimizar la facturación automática y seguimiento de cuentas por cobrar',
        'Quiero implementar análisis de rentabilidad por producto/servicio y centro de costos'
      ],
      'recursos-humanos': [
        'Necesito automatizar el proceso de reclutamiento desde publicación hasta onboarding',
        'Quiero implementar evaluaciones de desempeño digitales y planes de desarrollo',
        'Busco optimizar la gestión de nómina, vacaciones y beneficios de empleados',
        'Necesito crear un sistema de capacitación online y tracking de competencias',
        'Quiero implementar people analytics para predecir rotación y mejorar retención'
      ],
      'atencion-cliente': [
        'Necesito implementar un chatbot inteligente para atención 24/7 de consultas frecuentes',
        'Quiero automatizar el sistema de tickets y escalamiento de casos complejos',
        'Busco crear un centro de ayuda self-service con base de conocimientos',
        'Necesito mejorar los tiempos de respuesta y implementar SLAs automáticos',
        'Quiero integrar todos los canales (email, chat, teléfono, redes) en una plataforma'
      ],
      'contenido-digital': [
        'Necesito automatizar la creación y programación de contenido en redes sociales',
        'Quiero optimizar mi estrategia de SEO y posicionamiento de palabras clave',
        'Busco implementar un calendario editorial y workflow de aprobación de contenido',
        'Necesito crear un sistema de distribución multicanal y repurposing de contenido',
        'Quiero medir el ROI de mi content marketing y optimizar según performance'
      ],
      'estrategia-producto': [
        'Necesito validar ideas de producto con research de usuarios y análisis de mercado',
        'Quiero optimizar mi roadmap de producto basado en feedback y métricas de uso',
        'Busco implementar metodologías ágiles y frameworks de priorización de features',
        'Necesito crear un sistema de análisis competitivo y market intelligence',
        'Quiero mejorar la experiencia de usuario y optimizar el onboarding de producto'
      ],
      'innovacion-rd': [
        'Necesito establecer un proceso sistemático de innovación y gestión de ideas',
        'Quiero crear un laboratorio de experimentación y prototipado rápido',
        'Busco implementar metodologías de design thinking y lean startup',
        'Necesito desarrollar partnerships tecnológicos y scouting de tendencias',
        'Quiero crear métricas de innovación y un portfolio balanceado de proyectos R&D'
      ]
    };

    return options[activeModuleId] || options['empresa-general'];
  };

  const moduleOptions = getModuleOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalInput = inputMode === 'options' ? selectedOption : input;
    
    if (!finalInput?.trim()) {
      setError('Por favor, selecciona una opción o describe tu necesidad específica');
      return;
    }

    if (inputMode === 'custom' && finalInput.trim().length < 20) {
      setError('Por favor, proporciona más detalles (mínimo 20 caracteres)');
      return;
    }

    setError('');
    onSubmit(finalInput.trim());
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (error) setError('');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (error) setError('');
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-glow-gradient opacity-10 rounded-3xl blur-xl"></div>
      
      {/* Module Introduction */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10 p-8 mb-8 border border-iridescent-blue/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        
        {/* Header with toggle button */}
        <div className="flex items-start justify-between relative z-10 mb-4">
          <div className="flex items-start flex-1">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 mr-4 liquid-glow-hover organic-shape">
              <Lightbulb className="h-6 w-6 text-iridescent-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Análisis Empresarial Personalizado</h3>
              <p className="text-sm text-gray-400">Basado en tu perfil específico y objetivos de negocio</p>
            </div>
          </div>
          <button
            onClick={() => setShowProfileInfo(!showProfileInfo)}
            className="p-2 rounded-xl bg-liquid-surface/30 hover:bg-liquid-surface/50 border border-liquid-border/30 hover:border-iridescent-blue/30 transition-all duration-300 liquid-button group"
            type="button"
            title={showProfileInfo ? "Ocultar información" : "Mostrar información"}
          >
            {showProfileInfo ? (
              <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-iridescent-blue transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 group-hover:text-iridescent-blue transition-colors" />
            )}
          </button>
        </div>

        {/* Collapsible content */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showProfileInfo ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-liquid-surface/20 backdrop-blur-sm rounded-2xl p-6 border border-liquid-border/20">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed text-base space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {moduleIntro.split('. ').map((sentence, index) => {
                  if (sentence.trim()) {
                    return (
                      <p key={index} className="mb-3 last:mb-0">
                        <span 
                          dangerouslySetInnerHTML={{ 
                            __html: highlightImportantTerms(sentence.trim() + '.') 
                          }} 
                        />
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="liquid-card bg-liquid-surface/40 backdrop-blur-xl overflow-hidden relative">
        {/* Mode Toggle */}
        <div className="bg-liquid-navy/50 p-6 border-b border-liquid-border/30 relative">
          <div className="flex items-center justify-center space-x-2 bg-liquid-charcoal/50 rounded-2xl p-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setInputMode('options')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-500 liquid-button ${
                inputMode === 'options'
                  ? 'bg-gradient-to-r from-iridescent-blue/30 to-iridescent-violet/30 text-white shadow-lg liquid-glow border border-iridescent-blue/30'
                  : 'text-gray-400 hover:text-white hover:bg-liquid-surface/30'
              }`}
            >
              <Sparkles className="w-5 h-5 mr-2 inline" />
              Opciones Inteligentes
            </button>
            <button
              type="button"
              onClick={() => setInputMode('custom')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-500 liquid-button ${
                inputMode === 'custom'
                  ? 'bg-gradient-to-r from-iridescent-blue/30 to-iridescent-violet/30 text-white shadow-lg liquid-glow border border-iridescent-blue/30'
                  : 'text-gray-400 hover:text-white hover:bg-liquid-surface/30'
              }`}
            >
              <Zap className="w-5 h-5 mr-2 inline" />
              Descripción Personalizada
            </button>
          </div>
        </div>

        <div className="p-8 relative">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              {inputMode === 'options' ? 'Selecciona tu Desafío Principal' : 'Cuéntanos tu Desafío Específico'}
            </h2>
            <p className="text-gray-400 text-lg">
              {inputMode === 'options' 
                ? 'Elige la opción que mejor describa tu necesidad actual en este módulo'
                : 'Mientras más específico seas, más personalizado será tu reporte de recomendaciones.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inputMode === 'options' ? (
              <div className="space-y-4">
                {moduleOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg liquid-button group relative overflow-hidden ${
                      selectedOption === option
                        ? 'border-iridescent-blue/50 bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10 shadow-lg liquid-glow'
                        : 'border-liquid-border hover:border-iridescent-blue/30 bg-liquid-surface/20 hover:bg-liquid-surface/40'
                    }`}
                  >
                    <div className="flex items-start relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center transition-all duration-300 ${
                        selectedOption === option
                          ? 'border-iridescent-blue bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow'
                          : 'border-gray-500 group-hover:border-iridescent-blue/50'
                      }`}>
                        {selectedOption === option && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 font-medium leading-relaxed text-lg">
                          {option}
                        </p>
                      </div>
                      <ArrowRight className={`w-6 h-6 ml-4 transition-all duration-300 ${
                        selectedOption === option
                          ? 'text-iridescent-cyan animate-pulse'
                          : 'text-gray-500 group-hover:text-iridescent-blue'
                      }`} />
                    </div>
                    {selectedOption === option && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <label htmlFor="challenge-input" className="block text-lg font-semibold text-gray-200 mb-4">
                  Describe tu necesidad específica
                </label>
                <div className="relative">
                  <textarea
                    id="challenge-input"
                    rows={8}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={dynamicPlaceholder}
                    className={`block w-full px-6 py-4 border rounded-2xl shadow-lg focus:outline-none transition-all duration-500 resize-none backdrop-blur-sm ${
                      error 
                        ? 'border-red-400 bg-red-900/20' 
                        : 'border-liquid-border bg-liquid-surface/30 focus:border-iridescent-blue/50 focus:bg-liquid-surface/50'
                    } text-gray-100 placeholder-gray-500 text-lg liquid-button`}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-glow-gradient opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Mínimo 20 caracteres para un análisis completo
                  </p>
                  <p className={`text-sm font-medium ${
                    input.length < 20 
                      ? 'text-gray-500' 
                      : 'text-iridescent-cyan'
                  }`}>
                    {input.length} caracteres
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl">
                <p className="text-red-300 font-medium">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-liquid-border/30">
              <button
                type="submit"
                disabled={isLoading || (inputMode === 'options' ? !selectedOption : !input.trim())}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg liquid-glow-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                {isLoading ? (
                  <>
                    <div className="liquid-loader w-5 h-5 mr-3"></div>
                    Generando Reporte Inteligente...
                  </>
                ) : (
                  <>
                    Generar Reporte Profesional
                    <Send className="w-5 h-5 ml-3" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-8 liquid-card bg-gradient-to-r from-liquid-surface/30 to-iridescent-blue/5 p-6 border border-iridescent-blue/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-iridescent-cyan animate-pulse" />
              Consejos para obtener mejores recomendaciones:
            </h3>
            <ul className="text-sm text-gray-400 space-y-3">
              <li className="flex items-start">
                <span className="text-iridescent-blue mr-3 text-lg">•</span>
                Menciona herramientas o procesos específicos que ya uses
              </li>
              <li className="flex items-start">
                <span className="text-iridescent-violet mr-3 text-lg">•</span>
                Incluye métricas o números si los tienes disponibles
              </li>
              <li className="flex items-start">
                <span className="text-iridescent-cyan mr-3 text-lg">•</span>
                Describe el resultado ideal que te gustaría lograr
              </li>
              <li className="flex items-start">
                <span className="text-iridescent-emerald mr-3 text-lg">•</span>
                Menciona limitaciones de tiempo, presupuesto o recursos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleInputForm;