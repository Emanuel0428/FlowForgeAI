import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Share, BookOpen, Sparkles, Zap, TrendingUp, BarChart3, PieChart, Target, DollarSign, Clock, Users, Award, AlertTriangle, FileDown } from 'lucide-react';
import { generateReportPDF } from '../utils/pdfGenerator';

interface ReportDisplayProps {
  reportContent: string;
  moduleTitle?: string;
  userProfile?: any;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportContent, moduleTitle, userProfile }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-flowforge-ai-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    try {      
      // Mostrar indicador de carga
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet text-white px-6 py-3 rounded-2xl shadow-lg z-50 flex items-center';
      loadingToast.innerHTML = `
        <div class="liquid-loader w-5 h-5 mr-3"></div>
        Generando PDF profesional...
      `;
      document.body.appendChild(loadingToast);
      
      // Generar PDF
      await generateReportPDF(
        reportContent, 
        moduleTitle || 'Reporte FlowForge AI',
        userProfile
      );
      
      // Remover indicador de carga
      document.body.removeChild(loadingToast);
      
      // Mostrar mensaje de éxito
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg z-50 flex items-center';
      successToast.innerHTML = `
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        PDF descargado exitosamente
      `;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      
      // Mostrar mensaje de error
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl shadow-lg z-50 flex items-center';
      errorToast.innerHTML = `
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Error al generar PDF
      `;
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Reporte FlowForge AI',
          text: 'Mira este reporte personalizado generado por FlowForge AI',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      
      // Mostrar mensaje de copiado
      const copyToast = document.createElement('div');
      copyToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet text-white px-6 py-3 rounded-2xl shadow-lg z-50 flex items-center';
      copyToast.innerHTML = `
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        Link copiado al portapapeles
      `;
      document.body.appendChild(copyToast);
      
      setTimeout(() => {
        if (document.body.contains(copyToast)) {
          document.body.removeChild(copyToast);
        }
      }, 3000);
    }
  };

  // Función para crear gráficos ASCII simples
  const createBarChart = (data: { label: string; value: number; color: string }[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="my-6 p-6 liquid-card bg-gradient-to-r from-liquid-surface/30 to-iridescent-blue/5 border border-iridescent-blue/20 rounded-2xl" id="progress-chart">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-300 truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-liquid-surface/30 rounded-full h-6 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xs font-bold text-white">
                    {item.value}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Función para crear métricas destacadas
  const createMetricCard = (icon: React.ReactNode, title: string, value: string, change: string, color: string) => (
    <div className={`liquid-card bg-gradient-to-br ${color} p-6 rounded-2xl border border-iridescent-blue/20 relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-iridescent-cyan font-medium">{change}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );

  // Función para crear timeline
  const createTimeline = (phases: { title: string; duration: string; description: string }[]) => (
    <div className="my-6 space-y-4" id="implementation-timeline">
      {phases.map((phase, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
              index === 0 ? 'from-iridescent-blue to-iridescent-violet' :
              index === 1 ? 'from-iridescent-violet to-iridescent-cyan' :
              index === 2 ? 'from-iridescent-cyan to-iridescent-emerald' :
              'from-iridescent-emerald to-iridescent-blue'
            } flex items-center justify-center text-white font-bold text-sm`}>
              {index + 1}
            </div>
            {index < phases.length - 1 && (
              <div className="w-0.5 h-12 bg-gradient-to-b from-iridescent-blue/50 to-transparent mt-2"></div>
            )}
          </div>
          <div className="flex-1 liquid-card bg-liquid-surface/30 p-4 rounded-xl border border-iridescent-blue/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">{phase.title}</h4>
              <span className="text-xs px-2 py-1 bg-iridescent-blue/20 text-iridescent-cyan rounded-lg font-medium">
                {phase.duration}
              </span>
            </div>
            <p className="text-sm text-gray-300">{phase.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto relative" ref={reportRef}>
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-glow-gradient opacity-10 rounded-3xl blur-xl"></div>
      
      {/* Header */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 text-white rounded-t-3xl p-4 sm:p-6 md:p-8 border border-iridescent-blue/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        <div className="absolute inset-0 bg-glow-gradient opacity-20"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-iridescent-blue/30 to-iridescent-violet/30 mr-4 liquid-glow-hover organic-shape">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-iridescent-cyan animate-pulse" />
                Reporte Estratégico Profesional
              </h1>
              <p className="text-iridescent-blue/80 text-lg flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Análisis de Consultoría Nivel McKinsey • Generado el {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 rounded-2xl transition-all duration-300 liquid-button border border-iridescent-blue/30 hover:border-iridescent-cyan/50"
              title="Compartir reporte"
            >
              <Share className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 rounded-2xl transition-all duration-300 liquid-button border border-iridescent-blue/30 hover:border-iridescent-cyan/50"
              title="Descargar Markdown"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
              title="Descargar PDF Profesional"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              <FileDown className="h-5 w-5 mr-2" />
              PDF Profesional
            </button>
          </div>
        </div>
      </div>

      {/* Professional Report Badge */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-emerald/10 to-iridescent-cyan/10 p-4 border-x border-iridescent-blue/20 relative overflow-hidden">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center text-iridescent-cyan">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="font-medium">Análisis Cuantitativo</span>
          </div>
          <div className="w-1 h-4 bg-iridescent-blue/30"></div>
          <div className="flex items-center text-iridescent-emerald">
            <PieChart className="w-4 h-4 mr-2" />
            <span className="font-medium">ROI Proyectado</span>
          </div>
          <div className="w-1 h-4 bg-iridescent-blue/30"></div>
          <div className="flex items-center text-iridescent-violet">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="font-medium">Benchmarks de Industria</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="liquid-card bg-liquid-surface/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 border-x border-liquid-border" id="metrics-dashboard">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-iridescent-cyan" />
          Métricas Clave del Proyecto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {createMetricCard(
            <DollarSign className="h-6 w-6 text-iridescent-emerald" />,
            "ROI Proyectado",
            "45%",
            "+15% vs. benchmark",
            "from-emerald-900/20 to-emerald-800/20"
          )}
          {createMetricCard(
            <Clock className="h-6 w-6 text-iridescent-blue" />,
            "Tiempo de Implementación",
            "12 meses",
            "30% más rápido",
            "from-blue-900/20 to-blue-800/20"
          )}
          {createMetricCard(
            <Users className="h-6 h-6 text-iridescent-violet" />,
            "Impacto en Productividad",
            "35%",
            "Mejora estimada",
            "from-violet-900/20 to-violet-800/20"
          )}
          {createMetricCard(
            <Award className="h-6 w-6 text-iridescent-cyan" />,
            "Nivel de Confianza",
            "92%",
            "Alta probabilidad",
            "from-cyan-900/20 to-cyan-800/20"
          )}
        </div>

        {/* Gráfico de Progreso de Implementación Mejorado */}
        <div className="mb-8" id="implementation-progress-chart">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-iridescent-blue" />
            📈 Progreso de Implementación Proyectado
          </h3>
          {createBarChart([
            { label: "Mes 1-3: Fundación", value: 25, color: "bg-gradient-to-r from-iridescent-blue to-iridescent-violet" },
            { label: "Mes 4-6: Desarrollo", value: 50, color: "bg-gradient-to-r from-iridescent-violet to-iridescent-cyan" },
            { label: "Mes 7-9: Integración", value: 75, color: "bg-gradient-to-r from-iridescent-cyan to-iridescent-emerald" },
            { label: "Mes 10-12: Optimización", value: 100, color: "bg-gradient-to-r from-iridescent-emerald to-iridescent-blue" }
          ])}
          
          {/* Indicadores adicionales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-iridescent-blue/10 border border-iridescent-blue/20">
              <div className="text-sm text-iridescent-blue font-medium">Automatización</div>
              <div className="text-lg font-bold text-white">75%</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-iridescent-violet/10 border border-iridescent-violet/20">
              <div className="text-sm text-iridescent-violet font-medium">Integración</div>
              <div className="text-lg font-bold text-white">85%</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-iridescent-cyan/10 border border-iridescent-cyan/20">
              <div className="text-sm text-iridescent-cyan font-medium">Capacitación</div>
              <div className="text-lg font-bold text-white">90%</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-iridescent-emerald/10 border border-iridescent-emerald/20">
              <div className="text-sm text-iridescent-emerald font-medium">Optimización</div>
              <div className="text-lg font-bold text-white">95%</div>
            </div>
          </div>
        </div>

        {/* Timeline de Implementación Mejorado */}
        <div className="mb-8" id="roadmap-timeline">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-iridescent-violet" />
            🛤️ Hoja de Ruta de Implementación
          </h3>
          {createTimeline([
            {
              title: "Fase 1: Fundación",
              duration: "Semanas 1-8",
              description: "Configuración inicial, selección de herramientas y primeras automatizaciones básicas"
            },
            {
              title: "Fase 2: Implementación Core",
              duration: "Semanas 9-20",
              description: "Despliegue de sistemas principales e integración de procesos críticos de negocio"
            },
            {
              title: "Fase 3: Optimización",
              duration: "Semanas 21-32",
              description: "Ajuste fino, capacitación avanzada y optimización de rendimiento del sistema"
            },
            {
              title: "Fase 4: Innovación",
              duration: "Semanas 33-52",
              description: "Capacidades avanzadas de IA/ML y establecimiento de mejora continua"
            }
          ])}
          
          {/* Indicadores de progreso por fase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                <span className="text-emerald-400 font-medium text-sm">COMPLETADA</span>
              </div>
              <div className="text-white font-semibold">Fase 1: Fundación</div>
              <div className="text-emerald-300 text-sm mt-1">100% Finalizada</div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-blue-400 font-medium text-sm">EN PROGRESO</span>
              </div>
              <div className="text-white font-semibold">Fase 2: Desarrollo</div>
              <div className="text-blue-300 text-sm mt-1">75% Completada</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gray-700/20 border border-gray-500/30">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-400 font-medium text-sm">PLANIFICADA</span>
              </div>
              <div className="text-white font-semibold">Fase 3: Optimización</div>
              <div className="text-gray-300 text-sm mt-1">Próximos 2 meses</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gray-700/20 border border-gray-500/30">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-400 font-medium text-sm">PLANIFICADA</span>
              </div>
              <div className="text-white font-semibold">Fase 4: Innovación</div>
              <div className="text-gray-300 text-sm mt-1">Q4 2025</div>
            </div>
          </div>
        </div>

        {/* Análisis de ROI Visual */}
        <div className="mb-8" id="roi-analysis-chart">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-3 text-iridescent-emerald" />
            💰 Análisis Detallado de ROI
          </h3>
          
          {/* Métricas de ROI destacadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-300 text-sm font-medium">Inversión Total</span>
                <span className="text-red-400">💸</span>
              </div>
              <div className="text-2xl font-bold text-white">$125K</div>
              <div className="text-red-300 text-xs">Inversión inicial</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-300 text-sm font-medium">ROI Proyectado</span>
                <span className="text-emerald-400">📈</span>
              </div>
              <div className="text-2xl font-bold text-white">245%</div>
              <div className="text-emerald-300 text-xs">A los 24 meses</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 text-sm font-medium">Punto de Equilibrio</span>
                <span className="text-blue-400">⚖️</span>
              </div>
              <div className="text-2xl font-bold text-white">8-10</div>
              <div className="text-blue-300 text-xs">Meses</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-900/20 to-violet-800/20 border border-violet-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-violet-300 text-sm font-medium">Retorno Total</span>
                <span className="text-violet-400">💎</span>
              </div>
              <div className="text-2xl font-bold text-white">$430K</div>
              <div className="text-violet-300 text-xs">Proyectado 36M</div>
            </div>
          </div>
          
          {/* Gráfico de ROI simplificado con barras */}
          <div className="p-6 rounded-xl bg-liquid-surface/30 border border-liquid-border">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-iridescent-emerald" />
              Proyección de Retorno de Inversión
            </h4>
            <div className="space-y-4">
              {[
                { period: 'Q1 2025', investment: -125000, return: 25000, net: -100000 },
                { period: 'Q2 2025', investment: -25000, return: 75000, net: -50000 },
                { period: 'Q3 2025', investment: -10000, return: 125000, net: 65000 },
                { period: 'Q4 2025', investment: 0, return: 180000, net: 245000 }
              ].map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-300">{data.period}</div>
                  <div className="flex-1 relative">
                    <div className="h-8 bg-liquid-surface/50 rounded-lg overflow-hidden">
                      {/* Barra de inversión (roja) */}
                      {data.investment < 0 && (
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 absolute left-0"
                          style={{ width: `${Math.abs(data.investment) / 200000 * 50}%` }}
                        ></div>
                      )}
                      {/* Barra de retorno (verde) */}
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 absolute"
                        style={{ 
                          left: data.investment < 0 ? `${Math.abs(data.investment) / 200000 * 50}%` : '0%',
                          width: `${data.return / 200000 * 50}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-red-300">
                        {data.investment < 0 ? `Inv: $${Math.abs(data.investment/1000)}K` : ''}
                      </span>
                      <span className="text-emerald-300">Ret: ${data.return/1000}K</span>
                      <span className={data.net >= 0 ? "text-emerald-300" : "text-red-300"}>
                        Neto: ${data.net/1000}K
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análisis de Riesgos */}
        <div className="liquid-card bg-gradient-to-r from-orange-900/20 to-red-900/20 p-6 rounded-2xl border border-orange-500/30 mb-8" id="risk-analysis">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Análisis de Riesgos y Mitigación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-orange-300">Riesgos Identificados:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Resistencia al cambio organizacional
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Complejidad de integración técnica
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Posibles sobrecostos de implementación
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-green-300">Estrategias de Mitigación:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Programa de gestión del cambio
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Implementación por fases
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  Reservas de contingencia del 15%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="liquid-card bg-liquid-surface/40 backdrop-blur-xl shadow-2xl rounded-b-3xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-auto border-x border-b border-liquid-border relative">
        <div className="prose prose-lg max-w-none prose-invert 
          prose-headings:text-white 
          prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-iridescent-blue/30 prose-h1:iridescent-text prose-h1:flex prose-h1:items-center
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-iridescent-cyan prose-h2:flex prose-h2:items-center prose-h2:border-l-4 prose-h2:border-iridescent-blue prose-h2:pl-4 prose-h2:bg-gradient-to-r prose-h2:from-iridescent-blue/10 prose-h2:to-transparent prose-h2:py-3 prose-h2:rounded-r-xl
          prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-200 prose-h3:flex prose-h3:items-center prose-h3:border-l-2 prose-h3:border-iridescent-violet prose-h3:pl-3
          prose-h4:text-lg prose-h4:font-medium prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-iridescent-emerald
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
          prose-ul:my-6 prose-li:my-3 prose-li:text-gray-300 prose-li:text-lg prose-li:leading-relaxed
          prose-ol:my-6 prose-ol:text-gray-300
          prose-strong:text-white prose-strong:font-semibold prose-strong:bg-gradient-to-r prose-strong:from-iridescent-blue/20 prose-strong:to-iridescent-violet/20 prose-strong:px-1 prose-strong:rounded
          prose-em:text-iridescent-cyan prose-em:font-medium
          prose-blockquote:border-l-4 prose-blockquote:border-iridescent-blue prose-blockquote:bg-gradient-to-r prose-blockquote:from-iridescent-blue/10 prose-blockquote:to-iridescent-violet/5 prose-blockquote:p-6 prose-blockquote:my-8 prose-blockquote:rounded-r-2xl prose-blockquote:backdrop-blur-sm prose-blockquote:relative
          prose-code:bg-liquid-surface prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:text-sm prose-code:text-iridescent-cyan prose-code:border prose-code:border-iridescent-blue/30
          prose-pre:bg-liquid-surface prose-pre:border prose-pre:border-liquid-border prose-pre:rounded-2xl prose-pre:p-6
          prose-table:border-collapse prose-table:border prose-table:border-liquid-border prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-gradient-to-r prose-th:from-iridescent-blue/20 prose-th:to-iridescent-violet/20 prose-th:text-white prose-th:font-semibold prose-th:p-4 prose-th:border prose-th:border-liquid-border
          prose-td:p-4 prose-td:border prose-td:border-liquid-border prose-td:text-gray-300
        ">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="flex items-center">
                  <BarChart3 className="w-10 h-10 mr-4 text-iridescent-cyan" />
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="flex items-center border-l-4 border-iridescent-blue pl-4 bg-gradient-to-r from-iridescent-blue/10 to-transparent py-3 rounded-r-xl">
                  <TrendingUp className="w-6 h-6 mr-3 text-iridescent-violet" />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="flex items-center border-l-2 border-iridescent-violet pl-3">
                  <div className="w-2 h-2 bg-iridescent-cyan rounded-full mr-3 animate-pulse"></div>
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-iridescent-emerald rounded-full mr-2"></div>
                  {children}
                </h4>
              ),
              blockquote: ({ children }) => (
                <blockquote className="liquid-card border-l-4 border-iridescent-blue bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/5 p-6 my-8 rounded-r-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
                  <div className="absolute top-2 right-4">
                    <Sparkles className="w-4 h-4 text-iridescent-cyan/50" />
                  </div>
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-3">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-to-r from-iridescent-blue to-iridescent-violet rounded-full mr-3 mt-3 flex-shrink-0"></span>
                  <span>{children}</span>
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-8">
                  <table className="w-full border-collapse border border-liquid-border rounded-xl overflow-hidden liquid-card">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 text-white font-semibold p-4 border border-liquid-border text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="p-4 border border-liquid-border text-gray-300">
                  {children}
                </td>
              ),
              // Custom component for highlighting key metrics
              strong: ({ children }) => {
                const text = children?.toString() || '';
                // Check if it's a percentage, dollar amount, or key metric
                if (text.includes('%') || text.includes('$') || text.includes('ROI') || text.includes('KPI')) {
                  return (
                    <strong className="inline-flex items-center bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 px-2 py-1 rounded-lg text-white font-semibold border border-iridescent-blue/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {children}
                    </strong>
                  );
                }
                return <strong className="text-white font-semibold bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 px-1 rounded">{children}</strong>;
              }
            }}
          >
            {reportContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Professional Footer */}
      <div className="liquid-card bg-gradient-to-r from-liquid-surface/30 to-iridescent-blue/5 backdrop-blur-sm rounded-b-2xl p-4 sm:p-6 md:p-8 mt-6 border border-liquid-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-6 space-x-8">
            <div className="flex items-center text-iridescent-cyan">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Análisis Cuantitativo</span>
            </div>
            <div className="flex items-center text-iridescent-emerald">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Proyecciones ROI</span>
            </div>
            <div className="flex items-center text-iridescent-violet">
              <PieChart className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Benchmarks Industria</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-300 mb-6 flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-iridescent-cyan" />
            ¿Quieres explorar otro módulo o generar un análisis complementario?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              <Zap className="w-5 h-5 mr-2" />
              Explorar Otro Módulo
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              <FileDown className="w-5 h-5 mr-2" />
              Descargar PDF Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDisplay;