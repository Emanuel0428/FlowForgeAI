import React, { useState } from 'react';
import { Send, Lightbulb, CheckCircle, ArrowRight, Sparkles, Zap, Eye, EyeOff, Mic } from 'lucide-react';
import VoiceToTextButton from './VoiceToTextButton';
import { SupportedLanguage } from '../config/elevenlabs';
import { useLanguage } from '../config/language';

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
  const { language, t } = useLanguage();
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'options' | 'custom'>('options');
  const [error, setError] = useState('');
  const [showProfileInfo, setShowProfileInfo] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Función para resaltar términos importantes
  const highlightImportantTerms = (text: string) => {
    const importantTerms = [
      // Siglas en inglés
      'ROI', 'ROAS', 'CRM', 'SEO', 'HRIS',
      // Términos en inglés y español
      'marketing de crecimiento', 'growth marketing', 'automatización', 'automation',
      'optimización', 'optimization', 'digital', 'intelligence', 'inteligencia',
      'ingresos', 'revenue', 'ahorro en costos', 'cost savings', 'mejora', 'improvement',
      'adquisición de clientes', 'customer acquisition', 'conversión', 'conversion',
      'análisis', 'analysis', 'escalabilidad', 'scalability', 'eficiencia', 'efficiency',
      'transformación', 'transformation', 'innovación', 'innovation',
      'ventaja competitiva', 'competitive advantage', 'mercado', 'market',
      'proceso', 'process', 'estrategia', 'strategy', 'rendimiento', 'performance',
      'crecimiento', 'growth', 'automatización de marketing', 'marketing automation',
      'experiencia del cliente', 'customer experience', 'toma de decisiones', 'decision-making',
      'flujo de efectivo', 'cash flow', 'satisfacción', 'satisfaction',
      'tráfico orgánico', 'organic traffic', 'contenido', 'content',
      'producto', 'product', 'tiempo al mercado', 'time to market', 'éxito', 'success'
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
    const esOptions: Record<string, string[]> = {
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

    const enOptions: Record<string, string[]> = {
      'empresa-general': [
        'I need a comprehensive digital transformation strategy to optimize all my processes',
        'I want to automate manual workflows that consume 40% of my team\'s time',
        'I\'m looking to implement an integrated ERP/CRM to centralize business information',
        'I need to create real-time KPIs and dashboards to improve decision making',
        'I want to develop a data-driven culture and scalable processes for growth'
      ],
      'marketing-digital': [
        'I need to reduce my CAC and improve ROAS of my Google Ads and Facebook campaigns',
        'I want to implement marketing automation for lead nurturing and email marketing',
        'I\'m looking to optimize my conversion funnel from visitor to recurring customer',
        'I need to improve my organic SEO and content marketing strategy to generate more leads',
        'I want to create an attribution modeling system to measure the real ROI of each channel'
      ],
      'ventas-crm': [
        'I need to automate my sales pipeline and opportunity tracking',
        'I want to implement automated lead scoring and qualification to prioritize prospects',
        'I\'m looking to reduce my sales cycle and improve lead-to-customer conversion rate',
        'I need to create automatic proposals and quotes to speed up the sales process',
        'I want to integrate my CRM with marketing and customer success for a 360° view of the customer'
      ],
      'finanzas-contabilidad': [
        'I need to automate bank reconciliation and daily accounting records',
        'I want to implement real-time expense control and automatic budgets',
        'I\'m looking to create automatic financial reports and predictive cash flow dashboards',
        'I need to optimize automatic invoicing and accounts receivable tracking',
        'I want to implement profitability analysis by product/service and cost centers'
      ],
      'recursos-humanos': [
        'I need to automate the recruitment process from posting to onboarding',
        'I want to implement digital performance evaluations and development plans',
        'I\'m looking to optimize payroll, vacation and employee benefits management',
        'I need to create an online training system and skills tracking',
        'I want to implement people analytics to predict turnover and improve retention'
      ],
      'atencion-cliente': [
        'I need to implement an intelligent chatbot for 24/7 handling of frequent inquiries',
        'I want to automate the ticket system and escalation of complex cases',
        'I\'m looking to create a self-service help center with knowledge base',
        'I need to improve response times and implement automatic SLAs',
        'I want to integrate all channels (email, chat, phone, social) into one platform'
      ],
      'contenido-digital': [
        'I need to automate the creation and scheduling of social media content',
        'I want to optimize my SEO strategy and keyword positioning',
        'I\'m looking to implement an editorial calendar and content approval workflow',
        'I need to create a multichannel distribution system and content repurposing',
        'I want to measure the ROI of my content marketing and optimize based on performance'
      ],
      'estrategia-producto': [
        'I need to validate product ideas with user research and market analysis',
        'I want to optimize my product roadmap based on feedback and usage metrics',
        'I\'m looking to implement agile methodologies and feature prioritization frameworks',
        'I need to create a competitive analysis and market intelligence system',
        'I want to improve the user experience and optimize product onboarding'
      ],
      'innovacion-rd': [
        'I need to establish a systematic innovation process and idea management',
        'I want to create an experimentation and rapid prototyping laboratory',
        'I\'m looking to implement design thinking and lean startup methodologies',
        'I need to develop technology partnerships and trend scouting',
        'I want to create innovation metrics and a balanced R&D project portfolio'
      ]
    };

    const options = language === 'en' ? enOptions : esOptions;
    return options[activeModuleId] || options['empresa-general'];
  };

  const moduleOptions = getModuleOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalInput = inputMode === 'options' ? selectedOption : input;
    
    if (!finalInput?.trim()) {
      setError(language === 'en' 
        ? 'Please select an option or describe your specific need'
        : 'Por favor, selecciona una opción o describe tu necesidad específica');
      return;
    }

    if (inputMode === 'custom' && finalInput.trim().length < 20) {
      setError(language === 'en'
        ? 'Please provide more details (minimum 20 characters)'
        : 'Por favor, proporciona más detalles (mínimo 20 caracteres)');
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
      <div className="liquid-card bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10 p-6 sm:p-8 md:p-10 mb-8 border border-iridescent-blue/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        
        {/* Header with toggle button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-start flex-1">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 mr-4 liquid-glow-hover organic-shape">
              <Lightbulb className="h-6 w-6 text-iridescent-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                📊 {language === 'en' ? 'Personalized Business Analysis' : 'Análisis Empresarial Personalizado'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'en' 
                  ? 'Based on your specific profile and business objectives'
                  : 'Basado en tu perfil específico y objetivos de negocio'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfileInfo(!showProfileInfo)}
            className="p-2 rounded-xl bg-liquid-surface/30 hover:bg-liquid-surface/50 border border-liquid-border/30 hover:border-iridescent-blue/30 transition-all duration-300 liquid-button group"
            type="button"
            title={showProfileInfo 
              ? (language === 'en' ? "Hide information" : "Ocultar información")
              : (language === 'en' ? "Show information" : "Mostrar información")}
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
              {language === 'en' ? 'Smart Options' : 'Opciones Inteligentes'}
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
              {language === 'en' ? 'Custom Description' : 'Descripción Personalizada'}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 relative">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              {inputMode === 'options' 
                ? (language === 'en' ? 'Select Your Main Challenge' : 'Selecciona tu Desafío Principal')
                : (language === 'en' ? 'Tell Us Your Specific Challenge' : 'Cuéntanos tu Desafío Específico')
              }
            </h2>
            <p className="text-gray-400 text-base">
              {inputMode === 'options'
                ? (language === 'en' 
                   ? 'Choose the option that best describes your current business need'
                   : 'Elige la opción que mejor describa tu necesidad empresarial actual')
                : (language === 'en'
                   ? 'Describe in detail your specific challenge to get a customized analysis'
                   : 'Describe en detalle tu desafío específico para obtener un análisis personalizado')
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inputMode === 'options' ? (
              <div className="space-y-3">
                {moduleOptions.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer liquid-button ${
                      selectedOption === option 
                        ? 'bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 border-iridescent-blue/40 shadow-lg liquid-glow'
                        : 'bg-liquid-surface/30 border-liquid-border/30 hover:bg-liquid-surface/50 hover:border-iridescent-blue/20'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                        selectedOption === option 
                          ? 'bg-iridescent-blue text-white'
                          : 'bg-liquid-surface/50 text-gray-400'
                      }`}>
                        {selectedOption === option ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                        )}
                      </div>
                      <p className={`flex-1 ${
                        selectedOption === option ? 'text-white' : 'text-gray-300'
                      }`}>
                        {option}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="flex">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={dynamicPlaceholder}
                      className="w-full min-h-[200px] p-5 rounded-l-2xl bg-liquid-surface/30 border border-liquid-border/30 focus:border-iridescent-blue/40 focus:outline-none focus:ring-0 transition-all duration-300 placeholder-gray-500 text-white resize-none"
                      disabled={isLoading}
                    />
                    
                    {/* Voice to text button */}
                    <div className="absolute bottom-4 right-4">
                      <VoiceToTextButton
                        onTranscription={handleInputChange}
                        isActive={isVoiceActive}
                        setIsActive={setIsVoiceActive}
                        language={language}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-400 text-sm px-2">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || (!selectedOption && inputMode === 'options') || (input.trim().length < 20 && inputMode === 'custom')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-500 flex items-center space-x-2 ${
                  isLoading || (!selectedOption && inputMode === 'options') || (input.trim().length < 20 && inputMode === 'custom')
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white transform hover:scale-105 shadow-lg liquid-glow-hover'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>{language === 'en' ? 'Processing...' : 'Procesando...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'en' ? 'Generate Analysis' : 'Generar Análisis'}</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModuleInputForm;