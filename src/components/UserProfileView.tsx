import React, { useState, useEffect } from 'react';
import { User, Building2, Target, TrendingUp, Globe, Users, DollarSign, Calendar, BarChart3, Lightbulb, Save, Edit3, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Brain } from 'lucide-react';
import { ExtendedUserProfileData } from '../types';
import { UserProfile } from '../types/database';
import { UserProfileService } from '../services/userProfileService';
import AIAssistantButton from './AIAssistantButton';
import VoiceTextarea from './VoiceTextarea';
import VoiceTextInput from './VoiceTextInput';
import { useLanguage } from '../config/language';

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
  const { t, language } = useLanguage();
  
  // Helper function to translate profile values
  const translateProfileValue = (value: string): string => {
    return t('profileValues', value) || value;
  };
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

      if (Object.keys(updateData).length === 0) {
        setSuccess(t('userProfile', 'noChanges'));
        setTimeout(() => setSuccess(''), 2000);
        setIsLoading(false);
        return;
      }

      const updatedProfile = await UserProfileService.updateUserProfile(updateData);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
      setSuccess(t('userProfile', 'profileUpdated'));
      
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
      title: t('userProfile', 'basicInfo'),
      icon: Building2,
      color: 'from-iridescent-blue/10 to-iridescent-violet/10',
      borderColor: 'border-iridescent-blue/20',
      fields: [
        { key: 'businessName', label: t('userProfile', 'businessName'), placeholder: t('userProfile', 'businessNamePlaceholder'), aiEnabled: true },
        { key: 'businessDescription', label: t('userProfile', 'businessDescription'), placeholder: t('userProfile', 'businessDescriptionPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'industry', label: t('userProfile', 'industry'), placeholder: t('userProfile', 'industryPlaceholder'), aiEnabled: true },
      ]
    },
    {
      id: 'market',
      title: t('userProfile', 'marketAndCustomers'),
      icon: Target,
      color: 'from-iridescent-violet/10 to-iridescent-cyan/10',
      borderColor: 'border-iridescent-violet/20',
      fields: [
        { key: 'targetMarket', label: t('userProfile', 'targetMarket'), placeholder: t('userProfile', 'targetMarketPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'mainCustomers', label: t('userProfile', 'mainCustomers'), placeholder: t('userProfile', 'mainCustomersPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'geographicScope', label: t('userProfile', 'geographicScope'), placeholder: t('userProfile', 'geographicScopePlaceholder'), aiEnabled: true },
      ]
    },
    {
      id: 'strategy',
      title: t('userProfile', 'strategyAndObjectives'),
      icon: TrendingUp,
      color: 'from-iridescent-cyan/10 to-iridescent-emerald/10',
      borderColor: 'border-iridescent-cyan/20',
      fields: [
        { key: 'businessGoals', label: t('userProfile', 'businessGoals'), placeholder: t('userProfile', 'businessGoalsPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'yearlyGrowthTarget', label: t('userProfile', 'yearlyGrowthTarget'), placeholder: t('userProfile', 'yearlyGrowthTargetPlaceholder'), aiEnabled: true },
        { key: 'competitiveAdvantage', label: t('userProfile', 'competitiveAdvantage'), placeholder: t('userProfile', 'competitiveAdvantagePlaceholder'), multiline: true, aiEnabled: true },
      ]
    },
    {
      id: 'operations',
      title: t('userProfile', 'operationsAndProcesses'),
      icon: BarChart3,
      color: 'from-iridescent-emerald/10 to-iridescent-blue/10',
      borderColor: 'border-iridescent-emerald/20',
      fields: [
        { key: 'keyProducts', label: t('userProfile', 'keyProducts'), placeholder: t('userProfile', 'keyProductsPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'salesProcess', label: t('userProfile', 'salesProcess'), placeholder: t('userProfile', 'salesProcessPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'marketingChannels', label: t('userProfile', 'marketingChannels'), placeholder: t('userProfile', 'marketingChannelsPlaceholder'), aiEnabled: true },
      ]
    },
    {
      id: 'resources',
      title: t('userProfile', 'resourcesAndStructure'),
      icon: Users,
      color: 'from-iridescent-blue/10 to-iridescent-violet/10',
      borderColor: 'border-iridescent-blue/20',
      fields: [
        { key: 'teamStructure', label: t('userProfile', 'teamStructure'), placeholder: t('userProfile', 'teamStructurePlaceholder'), multiline: true, aiEnabled: true },
        { key: 'technologyStack', label: t('userProfile', 'technologyStack'), placeholder: t('userProfile', 'technologyStackPlaceholder'), aiEnabled: true },
        { key: 'budgetRange', label: t('userProfile', 'budgetRange'), placeholder: t('userProfile', 'budgetRangePlaceholder'), aiEnabled: true },
      ]
    },
    {
      id: 'challenges',
      title: t('userProfile', 'challengesAndMetrics'),
      icon: Lightbulb,
      color: 'from-iridescent-violet/10 to-iridescent-cyan/10',
      borderColor: 'border-iridescent-violet/20',
      fields: [
        { key: 'currentChallenges', label: t('userProfile', 'currentChallenges'), placeholder: t('userProfile', 'currentChallengesPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'successMetrics', label: t('userProfile', 'successMetrics'), placeholder: t('userProfile', 'successMetricsPlaceholder'), multiline: true, aiEnabled: true },
        { key: 'timeframe', label: t('userProfile', 'timeframe'), placeholder: t('userProfile', 'timeframePlaceholder'), aiEnabled: true },
      ]
    },
    {
      id: 'financial',
      title: t('userProfile', 'financialInformation'),
      icon: DollarSign,
      color: 'from-iridescent-cyan/10 to-iridescent-emerald/10',
      borderColor: 'border-iridescent-cyan/20',
      fields: [
        { key: 'monthlyRevenue', label: t('userProfile', 'monthlyRevenue'), placeholder: t('userProfile', 'monthlyRevenuePlaceholder'), aiEnabled: true },
        { key: 'businessModel', label: t('userProfile', 'businessModel'), placeholder: t('userProfile', 'businessModelPlaceholder'), multiline: true, aiEnabled: true },
      ]
    }
  ];

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {t('userProfile', 'profileNotFound')}
          </h3>
          <p className="text-gray-500">
            {t('userProfile', 'couldNotLoad')}
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
                {t('userProfile', 'businessProfile')}
              </h1>
              <p className="text-gray-300 flex items-center text-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {formData.businessName || t('userProfile', 'detailedInfo')}
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
                {t('userProfile', 'editProfile')}
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
                  {t('userProfile', 'cancel')}
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
                      {t('userProfile', 'saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {t('userProfile', 'saveChanges')}
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
          {t('userProfile', 'baseProfileInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="liquid-card bg-gradient-to-br from-iridescent-blue/10 to-iridescent-violet/10 p-6 rounded-2xl border border-iridescent-blue/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'businessType')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.business_type)}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-violet/10 to-iridescent-cyan/10 p-6 rounded-2xl border border-iridescent-violet/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'revenueModel')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.revenue_model)}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-cyan/10 to-iridescent-emerald/10 p-6 rounded-2xl border border-iridescent-cyan/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'businessStage')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.business_stage)}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-emerald/10 to-iridescent-blue/10 p-6 rounded-2xl border border-iridescent-emerald/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'mainObjective')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.main_objective)}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-blue/10 to-iridescent-violet/10 p-6 rounded-2xl border border-iridescent-blue/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'digitalizationLevel')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.digitalization_level)}</p>
          </div>
          <div className="liquid-card bg-gradient-to-br from-iridescent-violet/10 to-iridescent-cyan/10 p-6 rounded-2xl border border-iridescent-violet/20">
            <p className="text-sm text-gray-400 mb-2">{t('userProfile', 'employeeCount')}</p>
            <p className="font-semibold text-white text-lg">{translateProfileValue(userProfile.employee_count)}</p>
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
                        <VoiceTextarea
                          value={formData[field.key as keyof ExtendedUserProfileData] || ''}
                          onChange={e => handleInputChange(field.key as keyof ExtendedUserProfileData, e.target.value)}
                          placeholder={field.placeholder}
                          minRows={4}
                          disabled={false}
                          id={field.key}
                        />
                      ) : (
                        <VoiceTextInput
                          value={formData[field.key as keyof ExtendedUserProfileData] || ''}
                          onChange={e => handleInputChange(field.key as keyof ExtendedUserProfileData, e.target.value)}
                          placeholder={field.placeholder}
                          disabled={false}
                          id={field.key}
                        />
                      )
                    ) : (
                      <div className={`liquid-card bg-gradient-to-r ${section.color} p-6 rounded-2xl border ${section.borderColor} min-h-[4rem] flex items-center`}>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {formData[field.key as keyof ExtendedUserProfileData] || (
                            <span className="text-gray-500 italic">{t('userProfile', 'notSpecified')}</span>
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
              {t('userProfile', 'aiPoweredAnalysis')}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              {t('userProfile', 'aiEnhancementDescription')}
            </p>
            {isEditing && (
              <div className="flex items-center p-4 rounded-xl bg-iridescent-blue/10 border border-iridescent-blue/20">
                <Sparkles className="w-5 h-5 text-iridescent-cyan mr-3 animate-pulse flex-shrink-0" />
                <p className="text-base text-iridescent-cyan font-medium">
                  {t('userProfile', 'aiSuggestionTip')}
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