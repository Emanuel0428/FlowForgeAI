import React, { useState, useEffect } from 'react';
import { User, Building2, Target, TrendingUp, Globe, Users, DollarSign, Calendar, BarChart3, Lightbulb, Save, Edit3, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Brain } from 'lucide-react';
import { ExtendedUserProfileData } from '../types';
import { UserProfile } from '../types/database';
import { UserProfileService } from '../services/userProfileService';
import AIAssistantButton from './AIAssistantButton';

interface UserProfileViewProps {
  userProfile: UserProfile | null;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ 
  userProfile, 
  onClose, 
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<Partial<ExtendedUserProfileData>>({});

  useEffect(() => {
    if (userProfile) {
      setFormData({
        businessType: userProfile.business_type,
        revenueModel: userProfile.revenue_model,
        businessStage: userProfile.business_stage,
        mainObjective: userProfile.main_objective,
        digitalizationLevel: userProfile.digitalization_level,
        employeeCount: userProfile.employee_count,
        businessName: userProfile.business_name || '',
        businessDescription: userProfile.business_description || '',
        industry: userProfile.industry || '',
        targetMarket: userProfile.target_market || '',
        businessGoals: userProfile.business_goals || '',
        currentChallenges: userProfile.current_challenges || '',
        competitiveAdvantage: userProfile.competitive_advantage || '',
        monthlyRevenue: userProfile.monthly_revenue || '',
        yearlyGrowthTarget: userProfile.yearly_growth_target || '',
        keyProducts: userProfile.key_products || '',
        mainCustomers: userProfile.main_customers || '',
        geographicScope: userProfile.geographic_scope || '',
        businessModel: userProfile.business_model || '',
        technologyStack: userProfile.technology_stack || '',
        marketingChannels: userProfile.marketing_channels || '',
        salesProcess: userProfile.sales_process || '',
        teamStructure: userProfile.team_structure || '',
        budgetRange: userProfile.budget_range || '',
        timeframe: userProfile.timeframe || '',
        successMetrics: userProfile.success_metrics || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: keyof ExtendedUserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleAISuggestion = (field: keyof ExtendedUserProfileData, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Iniciando actualización de perfil...');
      
      // Preparar solo los campos que han cambiado
      const updateData: Partial<ExtendedUserProfileData> = {};
      
      // Comparar cada campo y solo incluir los que han cambiado
      const fieldsToCheck: (keyof ExtendedUserProfileData)[] = [
        'businessName', 'businessDescription', 'industry', 'targetMarket',
        'businessGoals', 'currentChallenges', 'competitiveAdvantage',
        'monthlyRevenue', 'yearlyGrowthTarget', 'keyProducts', 'mainCustomers',
        'geographicScope', 'businessModel', 'technologyStack', 'marketingChannels',
        'salesProcess', 'teamStructure', 'budgetRange', 'timeframe', 'successMetrics'
      ];

      fieldsToCheck.forEach(field => {
        const currentValue = formData[field] || '';
        const originalValue = getOriginalValue(field) || '';
        
        if (currentValue !== originalValue) {
          updateData[field] = currentValue;
        }
      });

      console.log('📝 Campos a actualizar:', Object.keys(updateData));

      if (Object.keys(updateData).length === 0) {
        setSuccess('No hay cambios para guardar');
        setTimeout(() => setSuccess(''), 2000);
        setIsLoading(false);
        return;
      }

      const updatedProfile = await UserProfileService.updateUserProfile(updateData);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
      setSuccess('Perfil actualizado exitosamente');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('❌ Error actualizando perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const getOriginalValue = (field: keyof ExtendedUserProfileData): string => {
    if (!userProfile) return '';
    
    const fieldMapping: Record<keyof ExtendedUserProfileData, string> = {
      businessType: userProfile.business_type,
      revenueModel: userProfile.revenue_model,
      businessStage: userProfile.business_stage,
      mainObjective: userProfile.main_objective,
      digitalizationLevel: userProfile.digitalization_level,
      employeeCount: userProfile.employee_count,
      businessName: userProfile.business_name || '',
      businessDescription: userProfile.business_description || '',
      industry: userProfile.industry || '',
      targetMarket: userProfile.target_market || '',
      businessGoals: userProfile.business_goals || '',
      currentChallenges: userProfile.current_challenges || '',
      competitiveAdvantage: userProfile.competitive_advantage || '',
      monthlyRevenue: userProfile.monthly_revenue || '',
      yearlyGrowthTarget: userProfile.yearly_growth_target || '',
      keyProducts: userProfile.key_products || '',
      mainCustomers: userProfile.main_customers || '',
      geographicScope: userProfile.geographic_scope || '',
      businessModel: userProfile.business_model || '',
      technologyStack: userProfile.technology_stack || '',
      marketingChannels: userProfile.marketing_channels || '',
      salesProcess: userProfile.sales_process || '',
      teamStructure: userProfile.team_structure || '',
      budgetRange: userProfile.budget_range || '',
      timeframe: userProfile.timeframe || '',
      successMetrics: userProfile.success_metrics || '',
    };

    return fieldMapping[field] || '';
  };

  const profileSections = [
    {
      id: 'basic',
      title: 'Información Básica',
      icon: Building2,
      color: 'from-iridescent-blue/10 to-iridescent-violet/10',
      borderColor: 'border-iridescent-blue/20',
      fields: [
        { key: 'businessName', label: 'Nombre del Negocio', placeholder: 'Ej: TechStart Solutions', aiEnabled: true },
        { key: 'businessDescription', label: 'Descripción del Negocio', placeholder: 'Describe brevemente tu negocio y lo que hace...', multiline: true, aiEnabled: true },
        { key: 'industry', label: 'Industria/Sector', placeholder: 'Ej: Tecnología, Retail, Servicios Financieros', aiEnabled: true },
      ]
    },
    {
      id: 'market',
      title: 'Mercado y Clientes',
      icon: Target,
      color: 'from-iridescent-violet/10 to-iridescent-cyan/10',
      borderColor: 'border-iridescent-violet/20',
      fields: [
        { key: 'targetMarket', label: 'Mercado Objetivo', placeholder: 'Describe tu mercado objetivo y audiencia...', multiline: true, aiEnabled: true },
        { key: 'mainCustomers', label: 'Principales Clientes', placeholder: 'Describe el perfil de tus clientes principales...', multiline: true, aiEnabled: true },
        { key: 'geographicScope', label: 'Alcance Geográfico', placeholder: 'Ej: Local, Nacional, Internacional', aiEnabled: true },
      ]
    },
    {
      id: 'strategy',
      title: 'Estrategia y Objetivos',
      icon: TrendingUp,
      color: 'from-iridescent-cyan/10 to-iridescent-emerald/10',
      borderColor: 'border-iridescent-cyan/20',
      fields: [
        { key: 'businessGoals', label: 'Objetivos del Negocio', placeholder: 'Describe tus principales objetivos a corto y largo plazo...', multiline: true, aiEnabled: true },
        { key: 'yearlyGrowthTarget', label: 'Meta de Crecimiento Anual', placeholder: 'Ej: 50% crecimiento en ventas, 100 nuevos clientes', aiEnabled: true },
        { key: 'competitiveAdvantage', label: 'Ventaja Competitiva', placeholder: 'Qué te diferencia de la competencia...', multiline: true, aiEnabled: true },
      ]
    },
    {
      id: 'operations',
      title: 'Operaciones y Procesos',
      icon: BarChart3,
      color: 'from-iridescent-emerald/10 to-iridescent-blue/10',
      borderColor: 'border-iridescent-emerald/20',
      fields: [
        { key: 'keyProducts', label: 'Productos/Servicios Clave', placeholder: 'Describe tus principales productos o servicios...', multiline: true, aiEnabled: true },
        { key: 'salesProcess', label: 'Proceso de Ventas', placeholder: 'Describe cómo vendes tus productos/servicios...', multiline: true, aiEnabled: true },
        { key: 'marketingChannels', label: 'Canales de Marketing', placeholder: 'Ej: Redes sociales, Google Ads, Email marketing', aiEnabled: true },
      ]
    },
    {
      id: 'resources',
      title: 'Recursos y Estructura',
      icon: Users,
      color: 'from-iridescent-blue/10 to-iridescent-violet/10',
      borderColor: 'border-iridescent-blue/20',
      fields: [
        { key: 'teamStructure', label: 'Estructura del Equipo', placeholder: 'Describe la organización de tu equipo...', multiline: true, aiEnabled: true },
        { key: 'technologyStack', label: 'Stack Tecnológico', placeholder: 'Herramientas y tecnologías que utilizas...', aiEnabled: true },
        { key: 'budgetRange', label: 'Rango de Presupuesto', placeholder: 'Ej: $5K-10K mensual para marketing', aiEnabled: true },
      ]
    },
    {
      id: 'challenges',
      title: 'Desafíos y Métricas',
      icon: Lightbulb,
      color: 'from-iridescent-violet/10 to-iridescent-cyan/10',
      borderColor: 'border-iridescent-violet/20',
      fields: [
        { key: 'currentChallenges', label: 'Desafíos Actuales', placeholder: 'Principales retos que enfrenta tu negocio...', multiline: true, aiEnabled: true },
        { key: 'successMetrics', label: 'Métricas de Éxito', placeholder: 'Cómo mides el éxito de tu negocio...', multiline: true, aiEnabled: true },
        { key: 'timeframe', label: 'Marco Temporal', placeholder: 'Ej: Objetivos para los próximos 6-12 meses', aiEnabled: true },
      ]
    },
    {
      id: 'financial',
      title: 'Información Financiera',
      icon: DollarSign,
      color: 'from-iridescent-cyan/10 to-iridescent-emerald/10',
      borderColor: 'border-iridescent-cyan/20',
      fields: [
        { key: 'monthlyRevenue', label: 'Ingresos Mensuales Aproximados', placeholder: 'Ej: $10K-50K, $50K-100K, $100K+', aiEnabled: true },
        { key: 'businessModel', label: 'Modelo de Negocio Detallado', placeholder: 'Describe cómo generas ingresos...', multiline: true, aiEnabled: true },
      ]
    }
  ];

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No se encontró el perfil
          </h3>
          <p className="text-gray-500">
            No se pudo cargar la información del perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 p-8 mb-8 border border-iridescent-blue/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-liquid-surface/30 hover:bg-liquid-surface/50 mr-4 transition-all duration-300 liquid-button border border-liquid-border hover:border-iridescent-blue/30"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-iridescent-blue/30 to-iridescent-violet/30 mr-4 liquid-glow-hover organic-shape">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
                <Brain className="w-8 h-8 mr-3 text-iridescent-cyan" />
                Perfil de Negocio
              </h1>
              <p className="text-gray-300 flex items-center text-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {formData.businessName || 'Información detallada para análisis personalizados'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <Edit3 className="h-5 w-5 mr-2" />
                Editar Perfil
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    // Restaurar datos originales
                    if (userProfile) {
                      setFormData({
                        businessType: userProfile.business_type,
                        revenueModel: userProfile.revenue_model,
                        businessStage: userProfile.business_stage,
                        mainObjective: userProfile.main_objective,
                        digitalizationLevel: userProfile.digitalization_level,
                        employeeCount: userProfile.employee_count,
                        businessName: userProfile.business_name || '',
                        businessDescription: userProfile.business_description || '',
                        industry: userProfile.industry || '',
                        targetMarket: userProfile.target_market || '',
                        businessGoals: userProfile.business_goals || '',
                        currentChallenges: userProfile.current_challenges || '',
                        competitiveAdvantage: userProfile.competitive_advantage || '',
                        monthlyRevenue: userProfile.monthly_revenue || '',
                        yearlyGrowthTarget: userProfile.yearly_growth_target || '',
                        keyProducts: userProfile.key_products || '',
                        mainCustomers: userProfile.main_customers || '',
                        geographicScope: userProfile.geographic_scope || '',
                        businessModel: userProfile.business_model || '',
                        technologyStack: userProfile.technology_stack || '',
                        marketingChannels: userProfile.marketing_channels || '',
                        salesProcess: userProfile.sales_process || '',
                        teamStructure: userProfile.team_structure || '',
                        budgetRange: userProfile.budget_range || '',
                        timeframe: userProfile.timeframe || '',
                        successMetrics: userProfile.success_metrics || '',
                      });
                    }
                  }}
                  className="px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 rounded-2xl transition-all duration-300 liquid-button border border-liquid-border hover:border-gray-400 text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <>
                      <div className="liquid-loader w-5 h-5 mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="liquid-card bg-green-900/20 border border-green-500/30 p-4 rounded-2xl mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
            <p className="text-green-300 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Basic Profile Info */}
      <div className="liquid-card bg-liquid-surface/40 backdrop-blur-xl p-8 mb-8 border border-liquid-border">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Building2 className="w-6 h-6 mr-3 text-iridescent-blue" />
          Información Base del Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="liquid-card bg-gradient-to-br from-iridescent-blue/10 to-iridescent-violet/10 p-6 rounded-2xl border border-iridescent-blue/20">
            <p className="text-sm text-gray-400 mb-2">Tipo de Negocio</p>
            <p className="font-semibold text-white text-lg">{userProfile.business_type}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-violet/10 to-iridescent-cyan/10 p-6 rounded-2xl border border-iridescent-violet/20">
            <p className="text-sm text-gray-400 mb-2">Modelo de Ingresos</p>
            <p className="font-semibold text-white text-lg">{userProfile.revenue_model}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-cyan/10 to-iridescent-emerald/10 p-6 rounded-2xl border border-iridescent-cyan/20">
            <p className="text-sm text-gray-400 mb-2">Etapa del Negocio</p>
            <p className="font-semibold text-white text-lg">{userProfile.business_stage}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-emerald/10 to-iridescent-blue/10 p-6 rounded-2xl border border-iridescent-emerald/20">
            <p className="text-sm text-gray-400 mb-2">Objetivo Principal</p>
            <p className="font-semibold text-white text-lg">{userProfile.main_objective}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-blue/10 to-iridescent-violet/10 p-6 rounded-2xl border border-iridescent-blue/20">
            <p className="text-sm text-gray-400 mb-2">Nivel de Digitalización</p>
            <p className="font-semibold text-white text-lg">{userProfile.digitalization_level}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-violet/10 to-iridescent-cyan/10 p-6 rounded-2xl border border-iridescent-violet/20">
            <p className="text-sm text-gray-400 mb-2">Número de Empleados</p>
            <p className="font-semibold text-white text-lg">{userProfile.employee_count}</p>
          </div>
        </div>
      </div>

      {/* Extended Profile Sections */}
      <div className="space-y-8">
        {profileSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className={`liquid-card bg-liquid-surface/40 backdrop-blur-xl p-8 border ${section.borderColor}`}>
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <Icon className="w-6 h-6 mr-3 text-iridescent-cyan" />
                {section.title}
              </h2>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-3">
                    <label className="block text-lg font-medium text-gray-200 flex items-center justify-between">
                      {field.label}
                      {isEditing && field.aiEnabled && (
                        <AIAssistantButton
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={formData[field.key as keyof ExtendedUserProfileData] || ''}
                          userProfile={userProfile}
                          onSuggestion={(suggestion) => handleAISuggestion(field.key as keyof ExtendedUserProfileData, suggestion)}
                        />
                      )}
                    </label>
                    {isEditing ? (
                      field.multiline ? (
                        <textarea
                          value={formData[field.key as keyof ExtendedUserProfileData] || ''}
                          onChange={(e) => handleInputChange(field.key as keyof ExtendedUserProfileData, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-6 py-4 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button resize-none text-base leading-relaxed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[field.key as keyof ExtendedUserProfileData] || ''}
                          onChange={(e) => handleInputChange(field.key as keyof ExtendedUserProfileData, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-6 py-4 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button text-base"
                        />
                      )
                    ) : (
                      <div className={`liquid-card bg-gradient-to-r ${section.color} p-6 rounded-2xl border ${section.borderColor} min-h-[4rem] flex items-center`}>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {formData[field.key as keyof ExtendedUserProfileData] || (
                            <span className="text-gray-500 italic">No especificado</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Enhancement Notice */}
      <div className="liquid-card bg-gradient-to-r from-iridescent-emerald/10 to-iridescent-cyan/10 p-8 mt-8 border border-iridescent-emerald/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-iridescent-emerald to-iridescent-cyan"></div>
        <div className="flex items-start">
          <div className="p-4 rounded-2xl bg-iridescent-emerald/20 mr-6 liquid-glow-hover organic-shape flex-shrink-0">
            <Brain className="h-8 w-8 text-iridescent-emerald animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-iridescent-cyan" />
              Análisis Potenciado por IA
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              Mientras más información proporciones sobre tu negocio, más específicos y personalizados serán los análisis y recomendaciones que genere FlowForge AI. Esta información adicional permite crear reportes de consultoría de nivel McKinsey adaptados exactamente a tu contexto empresarial.
            </p>
            {isEditing && (
              <div className="flex items-center p-4 rounded-xl bg-iridescent-blue/10 border border-iridescent-blue/20">
                <Sparkles className="w-5 h-5 text-iridescent-cyan mr-3 animate-pulse flex-shrink-0" />
                <p className="text-base text-iridescent-cyan font-medium">
                  Usa los botones de IA para obtener sugerencias personalizadas en cada campo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;